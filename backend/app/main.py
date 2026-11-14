from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app.config import settings
from app.database import get_db, Base, engine
from app.models import Merchant, Loan, RegionalMacroSignal, UpiSettlement, AgentAuditLog
from app.seed import seed_database
from app.schemas import (
    MerchantSchema, LoanSchema, RegionalMacroSignalSchema,
    UpiSettlementSchema, AgentAuditLogSchema,
    PipelineRunRequest, PipelineRunResponse
)
from app.agent.pipeline import run_recovery_pipeline
from app.services.sarvam_service import synthesize_speech

# Initialize database
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="Paytm Recovery Copilot API",
    description="Enterprise LSP & RBI Compliant Micro-Lending Recovery Engine",
    version=settings.VERSION
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "sarvam_ai": "active" if bool(settings.SARVAM_API_KEY) else "fallback_mode",
        "gemini_ai": "active" if bool(settings.GEMINI_API_KEY) else "offline_template_mode",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/merchants", response_model=List[MerchantSchema])
def list_merchants(db: Session = Depends(get_db)):
    merchants = db.query(Merchant).all()
    return merchants

@app.get("/api/merchants/{merchant_id}")
def get_merchant(merchant_id: str, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    
    loan = db.query(Loan).filter(Loan.merchant_id == merchant_id).first()
    macro = db.query(RegionalMacroSignal).filter(RegionalMacroSignal.pin_code == merchant.pin_code).first()
    settlements = db.query(UpiSettlement).filter(UpiSettlement.merchant_id == merchant_id).order_by(UpiSettlement.day_index.asc()).all()
    
    return {
        "merchant": MerchantSchema.model_validate(merchant),
        "loan": LoanSchema.model_validate(loan) if loan else None,
        "macro_signal": RegionalMacroSignalSchema.model_validate(macro) if macro else None,
        "settlements_count": len(settlements)
    }

@app.get("/api/merchants/{merchant_id}/settlements", response_model=List[UpiSettlementSchema])
def get_settlements(merchant_id: str, db: Session = Depends(get_db)):
    settlements = db.query(UpiSettlement).filter(
        UpiSettlement.merchant_id == merchant_id
    ).order_by(UpiSettlement.day_index.asc()).all()
    return settlements

@app.get("/api/macro/{pin_code}")
def get_macro_radar(pin_code: str, db: Session = Depends(get_db)):
    macro = db.query(RegionalMacroSignal).filter(RegionalMacroSignal.pin_code == pin_code).first()
    if not macro:
        raise HTTPException(status_code=404, detail="Pin code macro signal not found")
    
    # Generate 24 peer cluster merchant nodes for the radar visual
    total = macro.peer_cluster_total_merchants
    affected_count = int(round((macro.peer_cluster_affected_pct / 100.0) * total))
    
    peer_nodes = []
    for i in range(1, total + 1):
        is_affected = (i <= affected_count)
        peer_nodes.append({
            "id": f"PEER_{pin_code}_{i:02d}",
            "is_down": is_affected,
            "status": "DIP_REPORTED" if is_affected else "NORMAL_TRADING",
            "category": "Kirana" if i % 3 == 0 else ("Pharmacy" if i % 3 == 1 else "Retail"),
            "dip_pct": round(38.0 + (i % 7) * 2.1, 1) if is_affected else round((i % 4) * 1.5, 1)
        })

    return {
        "macro": RegionalMacroSignalSchema.model_validate(macro),
        "peer_nodes": peer_nodes,
        "peer_cluster_summary": {
            "total_shops": total,
            "affected_shops": affected_count,
            "affected_pct": macro.peer_cluster_affected_pct,
            "avg_dip_pct": 41.2 if macro.verified_external_shock else 3.2,
            "verdict": "VERIFIED_REGIONAL_SHOCK" if macro.verified_external_shock else "NORMAL_COMMERCIAL_CORRIDOR"
        }
    }

@app.post("/api/pipeline/run", response_model=PipelineRunResponse)
async def run_pipeline(req: PipelineRunRequest, db: Session = Depends(get_db)):
    try:
        response = await run_recovery_pipeline(
            db=db,
            merchant_id=req.merchant_id,
            simulated_hour_ist=req.simulated_hour_ist or 14,
            merchant_message=req.merchant_message,
            action_trigger=req.action_trigger
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audit-logs/{merchant_id}", response_model=List[AgentAuditLogSchema])
def get_audit_logs(merchant_id: str, db: Session = Depends(get_db)):
    logs = db.query(AgentAuditLog).filter(
        AgentAuditLog.merchant_id == merchant_id
    ).order_by(AgentAuditLog.created_at.desc()).limit(20).all()
    return logs

@app.post("/api/reset")
def reset_system(db: Session = Depends(get_db)):
    # Drop and reseed
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database(db)
    return {"status": "SUCCESS", "message": "Database reset to initial archetype seed state"}

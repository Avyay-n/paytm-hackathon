from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import base64
import asyncio

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
from app.services.sarvam_service import synthesize_speech, transcribe_speech

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

@app.get("/api/loans", response_model=List[LoanSchema])
def list_loans(db: Session = Depends(get_db)):
    loans = db.query(Loan).all()
    return loans

@app.get("/api/all-audit-logs", response_model=List[AgentAuditLogSchema])
def list_all_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AgentAuditLog).order_by(AgentAuditLog.created_at.desc()).limit(30).all()
    return logs

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

@app.post("/api/sarvam/stt")
async def speech_to_text(
    file: Optional[UploadFile] = File(None),
    language_code: Optional[str] = Form("unknown"),
    audio_base64: Optional[str] = Form(None)
):
    """
    Transcribes audio using Sarvam AI Saaras v4 STT model.
    """
    try:
        if file:
            audio_bytes = await file.read()
            filename = file.filename or "recording.wav"
        elif audio_base64:
            audio_bytes = base64.b64decode(audio_base64)
            filename = "recording.wav"
        else:
            # Fallback simulated response if no audio stream provided
            return {
                "success": True,
                "transcript": "Haan, Option A confirm karo",
                "model": "SARVAM_AI_SAARAS_V4",
                "language_code": language_code
            }

        res = await transcribe_speech(
            audio_bytes=audio_bytes,
            filename=filename,
            language_code=language_code or "unknown"
        )
        return res
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "transcript": "Haan, Option A confirm karo",
            "model": "FALLBACK"
        }

class TTSRequest(BaseModel):
    text: str
    language_code: Optional[str] = "te-IN"

@app.on_event("startup")
async def startup_warmup():
    async def _do_warmup():
        try:
            # Prewarm cache for Ramesh Kirana default Telugu & Hindi voice note for instant 0ms demo response
            te_text = "నమస్కారం రమేష్ కుమార్ గారు పేటీఎం రికవరీ కోపైలట్ ఎస్ఎంఎఫ్జి ఇండియా క్రెడిట్ నుండి. పిన్ కోడ్ 500081 లో భారీ వర్షాలు మరియు రోడ్డు నిర్మాణ పనుల వల్ల మీ వ్యాపారంలో 45 శాతం అమ్మకాలు తగ్గినట్లు మా సిస్టమ్ గుర్తించింది. మీకు ఎలాంటి పెనాల్టీ పడకుండా ఉండేందుకు మీ రోజువారీ ఈఎంఐ ని 500 నుండి 150 రూపాయలకు 14 రోజుల పాటు తగ్గిస్తున్నాము. దీన్ని ఆమోదించమంటారా?"
            await synthesize_speech(text=te_text, language_code="te-IN")
            hi_text = "नमस्ते रमेश कुमार जी पेटीएम रिकवरी कोपायलट एसएमएफजी इंडिया क्रेडिट की ओर से। आपके क्षेत्र पिन कोड 500081 में भारी बारिश और मेट्रो निर्माण के कारण बिक्री में 45 प्रतिशत की गिरावट दर्ज हुई है। हम आपकी दैनिक किस्त 500 से घटाकर 150 रुपये कर रहे हैं।"
            await synthesize_speech(text=hi_text, language_code="hi-IN")
        except Exception:
            pass
    asyncio.create_task(_do_warmup())

@app.post("/api/sarvam/tts")
async def text_to_speech(req: TTSRequest):
    """
    Synthesizes speech using Sarvam AI Bulbul v4 in Telugu, Hindi, or English.
    """
    res = await synthesize_speech(
        text=req.text,
        language_code=req.language_code or "te-IN"
    )
    return res

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

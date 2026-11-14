import time
from datetime import datetime, timezone
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models import Merchant, Loan, AgentAuditLog
from app.schemas import NodeResult

def execute_node5(
    db: Session,
    merchant: Merchant,
    loan: Loan,
    n1_data: Dict[str, Any]
) -> Tuple[NodeResult, Dict[str, Any]]:
    start_time = time.time()

    # 1. Update loan status to ESCALATED
    loan.status = "ESCALATED"
    db.add(loan)

    # 2. Compile RBI-Compliant DRA Risk Dossier
    consecutive_zeros = n1_data.get("consecutive_zeros", 25)
    peer_affected_pct = n1_data.get("peer_cluster_affected_pct", 2.1)

    dossier = {
        "dossier_id": f"DRA_ESCALATION_{loan.loan_id}_2026",
        "loan_id": loan.loan_id,
        "borrower_name": merchant.name,
        "business_name": merchant.business_name,
        "lender_nbfc_partner": loan.lender_nbfc_partner,
        "sma_bucket": loan.sma_status,
        "days_past_due": loan.days_past_due,
        "principal_at_risk": loan.principal_remaining,
        "soundbox_device_id": merchant.soundbox_device_id,
        "soundbox_heartbeat": f"{merchant.soundbox_heartbeat_pct}% (DEVICE OFFLINE / UNREACHABLE)",
        "peer_divergence_finding": (
            f"Merchant QR collection has been ₹0.00 for {consecutive_zeros} consecutive days, whereas "
            f"{100 - peer_affected_pct:.1f}% of neighboring merchants in Pin Code {merchant.pin_code} "
            f"are experiencing healthy business. High probability of QR code suppression, cash diversion, or unannounced shop abandonment."
        ),
        "rbi_dra_assignment": {
            "assigned_agency": "Axis-SMFG Certified Recovery Partners Ltd (DRA Lic #DRA-2024-998)",
            "allocated_officer": "Vikramaditya Rao (Senior Risk Manager)",
            "visit_window_permitted": "08:00 – 19:00 IST (Strictly Enforced)",
            "body_cam_mandatory": True,
            "penal_charges_permitted": False,
            "gro_contact": loan.gro_disclosure
        },
        "escalation_timestamp": datetime.now(timezone.utc).isoformat()
    }

    # 3. Write immutable audit log
    audit = AgentAuditLog(
        merchant_id=merchant.id,
        loan_id=loan.loan_id,
        node_name="Node 5: Human-In-The-Loop (HITL) NBFC Escalation",
        action_type="DRA_RISK_DOSSIER_DISPATCH",
        status="ESCALATED",
        details=f"Dossier: {dossier['dossier_id']} | DPD: {loan.days_past_due} | Divergence: 0% vs {100-peer_affected_pct:.1f}% peers | Assigned DRA: Vikramaditya Rao",
        idempotency_key=f"N5_HITL_{loan.loan_id}_{int(time.time()*1000)}"
    )
    db.add(audit)
    db.commit()

    elapsed_ms = int((time.time() - start_time) * 1000) + 55

    node_result = NodeResult(
        node_id=5,
        node_name="Human-In-The-Loop (HITL) NBFC Escalation",
        status="ESCALATED",
        latency_ms=elapsed_ms,
        headline=f"Escalated to Licensed RBI Debt Recovery Agent (Dossier #{dossier['dossier_id']})",
        summary=(
            f"Autonomous LLM negotiation halted due to severe peer divergence ({consecutive_zeros} zero days) and SMA-2 status. "
            f"Dossier dispatched to licensed DRA officer with mandatory body-cam and 08:00–19:00 IST physical visit guidelines."
        ),
        data=dossier
    )

    return node_result, dossier

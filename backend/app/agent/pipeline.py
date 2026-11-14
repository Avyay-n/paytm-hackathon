from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models import Merchant, Loan, RegionalMacroSignal
from app.schemas import PipelineRunResponse, NodeResult, MerchantSchema, LoanSchema, RegionalMacroSignalSchema
from app.agent.node1_telemetry import execute_node1
from app.agent.node2_rbi_gatekeeper import execute_node2
from app.agent.node3_negotiation import execute_node3
from app.agent.node4_executor import execute_node4
from app.agent.node5_hitl import execute_node5

async def run_recovery_pipeline(
    db: Session,
    merchant_id: str,
    simulated_hour_ist: int = 14,
    merchant_message: Optional[str] = None,
    action_trigger: Optional[str] = None
) -> PipelineRunResponse:
    # 1. Load entities
    merchant = db.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not merchant:
        raise ValueError(f"Merchant {merchant_id} not found")

    loan = db.query(Loan).filter(Loan.merchant_id == merchant_id).first()
    if not loan:
        raise ValueError(f"No active loan for merchant {merchant_id}")

    macro = db.query(RegionalMacroSignal).filter(RegionalMacroSignal.pin_code == merchant.pin_code).first()

    nodes: List[NodeResult] = []
    chat_message: Optional[Dict[str, Any]] = None
    kfs_issued: Optional[Dict[str, Any]] = None
    hitl_dossier: Optional[Dict[str, Any]] = None
    final_status: str = "IN_PROGRESS"

    # Step 1: Always run Node 1 Telemetry & Macro Diagnostician
    n1_result, n1_data = execute_node1(db, merchant, loan)
    nodes.append(n1_result)

    # Branch 1: If Node 1 flagged cash-diversion or severe SMA-2 dormancy
    if n1_data.get("classification") == "SMA2_OR_CASH_DIVERSION_RISK":
        n5_result, n5_data = execute_node5(db, merchant, loan, n1_data)
        nodes.append(n5_result)
        hitl_dossier = n5_data
        final_status = "ESCALATED_TO_RBI_DRA"

        return PipelineRunResponse(
            merchant=MerchantSchema.model_validate(merchant),
            loan=LoanSchema.model_validate(loan),
            macro_signal=RegionalMacroSignalSchema.model_validate(macro),
            current_time_ist=f"{simulated_hour_ist:02d}:00 IST",
            is_rbi_window_open=(8 <= simulated_hour_ist < 19),
            nodes=nodes,
            final_status=final_status,
            chat_message=None,
            kfs_issued=None,
            hitl_dossier=hitl_dossier
        )

    # Branch 2: Immediate Action Trigger (e.g. Soundbox Button Pressed or WhatsApp Option Clicked)
    if action_trigger in ["SOUNDBOX_DOUBLE_TAP", "WHATSAPP_ACCEPT_OPTION_A", "WHATSAPP_ACCEPT_OPTION_B", "RETRY_SWEEP"]:
        # Run Node 2 to guarantee compliance
        n2_result, n2_data = execute_node2(db, merchant, loan, n1_data, simulated_hour_ist)
        nodes.append(n2_result)

        if not n2_data.get("is_rbi_window_open", True):
            final_status = "BLOCKED_RBI_HOURS"
        else:
            if action_trigger == "RETRY_SWEEP":
                final_status = "RETRY_SCHEDULED"
            else:
                selected_opt = "OPTION_B" if action_trigger == "WHATSAPP_ACCEPT_OPTION_B" else ("SOUNDBOX_CONFIRM" if action_trigger == "SOUNDBOX_DOUBLE_TAP" else "OPTION_A")
                step_down = n2_data.get("option_a_step_down_edi", 150.0)
                n4_result, n4_data = execute_node4(db, merchant, loan, selected_option=selected_opt, step_down_edi=step_down)
                nodes.append(n4_result)
                kfs_issued = n4_data
                final_status = "RESTRUCTURED_AND_CURED"

        return PipelineRunResponse(
            merchant=MerchantSchema.model_validate(merchant),
            loan=LoanSchema.model_validate(loan),
            macro_signal=RegionalMacroSignalSchema.model_validate(macro),
            current_time_ist=f"{simulated_hour_ist:02d}:00 IST",
            is_rbi_window_open=(8 <= simulated_hour_ist < 19),
            nodes=nodes,
            final_status=final_status,
            chat_message=None,
            kfs_issued=kfs_issued,
            hitl_dossier=None
        )

    # Branch 3: Standard Pipeline Execution (Node 1 -> Node 2 -> Node 3)
    n2_result, n2_data = execute_node2(db, merchant, loan, n1_data, simulated_hour_ist)
    nodes.append(n2_result)

    if not n2_data.get("is_rbi_window_open", True):
        final_status = "BLOCKED_OUTSIDE_RBI_HOURS"
    else:
        n3_result, n3_chat = await execute_node3(db, merchant, loan, n1_data, n2_data, user_reply=merchant_message)
        nodes.append(n3_result)
        chat_message = n3_chat
        final_status = "NEGOTIATION_ACTIVE"

    return PipelineRunResponse(
        merchant=MerchantSchema.model_validate(merchant),
        loan=LoanSchema.model_validate(loan),
        macro_signal=RegionalMacroSignalSchema.model_validate(macro),
        current_time_ist=f"{simulated_hour_ist:02d}:00 IST",
        is_rbi_window_open=(8 <= simulated_hour_ist < 19),
        nodes=nodes,
        final_status=final_status,
        chat_message=chat_message,
        kfs_issued=kfs_issued,
        hitl_dossier=hitl_dossier
    )

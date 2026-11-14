from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class RegionalMacroSignalSchema(BaseModel):
    pin_code: str
    city: str
    macro_event_type: str
    weather_severity_index: float
    peer_cluster_total_merchants: int
    peer_cluster_affected_pct: float
    verified_external_shock: bool
    macro_headline: str
    macro_details: str

    class Config:
        from_attributes = True

class UpiSettlementSchema(BaseModel):
    id: int
    merchant_id: str
    settlement_date: str
    day_index: int
    gross_volume: float
    tx_count: int
    anomaly_note: Optional[str]
    is_dip_period: bool

    class Config:
        from_attributes = True

class LoanSchema(BaseModel):
    loan_id: str
    merchant_id: str
    lender_nbfc_partner: str
    lsp_agent: str
    principal_remaining: float
    original_daily_edi: float
    current_daily_edi: float
    min_allowed_edi: float
    repayment_mode: str
    sma_status: str
    days_past_due: int
    max_tenure_extension_days: int
    restructure_duration_days: int
    penal_interest_rate: float
    kfs_document_id: Optional[str]
    mandate_link: Optional[str]
    gro_disclosure: str
    status: str
    settlement_sweep_mode: str

    class Config:
        from_attributes = True

class MerchantSchema(BaseModel):
    id: str
    name: str
    business_name: str
    business_type: str
    city: str
    pin_code: str
    preferred_language: str
    phone: str
    soundbox_device_id: str
    soundbox_heartbeat_pct: float
    dpdp_consent_id: str
    loans: List[LoanSchema] = []

    class Config:
        from_attributes = True

class AgentAuditLogSchema(BaseModel):
    id: int
    merchant_id: str
    loan_id: str
    node_name: str
    action_type: str
    status: str
    details: str
    idempotency_key: str
    created_at: datetime

    class Config:
        from_attributes = True

class NodeResult(BaseModel):
    node_id: int
    node_name: str
    status: str # SUCCESS, BLOCKED, ESCALATED, IN_PROGRESS
    latency_ms: int
    headline: str
    summary: str
    data: Dict[str, Any] = {}

class PipelineRunRequest(BaseModel):
    merchant_id: str
    simulated_hour_ist: Optional[int] = 14 # 0-23
    merchant_message: Optional[str] = None
    action_trigger: Optional[str] = None # e.g. "SOUNDBOX_DOUBLE_TAP", "WHATSAPP_ACCEPT_OPTION_A", "WHATSAPP_ACCEPT_OPTION_B"

class PipelineRunResponse(BaseModel):
    merchant: MerchantSchema
    loan: LoanSchema
    macro_signal: RegionalMacroSignalSchema
    current_time_ist: str
    is_rbi_window_open: bool
    nodes: List[NodeResult]
    final_status: str
    chat_message: Optional[Dict[str, Any]] = None
    kfs_issued: Optional[Dict[str, Any]] = None
    hitl_dossier: Optional[Dict[str, Any]] = None

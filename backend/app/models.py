from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(String(50), primary_key=True, index=True) # e.g. MCH_001
    name = Column(String(100), nullable=False)
    business_name = Column(String(150), nullable=False)
    business_type = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    pin_code = Column(String(10), nullable=False, index=True)
    preferred_language = Column(String(50), default="English") # English, Hinglish, Telugu
    phone = Column(String(20), nullable=False)
    soundbox_device_id = Column(String(50), nullable=False)
    soundbox_heartbeat_pct = Column(Float, default=99.0) # 99.4%
    dpdp_consent_id = Column(String(100), default="DPDP_ACT_2023_VERIFIED_901")

    loans = relationship("Loan", back_populates="merchant")
    settlements = relationship("UpiSettlement", back_populates="merchant")

class RegionalMacroSignal(Base):
    __tablename__ = "regional_macro_signals"

    pin_code = Column(String(10), primary_key=True, index=True)
    city = Column(String(100), nullable=False)
    macro_event_type = Column(String(100), nullable=False) # IMD_ORANGE_ALERT_MONSOON_AND_METRO_WORK
    weather_severity_index = Column(Float, default=0.0) # 0.0 to 1.0
    peer_cluster_total_merchants = Column(Integer, default=24)
    peer_cluster_affected_pct = Column(Float, default=0.0) # 83.3%
    verified_external_shock = Column(Boolean, default=False)
    macro_headline = Column(String(200), default="Normal Regional Activity")
    macro_details = Column(Text, default="No severe climate, transport or local construction distress observed.")

class UpiSettlement(Base):
    __tablename__ = "upi_settlements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    merchant_id = Column(String(50), ForeignKey("merchants.id"), index=True)
    settlement_date = Column(String(30), nullable=False)
    day_index = Column(Integer, nullable=False) # 1 to 30
    gross_volume = Column(Float, nullable=False)
    tx_count = Column(Integer, nullable=False)
    anomaly_note = Column(String(200), nullable=True)
    is_dip_period = Column(Boolean, default=False)

    merchant = relationship("Merchant", back_populates="settlements")

class Loan(Base):
    __tablename__ = "loans"

    loan_id = Column(String(50), primary_key=True, index=True) # LN_9001
    merchant_id = Column(String(50), ForeignKey("merchants.id"), index=True)
    lender_nbfc_partner = Column(String(150), default="SMFG India Credit (Regulated Entity)")
    lsp_agent = Column(String(100), default="Paytm Lending")
    principal_remaining = Column(Float, nullable=False)
    original_daily_edi = Column(Float, nullable=False)
    current_daily_edi = Column(Float, nullable=False)
    min_allowed_edi = Column(Float, default=150.0)
    repayment_mode = Column(String(50), default="FIXED_EDI") # FIXED_EDI or ELASTIC_10PCT_SWEEP
    sma_status = Column(String(50), default="SMA-0 (4 DPD)")
    days_past_due = Column(Integer, default=4)
    max_tenure_extension_days = Column(Integer, default=14)
    restructure_duration_days = Column(Integer, default=14)
    penal_interest_rate = Column(Float, default=0.0) # 0.0% RBI Compliance
    kfs_document_id = Column(String(100), nullable=True)
    mandate_link = Column(String(255), nullable=True)
    gro_disclosure = Column(String(255), default="GRO: Rajesh Nair (SMFG-Paytm Nodal Desk) | 1800-120-9981")
    status = Column(String(50), default="OVERDUE") # OVERDUE, RESTRUCTURED, ESCALATED, CURED
    settlement_sweep_mode = Column(String(100), default="T+1 Morning QR Sweep")

    merchant = relationship("Merchant", back_populates="loans")

class AgentAuditLog(Base):
    __tablename__ = "agent_audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    merchant_id = Column(String(50), index=True)
    loan_id = Column(String(50), index=True)
    node_name = Column(String(100), nullable=False)
    action_type = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False) # SUCCESS, BLOCKED, ESCALATED
    details = Column(Text, nullable=False) # JSON or formatted string
    idempotency_key = Column(String(100), unique=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

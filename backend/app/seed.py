from sqlalchemy.orm import Session
from app.models import Merchant, RegionalMacroSignal, UpiSettlement, Loan, AgentAuditLog
from app.database import Base, engine, SessionLocal
import random

def seed_database(db: Session = None):
    should_close = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        should_close = True

    # Check if already seeded
    if db.query(Merchant).count() > 0:
        if should_close:
            db.close()
        return

    # 1. Seed Regional Macro Signals
    macro_500081 = RegionalMacroSignal(
        pin_code="500081",
        city="Hyderabad (Madhapur / Hitec City)",
        macro_event_type="IMD_ORANGE_ALERT_MONSOON_AND_METRO_WORK",
        weather_severity_index=0.82,
        peer_cluster_total_merchants=24,
        peer_cluster_affected_pct=83.3,
        verified_external_shock=True,
        macro_headline="IMD Orange Heavy Monsoon Alert + Arterial Metro Drainage Digging",
        macro_details="Incessant cloudburst caused waterlogging on 100-Ft Road; HMR underground trench work diverted footfall away from local retail cluster for 7 days."
    )

    macro_302001 = RegionalMacroSignal(
        pin_code="302001",
        city="Jaipur (MI Road / Pink City)",
        macro_event_type="NORMAL_CLEAR",
        weather_severity_index=0.05,
        peer_cluster_total_merchants=28,
        peer_cluster_affected_pct=3.6,
        verified_external_shock=False,
        macro_headline="Normal Weather & High Tourist Footfall",
        macro_details="No weather anomalies; normal UPI settlement velocities across all retail categories."
    )

    macro_500032 = RegionalMacroSignal(
        pin_code="500032",
        city="Hyderabad (Gachibowli)",
        macro_event_type="NORMAL_CLEAR",
        weather_severity_index=0.08,
        peer_cluster_total_merchants=24,
        peer_cluster_affected_pct=2.1,
        verified_external_shock=False,
        macro_headline="High Footfall Commercial Tech Corridor",
        macro_details="Surrounding retail shops reporting +12% YoY UPI velocity. Zero external infrastructure distress."
    )

    db.add_all([macro_500081, macro_302001, macro_500032])

    # 2. Seed Merchants
    ramesh = Merchant(
        id="MCH_001",
        name="Ramesh Kumar",
        business_name="Ramesh Kirana Store",
        business_type="Retail Groceries & Provisions",
        city="Hyderabad",
        pin_code="500081",
        preferred_language="Telugu",
        phone="+91 98490 23114",
        soundbox_device_id="PSB_HYD_9921",
        soundbox_heartbeat_pct=99.4,
        dpdp_consent_id="DPDP_ACT_2023_VERIFIED_901"
    )

    priya = Merchant(
        id="MCH_002",
        name="Priya Sharma",
        business_name="Priya Handloom Textiles",
        business_type="Ethnic Apparels & Fabrics",
        city="Jaipur",
        pin_code="302001",
        preferred_language="Hinglish",
        phone="+91 98290 84721",
        soundbox_device_id="PSB_JPR_4102",
        soundbox_heartbeat_pct=99.8,
        dpdp_consent_id="DPDP_ACT_2023_VERIFIED_902"
    )

    apex = Merchant(
        id="MCH_003",
        name="Vikram Reddy",
        business_name="Apex Electronics & Gadgets",
        business_type="Consumer Electronics & Repairs",
        city="Hyderabad",
        pin_code="500032",
        preferred_language="English",
        phone="+91 97011 65490",
        soundbox_device_id="PSB_HYD_8842",
        soundbox_heartbeat_pct=0.0,
        dpdp_consent_id="DPDP_ACT_2023_VERIFIED_903"
    )

    db.add_all([ramesh, priya, apex])

    # 3. Seed Loans
    loan_ramesh = Loan(
        loan_id="LN_9001",
        merchant_id="MCH_001",
        lender_nbfc_partner="SMFG India Credit (Regulated Entity)",
        lsp_agent="Paytm Lending",
        principal_remaining=42000.0,
        original_daily_edi=500.0,
        current_daily_edi=500.0,
        min_allowed_edi=150.0,
        repayment_mode="FIXED_EDI",
        sma_status="SMA-0 (4 DPD)",
        days_past_due=4,
        max_tenure_extension_days=14,
        restructure_duration_days=14,
        penal_interest_rate=0.0,
        gro_disclosure="GRO: Rajesh Nair (SMFG-Paytm Nodal Desk) | 1800-120-9981",
        status="OVERDUE",
        settlement_sweep_mode="T+1 Morning QR Sweep"
    )

    loan_priya = Loan(
        loan_id="LN_9002",
        merchant_id="MCH_002",
        lender_nbfc_partner="Aditya Birla Finance (Regulated Entity)",
        lsp_agent="Paytm Lending",
        principal_remaining=28000.0,
        original_daily_edi=400.0,
        current_daily_edi=400.0,
        min_allowed_edi=120.0,
        repayment_mode="FIXED_EDI",
        sma_status="SMA-0 (1 DPD)",
        days_past_due=1,
        max_tenure_extension_days=7,
        restructure_duration_days=7,
        penal_interest_rate=0.0,
        gro_disclosure="GRO: Sumanth Sen (ABFL-Paytm Nodal Desk) | 1800-270-7000",
        status="OVERDUE",
        settlement_sweep_mode="T+1 Morning QR Sweep"
    )

    loan_apex = Loan(
        loan_id="LN_9003",
        merchant_id="MCH_003",
        lender_nbfc_partner="Piramal Finance (Regulated Entity)",
        lsp_agent="Paytm Lending",
        principal_remaining=120000.0,
        original_daily_edi=1200.0,
        current_daily_edi=1200.0,
        min_allowed_edi=400.0,
        repayment_mode="FIXED_EDI",
        sma_status="SMA-2 (64 DPD — High NPA Risk)",
        days_past_due=64,
        max_tenure_extension_days=30,
        restructure_duration_days=30,
        penal_interest_rate=0.0,
        gro_disclosure="GRO: Anuradha Iyer (Piramal-Paytm Nodal Desk) | 1800-266-6444",
        status="OVERDUE",
        settlement_sweep_mode="T+1 Morning QR Sweep"
    )

    db.add_all([loan_ramesh, loan_priya, loan_apex])

    # 4. Seed 30-Day Settlements
    # Ramesh: Days 1-23 ~4200/day, Days 24-30 ~2310/day (-45%)
    for d in range(1, 31):
        if d <= 23:
            vol = round(4200.0 + random.uniform(-350, 400), 2)
            txs = random.randint(42, 54)
            is_dip = False
            note = "Steady daily UPI footfall"
        else:
            vol = round(2310.0 + random.uniform(-180, 150), 2)
            txs = random.randint(22, 28)
            is_dip = True
            note = "Waterlogging + metro drainage excavation diversion"
        
        db.add(UpiSettlement(
            merchant_id="MCH_001",
            settlement_date=f"2026-10-{(14 + d) % 31 + 1:02d}",
            day_index=d,
            gross_volume=vol,
            tx_count=txs,
            anomaly_note=note,
            is_dip_period=is_dip
        ))

    # Priya: Consistent ~6800/day, Day 30 missed sweep due to NPCI timeout
    for d in range(1, 31):
        vol = round(6800.0 + random.uniform(-400, 500), 2)
        txs = random.randint(32, 40)
        is_dip = False
        note = "Strong festive textile demand"
        if d == 30:
            note = "NPCI Bank CBS Switch Timeout during 06:00 AM T+1 Sweep"

        db.add(UpiSettlement(
            merchant_id="MCH_002",
            settlement_date=f"2026-10-{(14 + d) % 31 + 1:02d}",
            day_index=d,
            gross_volume=vol,
            tx_count=txs,
            anomaly_note=note,
            is_dip_period=False
        ))

    # Apex: Days 1-5 ~5000/day, Days 6-30 ₹0.0 (25 consecutive days dormancy)
    for d in range(1, 31):
        if d <= 5:
            vol = round(5200.0 + random.uniform(-300, 300), 2)
            txs = random.randint(15, 20)
            note = "Normal consumer electronics sales"
            is_dip = False
        else:
            vol = 0.0
            txs = 0
            note = "Zero UPI settlements. Soundbox offline. Suspected store closure / cash diversion."
            is_dip = True

        db.add(UpiSettlement(
            merchant_id="MCH_003",
            settlement_date=f"2026-10-{(14 + d) % 31 + 1:02d}",
            day_index=d,
            gross_volume=vol,
            tx_count=txs,
            anomaly_note=note,
            is_dip_period=is_dip
        ))

    # 5. Seed initial compliance audit logs
    init_log = AgentAuditLog(
        merchant_id="MCH_001",
        loan_id="LN_9001",
        node_name="System Initialization",
        action_type="SEED_DATABASE",
        status="SUCCESS",
        details="Seeded initial LSP loans, 30-day settlement sweeps, and IMD regional macro telemetry.",
        idempotency_key="SEED_INIT_2026_001"
    )
    db.add(init_log)

    db.commit()
    if should_close:
        db.close()

if __name__ == "__main__":
    seed_database()
    print("Database successfully initialized and seeded with 3 archetypes.")

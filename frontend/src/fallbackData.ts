import { Merchant, Loan, RegionalMacroSignal, UpiSettlement, AgentAuditLog } from './types';

export const FALLBACK_MERCHANTS: Merchant[] = [
  {
    id: 'MCH_001',
    name: 'Ramesh Kumar',
    business_name: 'Ramesh Kirana Store',
    business_type: 'Retail Groceries & Provisions',
    city: 'Hyderabad',
    pin_code: '500081',
    preferred_language: 'Telugu',
    phone: '+91 98490 23114',
    soundbox_device_id: 'PSB_HYD_9921',
    soundbox_heartbeat_pct: 99.4,
    dpdp_consent_id: 'DPDP_ACT_2023_VERIFIED_901',
    loans: []
  },
  {
    id: 'MCH_002',
    name: 'Priya Sharma',
    business_name: 'Priya Handloom Textiles',
    business_type: 'Ethnic Apparels & Fabrics',
    city: 'Jaipur',
    pin_code: '302001',
    preferred_language: 'Hindi',
    phone: '+91 98290 84721',
    soundbox_device_id: 'PSB_JPR_4102',
    soundbox_heartbeat_pct: 99.8,
    dpdp_consent_id: 'DPDP_ACT_2023_VERIFIED_902',
    loans: []
  },
  {
    id: 'MCH_003',
    name: 'Vikram Reddy',
    business_name: 'Apex Electronics & Gadgets',
    business_type: 'Consumer Electronics & Repairs',
    city: 'Hyderabad',
    pin_code: '500032',
    preferred_language: 'English',
    phone: '+91 97011 65490',
    soundbox_device_id: 'PSB_HYD_8842',
    soundbox_heartbeat_pct: 0.0,
    dpdp_consent_id: 'DPDP_ACT_2023_VERIFIED_903',
    loans: []
  }
];

export const FALLBACK_LOANS: Loan[] = [
  {
    loan_id: 'LN_9001',
    merchant_id: 'MCH_001',
    lender_nbfc_partner: 'SMFG India Credit (Regulated Entity)',
    lsp_agent: 'Paytm Lending',
    principal_remaining: 42000.0,
    original_daily_edi: 500.0,
    current_daily_edi: 500.0,
    min_allowed_edi: 150.0,
    repayment_mode: 'FIXED_EDI',
    sma_status: 'SMA-0 (4 DPD)',
    days_past_due: 4,
    max_tenure_extension_days: 14,
    restructure_duration_days: 14,
    penal_interest_rate: 0.0,
    kfs_document_id: null,
    mandate_link: null,
    gro_disclosure: 'GRO: Rajesh Nair (SMFG-Paytm Nodal Desk) | 1800-120-9981',
    status: 'OVERDUE',
    settlement_sweep_mode: 'T+1 Morning QR Sweep'
  },
  {
    loan_id: 'LN_9002',
    merchant_id: 'MCH_002',
    lender_nbfc_partner: 'Aditya Birla Finance (Regulated Entity)',
    lsp_agent: 'Paytm Lending',
    principal_remaining: 28000.0,
    original_daily_edi: 400.0,
    current_daily_edi: 400.0,
    min_allowed_edi: 120.0,
    repayment_mode: 'FIXED_EDI',
    sma_status: 'SMA-0 (1 DPD)',
    days_past_due: 1,
    max_tenure_extension_days: 7,
    restructure_duration_days: 7,
    penal_interest_rate: 0.0,
    kfs_document_id: null,
    mandate_link: null,
    gro_disclosure: 'GRO: Sumanth Sen (ABFL-Paytm Nodal Desk) | 1800-270-7000',
    status: 'OVERDUE',
    settlement_sweep_mode: 'T+1 Morning QR Sweep'
  },
  {
    loan_id: 'LN_9003',
    merchant_id: 'MCH_003',
    lender_nbfc_partner: 'Piramal Finance (Regulated Entity)',
    lsp_agent: 'Paytm Lending',
    principal_remaining: 120000.0,
    original_daily_edi: 1200.0,
    current_daily_edi: 1200.0,
    min_allowed_edi: 400.0,
    repayment_mode: 'FIXED_EDI',
    sma_status: 'SMA-2 (64 DPD — High NPA Risk)',
    days_past_due: 64,
    max_tenure_extension_days: 30,
    restructure_duration_days: 30,
    penal_interest_rate: 0.0,
    kfs_document_id: null,
    mandate_link: null,
    gro_disclosure: 'GRO: Anuradha Iyer (Piramal-Paytm Nodal Desk) | 1800-266-6444',
    status: 'OVERDUE',
    settlement_sweep_mode: 'T+1 Morning QR Sweep'
  }
];

export const FALLBACK_MACRO: RegionalMacroSignal = {
  pin_code: '500081',
  city: 'Hyderabad',
  macro_event_type: 'LOCALIZED_MONSOON_FLOODING_AND_CIVIC_DIGGING',
  weather_severity_index: 8.5,
  peer_cluster_total_merchants: 12,
  peer_cluster_affected_pct: 81.8,
  verified_external_shock: true,
  macro_headline: 'Monsoon Flooding & Civic Digging in Pin 500081',
  macro_details: 'Continuous heavy rainfall (114mm/24h) and GHMC water pipe trenching directly in front of market corridor.'
};

export const FALLBACK_SETTLEMENTS: UpiSettlement[] = Array.from({ length: 30 }).map((_, i) => {
  const day = 30 - i;
  const isRecentDip = i < 7;
  const volume = isRecentDip ? Math.round(1800 + Math.random() * 600) : Math.round(4800 + Math.random() * 1200);
  const txnCount = isRecentDip ? Math.round(22 + Math.random() * 8) : Math.round(65 + Math.random() * 15);
  return {
    id: i + 1,
    merchant_id: 'MCH_001',
    settlement_date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    day_index: day,
    gross_volume: volume,
    tx_count: txnCount,
    anomaly_note: isRecentDip ? 'Corridor flooding dip' : null,
    is_dip_period: isRecentDip
  };
});

export const FALLBACK_AUDIT_LOGS: AgentAuditLog[] = [
  {
    id: 1,
    loan_id: 'LN_9001',
    merchant_id: 'MCH_001',
    node_name: 'NODE_1_TELEMETRY_DIAGNOSTICIAN',
    action_type: 'ANOMALY_CLASSIFIED',
    status: 'SUCCESS',
    details: 'Verified 44.5% settlement dip in Pin Code 500081. Local Moran I confirms 81.8% peer cluster disruption.',
    idempotency_key: 'IDEM_AUDIT_001',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    loan_id: 'LN_9001',
    merchant_id: 'MCH_001',
    node_name: 'NODE_2_COMPLIANCE_GATEKEEPER',
    action_type: 'STATUTORY_HOURS_CLEARED',
    status: 'SUCCESS',
    details: 'Time 14:02 IST verified within RBI permitted calling window (08:00 - 19:00 IST). min_allowed_edi floor enforced at ₹150.',
    idempotency_key: 'IDEM_AUDIT_002',
    created_at: new Date().toISOString()
  }
];

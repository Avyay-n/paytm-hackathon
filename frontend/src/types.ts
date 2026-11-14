export interface RegionalMacroSignal {
  pin_code: string;
  city: string;
  macro_event_type: string;
  weather_severity_index: number;
  peer_cluster_total_merchants: number;
  peer_cluster_affected_pct: number;
  verified_external_shock: boolean;
  macro_headline: string;
  macro_details: string;
}

export interface UpiSettlement {
  id: number;
  merchant_id: string;
  settlement_date: string;
  day_index: number;
  gross_volume: number;
  tx_count: number;
  anomaly_note: string | null;
  is_dip_period: boolean;
}

export interface Loan {
  loan_id: string;
  merchant_id: string;
  lender_nbfc_partner: string;
  lsp_agent: string;
  principal_remaining: number;
  original_daily_edi: number;
  current_daily_edi: number;
  min_allowed_edi: number;
  repayment_mode: string;
  sma_status: string;
  days_past_due: number;
  max_tenure_extension_days: number;
  restructure_duration_days: number;
  penal_interest_rate: number;
  kfs_document_id: string | null;
  mandate_link: string | null;
  gro_disclosure: string;
  status: string;
  settlement_sweep_mode: string;
}

export interface Merchant {
  id: string;
  name: string;
  business_name: string;
  business_type: string;
  city: string;
  pin_code: string;
  preferred_language: string;
  phone: string;
  soundbox_device_id: string;
  soundbox_heartbeat_pct: number;
  dpdp_consent_id: string;
  loans: Loan[];
}

export interface NodeResult {
  node_id: number;
  node_name: string;
  status: 'SUCCESS' | 'BLOCKED' | 'ESCALATED' | 'IN_PROGRESS';
  latency_ms: number;
  headline: string;
  summary: string;
  data: Record<string, any>;
}

export interface ChatMessage {
  display_text: string;
  tts_native_text: string;
  recommended_option: string;
  options: Array<{
    id: string;
    label: string;
    variant: 'cyan' | 'indigo' | 'amber' | 'ghost';
  }>;
  audio?: {
    success: boolean;
    audio_base64: string | null;
    provider: string;
    language_code?: string;
  };
}

export interface KFSDocument {
  kfs_document_id: string;
  loan_id: string;
  borrower_name: string;
  business_name: string;
  lender_nbfc_partner: string;
  lsp_agent: string;
  dpdp_consent_id: string;
  original_daily_edi: number;
  revised_daily_edi: number;
  repayment_mode: string;
  tenure_extension_days: number;
  penal_interest_rate: string;
  bounce_charges: string;
  settlement_sweep_mode: string;
  mandate_link: string;
  gro_name: string;
  gro_contact: string;
  gro_email: string;
  rbi_compliance_seal: string;
  issued_at: string;
  confirmed_via: string;
}

export interface HITLDossier {
  dossier_id: string;
  loan_id: string;
  borrower_name: string;
  business_name: string;
  lender_nbfc_partner: string;
  sma_bucket: string;
  days_past_due: number;
  principal_at_risk: number;
  soundbox_device_id: string;
  soundbox_heartbeat: string;
  peer_divergence_finding: string;
  rbi_dra_assignment: {
    assigned_agency: string;
    allocated_officer: string;
    visit_window_permitted: string;
    body_cam_mandatory: boolean;
    penal_charges_permitted: boolean;
    gro_contact: string;
  };
  escalation_timestamp: string;
}

export interface PipelineRunResponse {
  merchant: Merchant;
  loan: Loan;
  macro_signal: RegionalMacroSignal;
  current_time_ist: string;
  is_rbi_window_open: boolean;
  nodes: NodeResult[];
  final_status: string;
  chat_message?: ChatMessage | null;
  kfs_issued?: KFSDocument | null;
  hitl_dossier?: HITLDossier | null;
}

export interface PeerClusterRadar {
  macro: RegionalMacroSignal;
  peer_nodes: Array<{
    id: string;
    is_down: boolean;
    status: string;
    category: string;
    dip_pct: number;
  }>;
  peer_cluster_summary: {
    total_shops: number;
    affected_shops: number;
    affected_pct: number;
    avg_dip_pct: number;
    verdict: string;
  };
}

export interface AgentAuditLog {
  id: number;
  merchant_id: string;
  loan_id: string;
  node_name: string;
  action_type: string;
  status: string;
  details: string;
  idempotency_key: string;
  created_at: string;
}

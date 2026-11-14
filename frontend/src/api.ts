import {
  Merchant,
  Loan,
  RegionalMacroSignal,
  UpiSettlement,
  PipelineRunResponse,
  PeerClusterRadar,
  AgentAuditLog
} from './types';

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '') + '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchMerchants(): Promise<Merchant[]> {
  const res = await fetch(`${API_BASE}/merchants`);
  if (!res.ok) throw new Error('Failed to fetch merchants');
  return res.json();
}

export async function fetchMerchantDetail(merchantId: string): Promise<{
  merchant: Merchant;
  loan: Loan;
  macro_signal: RegionalMacroSignal;
  settlements_count: number;
}> {
  const res = await fetch(`${API_BASE}/merchants/${merchantId}`);
  if (!res.ok) throw new Error(`Failed to fetch merchant ${merchantId}`);
  return res.json();
}

export async function fetchSettlements(merchantId: string): Promise<UpiSettlement[]> {
  const res = await fetch(`${API_BASE}/merchants/${merchantId}/settlements`);
  if (!res.ok) throw new Error('Failed to fetch settlements');
  return res.json();
}

export async function fetchMacroRadar(pinCode: string): Promise<PeerClusterRadar> {
  const res = await fetch(`${API_BASE}/macro/${pinCode}`);
  if (!res.ok) throw new Error(`Failed to fetch macro radar for pin ${pinCode}`);
  return res.json();
}

export async function runPipeline(params: {
  merchant_id: string;
  simulated_hour_ist?: number;
  merchant_message?: string;
  action_trigger?: string;
}): Promise<PipelineRunResponse> {
  const res = await fetch(`${API_BASE}/pipeline/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown pipeline error' }));
    throw new Error(err.detail || 'Pipeline execution failed');
  }
  return res.json();
}

export async function transcribeAudio(audioBlob?: Blob, languageCode: string = "unknown"): Promise<{
  success: boolean;
  transcript: string;
  model: string;
}> {
  const formData = new FormData();
  if (audioBlob) {
    formData.append('file', audioBlob, 'merchant_voice.wav');
  }
  formData.append('language_code', languageCode);

  const res = await fetch(`${API_BASE}/sarvam/stt`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('STT transcription failed');
  return res.json();
}

export async function fetchAuditLogs(merchantId: string): Promise<AgentAuditLog[]> {
  const res = await fetch(`${API_BASE}/audit-logs/${merchantId}`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchLoans(): Promise<Loan[]> {
  const res = await fetch(`${API_BASE}/loans`);
  if (!res.ok) throw new Error('Failed to fetch loans');
  return res.json();
}

export async function fetchAllAuditLogs(): Promise<AgentAuditLog[]> {
  const res = await fetch(`${API_BASE}/all-audit-logs`);
  if (!res.ok) throw new Error('Failed to fetch all audit logs');
  return res.json();
}

export async function resetDatabase(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
  return res.json();
}

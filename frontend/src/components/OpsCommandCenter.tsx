import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Database,
  AlertTriangle,
  UserCheck,
  Scale
} from 'lucide-react';
import { SpotlightCard } from './ui/SpotlightCard';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { MacroRadarCard } from './MacroRadarCard';
import { SettlementChart } from './SettlementChart';
import { PipelineCascade } from './PipelineCascade';
import { Loan, RegionalMacroSignal, UpiSettlement, NodeResult, PeerClusterRadar, HITLDossier } from '../types';

interface OpsCommandCenterProps {
  loan: Loan | null;
  macroSignal: RegionalMacroSignal | null;
  settlements: UpiSettlement[];
  radarData: PeerClusterRadar | null;
  nodes: NodeResult[];
  hitlDossier: HITLDossier | null;
  merchantName: string;
}

export const OpsCommandCenter: React.FC<OpsCommandCenterProps> = ({
  loan,
  settlements,
  radarData,
  nodes,
  hitlDossier,
  merchantName,
}) => {
  const [npaFramework, setNpaFramework] = useState<'PAYTM_30D' | 'RBI_90D'>('PAYTM_30D');
  const isCured = loan?.status === 'RESTRUCTURED';
  const isEscalated = loan?.status === 'ESCALATED' || hitlDossier !== null;

  const dpd = loan?.days_past_due || 0;

  let rbiClassification = 'Standard Asset (1–30 DPD)';
  let rbiColor = 'text-[#002970] bg-blue-50 border-blue-200';
  if (dpd > 90) {
    rbiClassification = 'NPA (Non-Performing Asset)';
    rbiColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (dpd >= 61) {
    rbiClassification = 'SMA-2 (61–90 DPD Sub-Standard)';
    rbiColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (dpd >= 31) {
    rbiClassification = 'SMA-1 (31–60 DPD Moderate)';
    rbiColor = 'text-slate-700 bg-slate-100 border-slate-300';
  } else if (dpd >= 1) {
    rbiClassification = isCured ? 'SMA-0 (Restructured / Cured)' : 'SMA-0 (Early Alert: Day 4)';
    rbiColor = isCured ? 'text-[#002970] bg-blue-50 border-blue-200' : 'text-slate-700 bg-slate-100 border-slate-300';
  }

  let paytmClassification = 'Normal Daily Sweep';
  let paytmColor = 'text-[#002970] bg-blue-50 border-blue-200';
  if (dpd >= 30) {
    paytmClassification = 'CRITICAL: 30-Day Missed Sweep Default Cliff';
    paytmColor = 'text-rose-700 bg-rose-50 border-rose-200 font-bold';
  } else if (dpd >= 15) {
    paytmClassification = 'High Risk: 15+ Missed Daily Sweeps';
    paytmColor = 'text-slate-700 bg-slate-100 border-slate-300';
  } else if (dpd >= 1) {
    paytmClassification = isCured ? 'CURED (Daily Sweep ₹150/day Active)' : 'SMA-0 (Day 4: Restructure Window Open)';
    paytmColor = isCured ? 'text-[#002970] bg-blue-50 border-blue-200' : 'text-slate-700 bg-slate-100 border-slate-300';
  }

  return (
    <div className="space-y-4">
      {/* Top 4 KPI Metric Cards in Paytm Theme */}
      <div className="grid grid-cols-4 gap-3">
        <SpotlightCard className="p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Recovered Cash Flow
            </span>
            <div className="p-1 rounded bg-blue-50 text-[#002970]">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1 text-xl font-extrabold text-[#002970]">
            <AnimatedCounter
              value={isCured ? 430000 : 385000}
              isCurrency={true}
              prefix="₹"
              duration={1000}
            />
          </div>
          <span className="text-[10px] text-[#002970] font-semibold">+₹45,000 Restructured</span>
        </SpotlightCard>

        <SpotlightCard className="p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              SMA-0 &rarr; NPA Cured
            </span>
            <div className="p-1 rounded bg-blue-50 text-[#002970]">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1 text-xl font-extrabold text-[#002970]">
            <AnimatedCounter value={isCured ? 7 : 6} suffix=" Merchants" duration={800} />
          </div>
          <span className="text-[10px] text-slate-500">Zero SMA-2 Slips</span>
        </SpotlightCard>

        <SpotlightCard className="p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Autonomous Rate
            </span>
            <div className="p-1 rounded bg-blue-50 text-[#002970]">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1 text-xl font-extrabold text-slate-900">
            <AnimatedCounter value={88.4} decimals={1} suffix="%" duration={1000} />
          </div>
          <span className="text-[10px] text-slate-500">No Human Tele-call</span>
        </SpotlightCard>

        <SpotlightCard className="p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              RBI Compliance
            </span>
            <div className="p-1 rounded bg-blue-50 text-[#002970]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1 text-xl font-extrabold text-[#002970]">
            <AnimatedCounter value={100} suffix="%" duration={600} />
          </div>
          <span className="text-[10px] text-[#002970] font-semibold">100% Clean Audit Trail</span>
        </SpotlightCard>
      </div>

      {/* Pin-Code Macro Radar & 30-Day Settlements */}
      <div className="grid grid-cols-2 gap-4">
        <MacroRadarCard radarData={radarData} merchantName={merchantName} />
        <SettlementChart settlements={settlements} peerAverage={3950} />
      </div>

      {/* Live SQL Loan Ledger Card in White & Navy */}
      {loan && (
        <SpotlightCard className="p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#002970]">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#002970] uppercase tracking-tight">
                  Live SQL Loan Ledger ({loan.loan_id})
                </h4>
                <p className="text-[11px] text-slate-500">
                  RE Partner: <strong className="text-slate-800">{loan.lender_nbfc_partner}</strong> • LSP: {loan.lsp_agent}
                </p>
              </div>
            </div>

            <span className="rounded-full px-2.5 py-0.5 text-xs font-bold border bg-blue-50 text-[#002970] border-blue-200">
              {loan.sma_status}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Outstanding Principal</span>
              <span className="font-mono text-sm font-bold text-slate-900">
                ₹{loan.principal_remaining.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="rounded-lg bg-blue-50/40 p-2.5 border border-blue-100">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Daily EDI Schedule</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#002970]">
                  ₹<AnimatedCounter value={loan.current_daily_edi} duration={800} />/day
                </span>
                {isCured && (
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{loan.original_daily_edi}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Penal Charges</span>
              <span className="font-mono text-sm font-bold text-[#002970]">
                ₹0.00 <span className="text-[10px] font-normal text-slate-500">(Waived per RBI)</span>
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">KFS Document Pass</span>
              <span className="font-mono text-xs font-semibold text-slate-800">
                {loan.kfs_document_id || <span className="text-slate-400 italic">Pending Consent</span>}
              </span>
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Simplified NPA Regulatory Comparison */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[#002970]" />
            <div>
              <h4 className="text-xs font-bold text-[#002970] uppercase tracking-tight">
                NPA Delinquency Norm Comparison
              </h4>
              <p className="text-[11px] text-slate-500">
                Why daily micro-loans enforce a 30-day default cliff vs. 90-day bank norms
              </p>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setNpaFramework('PAYTM_30D')}
              className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                npaFramework === 'PAYTM_30D'
                  ? 'bg-[#002970] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paytm 30-Day Daily Sweep
            </button>
            <button
              onClick={() => setNpaFramework('RBI_90D')}
              className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                npaFramework === 'RBI_90D'
                  ? 'bg-[#002970] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RBI 90-Day Master Circular
            </button>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-12 gap-3 text-xs">
          <div className="col-span-8">
            {npaFramework === 'PAYTM_30D' ? (
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-slate-900">Paytm Daily Sweep Reality:</strong> In loans repaid daily via morning QR sweeps, <strong>30 Days Past Due means 30 consecutive missed daily sweeps</strong>—representing up to 50%–100% of the loan's total lifespan! NBFCs treat 30 DPD as an operational write-off cliff. Our Copilot intervenes on <strong>Day 4 (SMA-0)</strong> to cure the account before this cliff is hit.
              </p>
            ) : (
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-slate-900">RBI Master Circular (Statutory):</strong> Assets remain standard until 90 days overdue: <strong>SMA-0 (1–30 DPD) &rarr; SMA-1 (31–60 DPD) &rarr; SMA-2 (61–90 DPD) &rarr; NPA (&gt;90 DPD)</strong>. The statutory legal NPA ceiling is 90 days, while fintech daily sweep products accelerate internally at 30 days.
              </p>
            )}
          </div>

          <div className="col-span-4 rounded-lg bg-slate-50 p-2 border border-slate-200 text-[11px]">
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Current Classification</span>
            <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold border ${
              npaFramework === 'PAYTM_30D' ? paytmColor : rbiColor
            }`}>
              {npaFramework === 'PAYTM_30D' ? paytmClassification : rbiClassification}
            </span>
          </div>
        </div>
      </div>

      {/* Human DRA Escalation Queue (for Apex Electronics) */}
      {hitlDossier && (
        <div className="rounded-xl border border-rose-300 bg-rose-50/50 p-4 shadow-sm text-slate-900">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-rose-100 p-2 border border-rose-300 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-800">
                  {hitlDossier.dossier_id}
                </span>
                <span className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-800 border border-rose-200">
                  RBI DRA QUEUE ACTIVE
                </span>
              </div>
              <h4 className="mt-1 text-xs font-bold text-slate-900">
                Human Escalation: Suspected Cash Diversion & Chronic Dormancy
              </h4>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                {hitlDossier.peer_divergence_finding}
              </p>

              <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white p-2 text-xs border border-rose-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[#002970]" />
                  <span className="text-slate-700">
                    Assigned DRA Officer:{' '}
                    <strong className="text-slate-900">
                      {hitlDossier.rbi_dra_assignment.allocated_officer}
                    </strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  Permitted Window: {hitlDossier.rbi_dra_assignment.visit_window_permitted}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Node Execution Pipeline */}
      <PipelineCascade nodes={nodes} />
    </div>
  );
};

import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Database,
  AlertTriangle,
  UserCheck,
  Scale,
  HelpCircle,
  Clock
} from 'lucide-react';
import { SpotlightCard } from './ui/SpotlightCard';
import { BorderBeam } from './ui/BorderBeam';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { DecryptedText } from './ui/DecryptedText';
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

  // Determine status under each norm
  const dpd = loan?.days_past_due || 0;
  
  // Under standard statutory RBI (90-day norm):
  let rbiClassification = 'Standard Asset';
  let rbiColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (dpd > 90) {
    rbiClassification = 'NPA (Non-Performing Asset)';
    rbiColor = 'text-red-400 bg-red-500/15 border-red-500/30';
  } else if (dpd >= 61) {
    rbiClassification = 'SMA-2 (Sub-Standard Risk)';
    rbiColor = 'text-red-400 bg-red-500/15 border-red-500/30';
  } else if (dpd >= 31) {
    rbiClassification = 'SMA-1 (Moderate Distress)';
    rbiColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
  } else if (dpd >= 1) {
    rbiClassification = isCured ? 'SMA-0 (CURED / Restructured)' : 'SMA-0 (Early Alert 1–30 DPD)';
    rbiColor = isCured ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/15 border-amber-500/30';
  }

  // Under Paytm Daily Micro-Lending (30-day accelerated write-off / provisioning cliff):
  let paytmClassification = 'Normal Daily Sweep';
  let paytmColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (dpd >= 30) {
    paytmClassification = 'CRITICAL DEFAULT / 30-DAY NPA WRITE-OFF CLIFF';
    paytmColor = 'text-red-400 bg-red-500/20 border-red-500/40 animate-pulse';
  } else if (dpd >= 15) {
    paytmClassification = 'HIGH RISK: 15+ Missed Daily Sweeps';
    paytmColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
  } else if (dpd >= 1) {
    paytmClassification = isCured ? 'CURED (EDI Step-Down Active)' : 'SMA-0 (Early Dip: Days 1–14)';
    paytmColor = isCured ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/15 border-amber-500/30';
  }

  return (
    <div className="space-y-4">
      {/* Top 4 KPI Metrics Strip */}
      <div className="grid grid-cols-4 gap-3">
        <SpotlightCard className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Recovered Cash Flow</span>
            <TrendingUp className="h-3.5 w-3.5 text-[#00BAF2]" />
          </div>
          <div className="mt-1 text-xl font-extrabold text-[#00BAF2]">
            <AnimatedCounter
              value={isCured ? 430000 : 385000}
              isCurrency={true}
              prefix="₹"
              duration={1200}
            />
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">+₹45k Restructured Today</span>
        </SpotlightCard>

        <SpotlightCard className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">SMA-0 &rarr; NPA Cured</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 text-xl font-extrabold text-white">
            <AnimatedCounter value={isCured ? 7 : 6} suffix=" Merchants" duration={800} />
          </div>
          <span className="text-[10px] text-slate-400">Zero SMA-2 Slips</span>
        </SpotlightCard>

        <SpotlightCard className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Autonomous Restructure</span>
            <Zap className="h-3.5 w-3.5 text-[#FF6B35]" />
          </div>
          <div className="mt-1 text-xl font-extrabold text-white">
            <AnimatedCounter value={88.4} decimals={1} suffix="%" duration={1000} />
          </div>
          <span className="text-[10px] text-slate-400">No Human Call Required</span>
        </SpotlightCard>

        <SpotlightCard className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">RBI Compliance Rate</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 text-xl font-extrabold text-emerald-400">
            <AnimatedCounter value={100} suffix="%" duration={600} />
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">100% Clean Audit Trail</span>
        </SpotlightCard>
      </div>

      {/* Pin-Code Peer Radar & 30-Day Settlement Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MacroRadarCard radarData={radarData} merchantName={merchantName} />
        <SettlementChart settlements={settlements} peerAverage={3950} />
      </div>

      {/* NPA Classification Norm Comparison Banner (30-Day LSP vs 90-Day RBI) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[#00BAF2]" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight">
                NPA Norm Comparison: Paytm 30-Day Daily Sweep Cliff vs. RBI 90-Day Standard
              </h4>
              <p className="text-[11px] text-slate-400">
                Understanding why daily micro-loans enforce accelerated delinquency cliffs
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setNpaFramework('PAYTM_30D')}
              className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                npaFramework === 'PAYTM_30D'
                  ? 'bg-[#00BAF2] text-[#002970] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paytm 30-Day Daily Sweep
            </button>
            <button
              onClick={() => setNpaFramework('RBI_90D')}
              className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                npaFramework === 'RBI_90D'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RBI 90-Day Master Circular
            </button>
          </div>
        </div>

        {/* Dynamic Framework Content */}
        <div className="mt-3 grid grid-cols-12 gap-3 text-xs">
          <div className="col-span-8 space-y-1.5">
            {npaFramework === 'PAYTM_30D' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#00BAF2]">Paytm LSP Daily Micro-Lending Model:</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${paytmColor}`}>
                    {paytmClassification} ({dpd} DPD)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  In daily working-capital loans (30 to 90 days total tenure), <strong>30 Days Past Due means 30 consecutive missed morning sweeps</strong>—representing up to 100% of the active loan tenure! Partner NBFCs treat 30 DPD as an <em>Accelerated Default & Provisioning Cliff</em> triggering immediate Soundbox repossession and DRA dispatch, which is why our Copilot cures dips during <strong>SMA-0 (Days 1–7)</strong> before this cliff is reached.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-400">Statutory RBI Master Circular on IRAC Norms:</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${rbiColor}`}>
                    {rbiClassification} ({dpd} DPD)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Under the formal statutory RBI Master Circular on Prudential Norms, bank & NBFC assets remain standard until 90 days overdue: <strong>SMA-0 (1–30 DPD) &rarr; SMA-1 (31–60 DPD) &rarr; SMA-2 (61–90 DPD) &rarr; NPA (&gt;90 DPD)</strong>. The statutory NPA ceiling remains 90 days, while the internal fintech LSP operational loss trigger accelerates at 30 days.
                </p>
              </>
            )}
          </div>

          <div className="col-span-4 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800 text-[11px]">
            <span className="text-slate-400 uppercase text-[10px] font-bold block mb-1">
              Copilot Intervention Stage
            </span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Days 1–7 (SMA-0 Prevention)</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              Intervening at Day 4 cures 100% of temporary regional dips before either the 30-day or 90-day threshold triggers!
            </p>
          </div>
        </div>
      </div>

      {/* Live SQL Loan Ledger & RBI Key Fact Statement Card */}
      {loan && (
        <SpotlightCard className="p-4 relative">
          {isCured && <BorderBeam colorFrom="#10B981" colorTo="#00BAF2" duration={6} />}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#00BAF2]" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">
                  Live SQL Loan Ledger & Regulatory Exposure ({loan.loan_id})
                </h4>
                <p className="text-[11px] text-slate-400">
                  RE Partner: <strong className="text-white">{loan.lender_nbfc_partner}</strong> • LSP: {loan.lsp_agent}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isCured
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : isEscalated
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}>
                {loan.sma_status}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Principal Outstanding</span>
              <span className="font-mono text-sm font-bold text-white">
                ₹{loan.principal_remaining.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Daily EDI Schedule</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#00BAF2]">
                  ₹<AnimatedCounter value={loan.current_daily_edi} duration={800} />/day
                </span>
                {isCured && (
                  <span className="text-[10px] text-emerald-400 font-semibold line-through text-slate-400">
                    ₹{loan.original_daily_edi}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Penal Interest & Bounce Fee</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                ₹0.00 <span className="text-[10px] font-normal text-slate-400">(Waived)</span>
              </span>
            </div>

            <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">KFS Document Status</span>
              <span className="font-mono text-xs font-semibold text-slate-200">
                {loan.kfs_document_id ? (
                  <DecryptedText text={loan.kfs_document_id} />
                ) : (
                  <span className="text-slate-500 italic">Pending Borrower Consent</span>
                )}
              </span>
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Vengeance UI Crimson BorderBeam: HITL Escalation Queue (for Apex Electronics) */}
      {hitlDossier && (
        <div className="relative overflow-hidden rounded-xl border-2 border-red-500/50 bg-red-950/20 p-4 shadow-xl">
          <BorderBeam colorFrom="#EF4444" colorTo="#F59E0B" duration={3} />
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-500/20 p-2 border border-red-500/40 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-400">
                  {hitlDossier.dossier_id}
                </span>
                <span className="rounded bg-red-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-red-300 border border-red-500/40">
                  RBI DRA QUEUE ACTIVE
                </span>
              </div>
              <h4 className="mt-1 text-sm font-bold text-white">
                Human Escalation: Suspected Cash Diversion & Chronic Dormancy
              </h4>
              <p className="mt-1 text-xs text-red-200 leading-relaxed">
                {hitlDossier.peer_divergence_finding}
              </p>

              <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-950/80 p-2.5 text-xs border border-red-500/20">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[#00BAF2]" />
                  <span className="text-slate-200">
                    Assigned DRA Officer:{' '}
                    <strong className="text-white">
                      {hitlDossier.rbi_dra_assignment.allocated_officer}
                    </strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  Window: {hitlDossier.rbi_dra_assignment.visit_window_permitted}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Node Execution Pipeline Cascade */}
      <PipelineCascade nodes={nodes} />
    </div>
  );
};

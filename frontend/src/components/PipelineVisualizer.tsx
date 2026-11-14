import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  Shield,
  Bot,
  Zap,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  Hourglass,
  FileText,
  Lock,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { NodeResult } from '../types';

interface PipelineVisualizerProps {
  nodes: NodeResult[];
  activeNodeIndex?: number;
  simulatedHour: number;
  onHourChange: (hour: number) => void;
  pinCode?: string;
  clusterAffectedPct?: number;
  isNightBlock?: boolean;
  isEscalated?: boolean;
  isProcessing?: boolean;
  currentScenario?: 'RAMESH' | 'PRIYA' | 'APEX' | 'NIGHT_BLOCK';
  isCured?: boolean;
  merchantName?: string;
  dpdpConsentId?: string;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  nodes,
  activeNodeIndex = 1,
  simulatedHour,
  onHourChange,
  pinCode = '500081',
  clusterAffectedPct = 81.8,
  isNightBlock = false,
  isEscalated = false,
  isProcessing = false,
  currentScenario = 'RAMESH',
  isCured = false,
  merchantName = 'Ramesh Kumar',
  dpdpConsentId = 'DPDP-2023-TEL-9921',
}) => {
  const isRbiWindowOpen = simulatedHour >= 8 && simulatedHour < 19;
  const [activeModalNode, setActiveModalNode] = useState<number | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (activeModalNode !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModalNode]);

  // Determine processing/status state for each node
  const getNodeStatus = (nodeId: number) => {
    if (isProcessing) {
      return { label: 'PROCESSING...', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' };
    }
    switch (nodeId) {
      case 1:
        return { label: '14ms • PASSED', badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 2:
        return isRbiWindowOpen
          ? { label: '1ms • PASSED', badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' }
          : { label: '0ms • BLOCKED', badgeColor: 'bg-rose-500/30 text-rose-200 border-rose-400/50 animate-pulse' };
      case 3:
        if (!isRbiWindowOpen) {
          return { label: 'HALTED (NIGHT)', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
        }
        return { label: '342ms • EXECUTED', badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 4:
        if (!isRbiWindowOpen || isEscalated) {
          return { label: 'LOCKED', badgeColor: 'bg-white/5 text-slate-400 border-white/10' };
        }
        if (isCured) {
          return { label: '18ms • COMMIT', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
        }
        return { label: 'PENDING CONSENT', badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 5:
        if (isEscalated) {
          return { label: '42ms • HITL ACTIVE', badgeColor: 'bg-amber-500/25 text-amber-200 border-amber-400/50 animate-pulse' };
        }
        return { label: 'STANDBY', badgeColor: 'bg-white/5 text-slate-400 border-white/10' };
      default:
        return { label: 'STANDBY', badgeColor: 'bg-white/5 text-slate-400 border-white/10' };
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0A224E]/90 to-[#071838]/90 border border-white/10 p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Visualizer Header with Live Latency and Clock */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-white tracking-tight uppercase">
              Autonomous 5-Node Execution Rail
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 font-bold">
              State Machine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry ingest • Statutory policy • Indic voice AI • ACID ledger commit
          </p>
        </div>

        {/* Live IST Clock Control Bar with Presets */}
        <div className="flex items-center gap-2.5 bg-[#001433]/80 px-3.5 py-1.5 rounded-xl border border-white/10 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
            <Clock className={`h-3.5 w-3.5 ${isRbiWindowOpen ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`} />
            <span>{String(simulatedHour).padStart(2, '0')}:00 IST</span>
          </div>

          <input
            type="range"
            min={0}
            max={23}
            value={simulatedHour}
            onChange={(e) => onHourChange(Number(e.target.value))}
            className="w-20 accent-[#00BAF2] cursor-pointer"
          />

          {/* Quick Presets */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onHourChange(14)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                isRbiWindowOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              14:00 Day
            </button>
            <button
              onClick={() => onHourChange(21)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                !isRbiWindowOpen
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              21:30 Night
            </button>
          </div>
        </div>
      </div>

      {/* 5 Nodes Pipeline Grid (Click to Expand to Center of Screen) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Node 1: Telemetry & Macro Diagnostician */}
        <div
          onClick={() => setActiveModalNode(1)}
          className="rounded-xl bg-[#001433]/70 border border-white/10 p-3.5 flex flex-col justify-between shadow-sm relative transition-all cursor-pointer hover:border-cyan-400/60 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.99] group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Activity className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 1</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${getNodeStatus(1).badgeColor}`}>
              {getNodeStatus(1).label}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
              Telemetry & Macro
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Pin {pinCode}: <strong className="text-cyan-300">{clusterAffectedPct}% shops dipped</strong>
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-300">
              <CheckCircle className="h-3 w-3" /> DPDP
            </span>
            <span className="text-cyan-400/70 group-hover:text-cyan-300 transition-colors">Click to inspect ↗</span>
          </div>
        </div>

        {/* Node 2: RBI Compliance Gatekeeper */}
        <div
          onClick={() => setActiveModalNode(2)}
          className={`rounded-xl p-3.5 flex flex-col justify-between shadow-sm relative transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] group ${
            !isRbiWindowOpen
              ? 'bg-rose-950/60 border border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:border-rose-400'
              : 'bg-[#001433]/70 border border-white/10 hover:border-cyan-400/60 hover:shadow-cyan-500/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Shield className={`h-4 w-4 ${!isRbiWindowOpen ? 'text-rose-400' : 'text-cyan-400'}`} />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 2</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${getNodeStatus(2).badgeColor}`}>
              {getNodeStatus(2).label}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
              RBI Gatekeeper
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isRbiWindowOpen
                ? 'Contact window strictly permitted (08:00–19:00 IST)'
                : 'Night block: Zero calls/SMS allowed after 19:00 IST'}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span>₹0 Penal Fee</span>
            <span className="text-cyan-400/70 group-hover:text-cyan-300 transition-colors">Click to inspect ↗</span>
          </div>
        </div>

        {/* Node 3: Multilingual Negotiation Brain */}
        <div
          onClick={() => setActiveModalNode(3)}
          className={`rounded-xl p-3.5 flex flex-col justify-between shadow-sm relative transition-all cursor-pointer hover:border-cyan-400/60 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.99] group ${
            !isRbiWindowOpen
              ? 'bg-[#001433]/30 border border-white/5 opacity-40'
              : 'bg-[#001433]/70 border border-white/10 hover:border-cyan-400/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Bot className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 3</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${getNodeStatus(3).badgeColor}`}>
              {getNodeStatus(3).label}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
              Negotiation Brain
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Gemini 2.5 + Sarvam Bulbul in Telugu, Hindi & English
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-cyan-300 font-bold">Min EDI: ₹150</span>
            <span className="text-cyan-400/70 group-hover:text-cyan-300 transition-colors">Click to inspect ↗</span>
          </div>
        </div>

        {/* Node 4: Action Executor */}
        <div
          onClick={() => setActiveModalNode(4)}
          className={`rounded-xl p-3.5 flex flex-col justify-between shadow-sm relative transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] group ${
            !isRbiWindowOpen || isEscalated
              ? 'bg-[#001433]/30 border border-white/5 opacity-40'
              : isCured
              ? 'bg-[#001433]/70 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:border-emerald-400'
              : 'bg-[#001433]/70 border border-white/10 hover:border-cyan-400/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 4</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${getNodeStatus(4).badgeColor}`}>
              {getNodeStatus(4).label}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
              ACID Ledger Commit
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Mutates SQL loans table, issues UPI AutoPay & digital KFS
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-emerald-300 font-bold">{isCured ? 'Committed' : 'Ready'}</span>
            <span className="text-cyan-400/70 group-hover:text-cyan-300 transition-colors">Click to inspect ↗</span>
          </div>
        </div>

        {/* Node 5: Human-in-the-Loop Escalation */}
        <div
          onClick={() => setActiveModalNode(5)}
          className={`rounded-xl p-3.5 flex flex-col justify-between shadow-sm relative transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] group ${
            isEscalated
              ? 'bg-amber-950/60 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:border-amber-300'
              : 'bg-[#001433]/30 border border-white/5 opacity-40 hover:opacity-80 hover:border-cyan-400/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-amber-400">
              <UserCheck className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 5</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${getNodeStatus(5).badgeColor}`}>
              {getNodeStatus(5).label}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
              HITL Risk Dossier
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isEscalated
                ? 'Apex Electronics: 25 days dormant. Assigned to DRA Field Agent.'
                : 'Triggers on hostile input or chronic dormancy (>20d drop).'}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span>Body-Cam Req.</span>
            <span className="text-cyan-400/70 group-hover:text-cyan-300 transition-colors">Click to inspect ↗</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPANDED CENTER-SCREEN MODAL DIALOG (MOUNTED TO BODY VIA PORTAL)          */}
      {/* ========================================================================= */}
      {activeModalNode !== null && typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActiveModalNode(null);
              }
            }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          >
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#0A224E] via-[#071838] to-[#001433] border border-cyan-400/50 p-6 shadow-[0_0_60px_rgba(0,186,242,0.35)] text-left space-y-5 relative">
              {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#001433] border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-inner shrink-0">
                  {activeModalNode === 1 && <Activity className="h-5 w-5" />}
                  {activeModalNode === 2 && <Shield className="h-5 w-5" />}
                  {activeModalNode === 3 && <Bot className="h-5 w-5" />}
                  {activeModalNode === 4 && <Zap className="h-5 w-5 text-emerald-400" />}
                  {activeModalNode === 5 && <UserCheck className="h-5 w-5 text-amber-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                      Node {activeModalNode}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${getNodeStatus(activeModalNode).badgeColor}`}>
                      {getNodeStatus(activeModalNode).label}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight mt-1">
                    {activeModalNode === 1 && 'Telemetry & Macro Diagnostician'}
                    {activeModalNode === 2 && 'RBI Compliance Gatekeeper'}
                    {activeModalNode === 3 && 'Multilingual Negotiation Brain'}
                    {activeModalNode === 4 && 'Action Executor & ACID Commit'}
                    {activeModalNode === 5 && 'Human-in-the-Loop (HITL) Escalation'}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveModalNode(null)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
                title="Close (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* In-Flight Processing Alert if Node is Active/Pending */}
            {isProcessing && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs animate-pulse">
                <Hourglass className="h-4 w-4 shrink-0 text-amber-400 animate-spin" />
                <div>
                  <strong className="font-bold">Autonomous Rail in Progress:</strong> This node is currently executing in the pipeline. Live telemetry and ledger mutations are being synchronized.
                </div>
              </div>
            )}

            {/* SECTION 1: WHAT THIS NODE DOES */}
            <div className="rounded-xl bg-[#001433]/70 border border-white/10 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Info className="h-3.5 w-3.5" />
                <span>What This Node Does (Fintech Architecture)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                {activeModalNode === 1 &&
                  'Monitors daily UPI QR settlements and correlates dips against the 300m hyper-local peer cluster and IMD weather radar to distinguish genuine merchant distress from cash diversion fraud.'}
                {activeModalNode === 2 &&
                  'Deterministic rule engine enforcing the RBI Fair Practices Code. Acts as a statutory firewall before any outreach or loan restructuring can occur.'}
                {activeModalNode === 3 &&
                  'Combines Gemini 2.5 Flash and Sarvam AI Bulbul v4 to converse empathetically in the merchant’s preferred native tongue (Telugu, Hindi, or English) while enforcing strict lender math bounds.'}
                {activeModalNode === 4 &&
                  'Converts merchant consent (via WhatsApp chip or Soundbox double-press) into an atomic database transaction that restructures the loan in SQL and issues regulatory documentation.'}
                {activeModalNode === 5 &&
                  'A safety circuit breaker. If an account has chronic dormancy (>20 days zero volume) or signals willful default, AI restructuring is locked out and a structured Risk Dossier is handed to an authorized human DRA recovery agent.'}
              </p>
            </div>

            {/* SECTION 2: WHAT CHANGED / CURRENT REAL-TIME STATE */}
            <div className="rounded-xl bg-[#001433]/70 border border-white/10 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>What Changed / Current Real-Time State</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Active: {currentScenario}
                </span>
              </div>

              {/* Dynamic Content for Node 1 */}
              {activeModalNode === 1 && (
                <div className="space-y-2 text-xs text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <div>
                      <strong>Baseline Telemetry Dip:</strong> 30-day baseline dropped{' '}
                      <span className="text-rose-300 font-bold">-45%</span> (from ₹4,200 ➔ ₹2,310/day).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <div>
                      <strong>Pin-Code {pinCode} Cluster Radar:</strong>{' '}
                      <span className="text-cyan-300 font-bold">{clusterAffectedPct}% (18/22)</span> neighboring shops experienced parallel dips due to verified road construction & waterlogging.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <strong>DPDP Act 2023 Consent:</strong> Verified & cleared under regulatory ID{' '}
                      <span className="text-emerald-300 font-mono">{dpdpConsentId}</span>.
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Status: GENUINE_EXTERNAL_SHOCK_VERIFIED
                  </div>
                </div>
              )}

              {/* Dynamic Content for Node 2 */}
              {activeModalNode === 2 && (
                <div className="space-y-2 text-xs text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <div>
                      <strong>Clock Check:</strong> Current simulated time is{' '}
                      <span className="text-white font-mono font-bold">{String(simulatedHour).padStart(2, '0')}:00 IST</span>{' '}
                      (RBI Statutory Window: <span className="text-emerald-300 font-bold">08:00–19:00 IST</span>).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${isRbiWindowOpen ? 'bg-emerald-400' : 'bg-rose-400'} mt-1.5 shrink-0`} />
                    <div>
                      <strong>Night Window Policy:</strong>{' '}
                      {isRbiWindowOpen ? (
                        <span>Currently within legal hours. Merchant outreach permitted under RBI Digital Lending Guidelines.</span>
                      ) : (
                        <span className="text-rose-300 font-bold">
                          STATUS BLOCKED: Outreach prohibited after 19:00 IST. Automatically queued for dispatch at 08:05 AM tomorrow.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <strong>Rule Guarantee:</strong> ₹0.00 penal interest / bounce fee waiver applied (100% RBI Fair Practices compliance).
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Content for Node 3 */}
              {activeModalNode === 3 && (
                <div className="space-y-2 text-xs text-slate-200">
                  {!isRbiWindowOpen ? (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
                      <Hourglass className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Awaiting Compliance Clearance:</strong> Node 3 is on hold because Node 2 (RBI Gatekeeper) has blocked communications during the night window (19:00–08:00 IST). Restructure offers will be transmitted at 08:05 AM.
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>Multilingual Native Script:</strong> Telugu (తెలుగు) / Hindi (हिंदी) / English dynamically active on merchant phone simulator.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>Deterministic Math Guardrail:</strong> Minimum allowed floor ={' '}
                          <span className="text-cyan-300 font-bold">₹150/day</span> (prevents AI hallucination or granting unauthorized haircuts like ₹50/day).
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>Indic Voice Synthesis:</strong> High-fidelity audio generated via{' '}
                          <span className="text-cyan-300 font-bold">Sarvam AI Bulbul v4 flash</span> with interactive waveform playback.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Dynamic Content for Node 4 */}
              {activeModalNode === 4 && (
                <div className="space-y-2 text-xs text-slate-200">
                  {isCured ? (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>SQL Table Mutation:</strong> <code className="text-cyan-300">current_daily_edi</code> updated{' '}
                          <span className="line-through text-slate-400">₹500</span> ➔{' '}
                          <span className="text-emerald-300 font-bold">₹150/day</span>,{' '}
                          <code className="text-cyan-300">restructure_duration_days</code> set to{' '}
                          <span className="text-emerald-300 font-bold">14 days</span>.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>Regulatory Artefacts Issued:</strong> Digital RBI Key Fact Statement (KFS) sealed with ₹0 penal charges & NPCI AutoPay Mandate link (<code className="text-xs text-cyan-300">paytmlending@okaxis</code>).
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>Idempotent Commit:</strong> Mutation committed under hash <span className="font-mono text-emerald-300">tx_9001_restruct_safe</span> with zero duplicate risk.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-start gap-2">
                      <Hourglass className="h-4 w-4 text-cyan-300 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <strong>Awaiting Merchant Consent (Still Being Processed):</strong> This node is primed and awaiting the merchant's consent. Click{' '}
                        <strong className="text-white">"Haan, confirm kar do"</strong> on the phone or double-press the{' '}
                        <strong className="text-white">Paytm Soundbox</strong> button to execute this atomic ACID SQL mutation live!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Content for Node 5 */}
              {activeModalNode === 5 && (
                <div className="space-y-2 text-xs text-slate-200">
                  {isEscalated ? (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>HITL Escalation Triggered:</strong> Account flagged for{' '}
                          <span className="text-amber-300 font-bold">25 days zero volume</span> + Soundbox hardware offline.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>Officer Assigned:</strong> Human DRA Officer{' '}
                          <span className="text-white font-bold">Suresh Varma (DRA-8831)</span> allocated with mandatory body-cam verification protocol.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <div>
                          <strong>Lockout Status:</strong> Autonomous AI restructuring disabled to protect lender capital.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Standby Mode (No Escalation Needed):</strong> Autonomous recovery is resolving this account smoothly. Node 5 remains on standby unless chronic dormancy (&gt;20 days zero volume) or hostile friction is encountered.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">Esc</kbd> or click outside to dismiss
              </span>
              <button
                onClick={() => setActiveModalNode(null)}
                className="px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-bold text-xs transition-all shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

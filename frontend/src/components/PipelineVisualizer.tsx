import React from 'react';
import {
  Activity,
  Shield,
  Bot,
  Zap,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Lock,
  Radio,
  FileText,
  MapPin,
  TrendingDown
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
}) => {
  const isRbiWindowOpen = simulatedHour >= 8 && simulatedHour < 19;

  return (
    <div className="rounded-2xl bg-white/5 border border-cyan-500/20 p-4 md:p-5 backdrop-blur-md shadow-2xl space-y-4">
      {/* Visualizer Header with Live Latency and Clock */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-1.5">
              5-Node Autonomous AI Pipeline
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                State Machine
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Real-time telemetry ingest &rarr; statutory policy &rarr; Indic voice AI &rarr; ACID settlement commit
          </p>
        </div>

        {/* Live IST Clock Control */}
        <div className="flex items-center gap-3 bg-[#001D4D] px-3 py-1.5 rounded-xl border border-white/10 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
            <Clock className={`h-3.5 w-3.5 ${isRbiWindowOpen ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`} />
            <span className={isRbiWindowOpen ? 'text-white' : 'text-rose-300'}>
              {String(simulatedHour).padStart(2, '0')}:00 IST
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={23}
            value={simulatedHour}
            onChange={(e) => onHourChange(Number(e.target.value))}
            className="w-24 accent-[#00BAF2] cursor-pointer"
          />

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
              isRbiWindowOpen
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
            }`}
          >
            {isRbiWindowOpen ? 'Legal Window (08:00–19:00)' : 'Night Block Active'}
          </span>
        </div>
      </div>

      {/* 5 Nodes Pipeline Grid / Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Node 1: Telemetry & Macro Diagnostician */}
        <div className="rounded-xl bg-[#001D4D]/90 border border-cyan-400/30 p-3 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Activity className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 1</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              14ms • PASSED
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">Telemetry & Macro</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Pin-Code {pinCode} cluster: <strong className="text-cyan-300">{clusterAffectedPct}% shops dipped</strong>
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-300">
              <CheckCircle className="h-3 w-3" /> DPDP Consent
            </span>
            <span>Genuine Shock</span>
          </div>
        </div>

        {/* Node 2: RBI Compliance Gatekeeper */}
        <div
          className={`rounded-xl p-3 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 ${
            !isRbiWindowOpen
              ? 'bg-rose-950/80 border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'bg-[#001D4D]/90 border border-cyan-400/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Shield className={`h-4 w-4 ${!isRbiWindowOpen ? 'text-rose-400' : 'text-cyan-400'}`} />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 2</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                isRbiWindowOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/40 text-rose-200 border-rose-400 animate-pulse'
              }`}
            >
              {isRbiWindowOpen ? '1ms • PASSED' : '0ms • BLOCKED'}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">RBI Gatekeeper</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isRbiWindowOpen
                ? 'Contact window strictly permitted between 08:00–19:00 IST'
                : 'Night block: Zero calls/SMS allowed after 19:00 IST'}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>₹0 Penal Fee Cap</span>
            <span className={isRbiWindowOpen ? 'text-emerald-300' : 'text-rose-300 font-bold'}>
              {isRbiWindowOpen ? 'Window Open' : 'Queued 08:05 AM'}
            </span>
          </div>
        </div>

        {/* Node 3: Multilingual Negotiation Brain */}
        <div
          className={`rounded-xl p-3 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 ${
            !isRbiWindowOpen
              ? 'bg-slate-900/60 border border-white/5 opacity-40'
              : 'bg-[#001D4D]/90 border border-cyan-400/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Bot className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 3</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
              342ms • EXECUTED
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">Negotiation Brain</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Gemini 2.5 + Sarvam Bulbul v4 in Telugu, Hindi & English
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-cyan-300 font-bold">Min EDI: ₹150</span>
            <span>Sarvam TTS</span>
          </div>
        </div>

        {/* Node 4: Action Executor */}
        <div
          className={`rounded-xl p-3 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 ${
            !isRbiWindowOpen || isEscalated
              ? 'bg-slate-900/60 border border-white/5 opacity-40'
              : 'bg-[#001D4D]/90 border border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 4</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              18ms • COMMIT
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">ACID Ledger Commit</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Mutates SQL loans table, issues UPI AutoPay Mandate & digital KFS
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-emerald-300 font-bold">Idempotent</span>
            <span>KFS Sealed</span>
          </div>
        </div>

        {/* Node 5: Human-in-the-Loop Escalation */}
        <div
          className={`rounded-xl p-3 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 ${
            isEscalated
              ? 'bg-amber-950/80 border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-slate-900/60 border border-white/5 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-amber-400">
              <UserCheck className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 5</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                isEscalated
                  ? 'bg-amber-500/30 text-amber-200 border-amber-400 animate-pulse'
                  : 'bg-white/10 text-slate-400 border-white/10'
              }`}
            >
              {isEscalated ? 'HITL ACTIVE' : 'STANDBY'}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">HITL Risk Dossier</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isEscalated
                ? 'Apex Electronics flagged: 25 days dormant. Assigned to DRA Field Agent.'
                : 'Triggers on hostile input or chronic dormancy (>20d drop).'}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>Body-Cam Req.</span>
            <span className={isEscalated ? 'text-amber-300 font-bold' : ''}>DRA Allocated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

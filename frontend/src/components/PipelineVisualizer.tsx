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
  Sun,
  Moon
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

      {/* 5 Nodes Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Node 1: Telemetry & Macro Diagnostician */}
        <div className="rounded-xl bg-[#001433]/70 border border-white/10 p-3.5 flex flex-col justify-between shadow-sm relative transition-all hover:border-cyan-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Activity className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 1</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              14ms • PASSED
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">Telemetry & Macro</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Pin {pinCode}: <strong className="text-cyan-300">{clusterAffectedPct}% shops dipped</strong>
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-300">
              <CheckCircle className="h-3 w-3" /> DPDP
            </span>
            <span>Genuine Shock</span>
          </div>
        </div>

        {/* Node 2: RBI Compliance Gatekeeper */}
        <div
          className={`rounded-xl p-3.5 flex flex-col justify-between shadow-sm relative transition-all duration-300 ${
            !isRbiWindowOpen
              ? 'bg-rose-950/60 border border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              : 'bg-[#001433]/70 border border-white/10 hover:border-cyan-400/30'
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
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/30 text-rose-200 border-rose-400/50 animate-pulse'
              }`}
            >
              {isRbiWindowOpen ? '1ms • PASSED' : '0ms • BLOCKED'}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">RBI Gatekeeper</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isRbiWindowOpen
                ? 'Contact window strictly permitted (08:00–19:00 IST)'
                : 'Night block: Zero calls/SMS allowed after 19:00 IST'}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span>₹0 Penal Fee</span>
            <span className={isRbiWindowOpen ? 'text-emerald-300' : 'text-rose-300 font-bold'}>
              {isRbiWindowOpen ? 'Window Open' : 'Queued 08:05 AM'}
            </span>
          </div>
        </div>

        {/* Node 3: Multilingual Negotiation Brain */}
        <div
          className={`rounded-xl p-3.5 flex flex-col justify-between shadow-sm relative transition-all duration-300 ${
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
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold">
              342ms • EXECUTED
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">Negotiation Brain</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Gemini 2.5 + Sarvam Bulbul in Telugu, Hindi & English
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-cyan-300 font-bold">Min EDI: ₹150</span>
            <span>Sarvam TTS</span>
          </div>
        </div>

        {/* Node 4: Action Executor */}
        <div
          className={`rounded-xl p-3.5 flex flex-col justify-between shadow-sm relative transition-all duration-300 ${
            !isRbiWindowOpen || isEscalated
              ? 'bg-[#001433]/30 border border-white/5 opacity-40'
              : 'bg-[#001433]/70 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold text-slate-300">Node 4</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              18ms • COMMIT
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">ACID Ledger Commit</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Mutates SQL loans table, issues UPI AutoPay & digital KFS
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-emerald-300 font-bold">Idempotent</span>
            <span>KFS Sealed</span>
          </div>
        </div>

        {/* Node 5: Human-in-the-Loop Escalation */}
        <div
          className={`rounded-xl p-3.5 flex flex-col justify-between shadow-sm relative transition-all duration-300 ${
            isEscalated
              ? 'bg-amber-950/60 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              : 'bg-[#001433]/30 border border-white/5 opacity-40'
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
                  ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 animate-pulse'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              {isEscalated ? 'HITL ACTIVE' : 'STANDBY'}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-1">HITL Risk Dossier</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isEscalated
                ? 'Apex Electronics: 25 days dormant. Assigned to DRA Field Agent.'
                : 'Triggers on hostile input or chronic dormancy (>20d drop).'}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span>Body-Cam Req.</span>
            <span className={isEscalated ? 'text-amber-300 font-bold' : ''}>DRA Allocated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

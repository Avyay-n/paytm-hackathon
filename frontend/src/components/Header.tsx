import React from 'react';
import { Shield, Sparkles, Cpu, RotateCcw, Building2 } from 'lucide-react';
import { Merchant } from '../types';

interface HeaderProps {
  merchants: Merchant[];
  selectedMerchantId: string;
  onSelectMerchant: (id: string) => void;
  onReset: () => void;
  isResetting: boolean;
  currentHour: number;
}

export const Header: React.FC<HeaderProps> = ({
  merchants,
  selectedMerchantId,
  onSelectMerchant,
  onReset,
  isResetting,
  currentHour,
}) => {
  const selected = merchants.find((m) => m.id === selectedMerchantId);
  const nbfcPartner = selected?.loans?.[0]?.lender_nbfc_partner || 'SMFG India Credit';

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-[#070B14]/95 px-6 backdrop-blur-xl">
      {/* Brand & LSP Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#002970] via-[#003B95] to-[#00BAF2] px-3 py-1.5 shadow-lg border border-[#00BAF2]/40">
          <span className="font-black text-white text-base tracking-tight">paytm</span>
          <span className="rounded bg-white/20 px-1 text-[10px] font-bold uppercase text-white">
            LSP
          </span>
        </div>

        <div>
          <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
            Recovery Copilot
            <span className="rounded bg-[#00BAF2]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#00BAF2] border border-[#00BAF2]/30">
              Enterprise RBI Edition
            </span>
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Building2 className="h-3 w-3 text-indigo-400" />
            <span>RE Partner: <strong className="text-slate-200">{nbfcPartner}</strong></span>
          </div>
        </div>
      </div>

      {/* Center Persona Switcher (Componentry Spring Pill Switcher) */}
      <div className="flex items-center rounded-xl bg-slate-900/90 p-1 border border-slate-800 shadow-inner">
        {merchants.map((m) => {
          const isSelected = m.id === selectedMerchantId;
          const badgeText =
            m.id === 'MCH_001'
              ? 'SMA-0 Macro Dip'
              : m.id === 'MCH_002'
              ? 'NPCI Glitch'
              : 'SMA-2 Peer Divergence';

          return (
            <button
              key={m.id}
              onClick={() => onSelectMerchant(m.id)}
              className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{m.name.split(' ')[0]}</span>
              <span
                className={`rounded px-1 text-[9px] font-bold uppercase ${
                  m.id === 'MCH_001'
                    ? 'bg-amber-500/20 text-amber-300'
                    : m.id === 'MCH_002'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {badgeText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right AI & Regulatory Status */}
      <div className="flex items-center gap-3">
        {/* Gemini + Sarvam Active Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-xs border border-slate-800">
            <Cpu className="h-3.5 w-3.5 text-[#00BAF2]" />
            <span className="font-mono text-[11px] text-slate-300">Gemini 2.5 Flash</span>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-xs border border-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-[#FF6B35]" />
            <span className="font-mono text-[11px] text-slate-300">Sarvam Bulbul v4</span>
          </div>
        </div>

        {/* Reset Database Button */}
        <button
          onClick={onReset}
          disabled={isResetting}
          title="Reset database to fresh seed state"
          className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
};

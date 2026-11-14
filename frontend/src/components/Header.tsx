import React from 'react';
import { RotateCcw, Building2, CheckCircle, Sparkles, Cpu } from 'lucide-react';
import { Merchant } from '../types';

interface HeaderProps {
  merchants: Merchant[];
  selectedMerchantId: string;
  onSelectMerchant: (id: string) => void;
  onReset: () => void;
  isResetting: boolean;
  currentHour?: number;
}

export const Header: React.FC<HeaderProps> = ({
  merchants,
  selectedMerchantId,
  onSelectMerchant,
  onReset,
  isResetting,
}) => {
  const selected = merchants.find((m) => m.id === selectedMerchantId);
  const nbfcPartner = selected?.loans?.[0]?.lender_nbfc_partner || 'SMFG India Credit';

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 shadow-sm backdrop-blur-md">
      {/* Brand & LSP Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg bg-[#002970] px-3 py-1.5 shadow-sm text-white">
          <span className="font-extrabold text-base tracking-tight text-[#00BAF2]">paytm</span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-1 py-0.5 rounded">
            LSP
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              Recovery Copilot
            </h1>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
              RBI Digital Lending Compliant
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Building2 className="h-3 w-3 text-slate-400" />
            <span>Regulated Entity: <strong className="text-slate-700 font-medium">{nbfcPartner}</strong></span>
          </div>
        </div>
      </div>

      {/* Center Persona Switcher (Segmented Control) */}
      <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
        {merchants.map((m) => {
          const isSelected = m.id === selectedMerchantId;
          const badgeText =
            m.id === 'MCH_001'
              ? 'SMA-0 Weather Shock'
              : m.id === 'MCH_002'
              ? 'Bank Glitch'
              : 'SMA-2 Fraud Risk';

          return (
            <button
              key={m.id}
              onClick={() => onSelectMerchant(m.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>{m.name.split(' ')[0]}</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                  m.id === 'MCH_001'
                    ? 'bg-amber-100 text-amber-800'
                    : m.id === 'MCH_002'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {badgeText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right AI Engine Badges & Reset Button */}
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs border border-slate-200 text-slate-700">
            <Cpu className="h-3.5 w-3.5 text-[#00BAF2]" />
            <span className="font-mono text-[11px]">Gemini 2.5 Flash</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs border border-orange-200 text-orange-900">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            <span className="font-mono text-[11px] font-medium">Sarvam Bulbul & Saaras</span>
          </div>
        </div>

        {/* Reset Database Button */}
        <button
          onClick={onReset}
          disabled={isResetting}
          title="Reset demo data to initial seed state"
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors"
        >
          <RotateCcw className={`h-3.5 w-3.5 text-slate-500 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
};

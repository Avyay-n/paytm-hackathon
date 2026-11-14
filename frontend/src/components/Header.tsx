import React from 'react';
import { RotateCcw, Building2, Sparkles, Cpu } from 'lucide-react';
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
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* Brand & LSP Identity using Image 2 logo */}
      <div className="flex items-center gap-3">
        <img
          src="/paytm-lsp-badge.png"
          alt="Paytm LSP"
          className="h-9 w-auto object-contain rounded-md shadow-sm"
        />

        <div className="border-l border-slate-200 pl-3">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-[#002970]">
              Recovery Copilot
            </h1>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#002970] border border-blue-200">
              RBI Digital Lending Compliant
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Building2 className="h-3 w-3 text-slate-400" />
            <span>Regulated Entity: <strong className="text-slate-700 font-medium">{nbfcPartner}</strong></span>
          </div>
        </div>
      </div>

      {/* Center Persona Switcher in Paytm Blue Theme */}
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
                  ? 'bg-[#002970] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-[#002970] hover:bg-slate-200/60'
              }`}
            >
              <span>{m.name.split(' ')[0]}</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                  isSelected
                    ? 'bg-white/20 text-[#00BAF2]'
                    : 'bg-slate-200 text-slate-600'
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
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50/70 px-2.5 py-1 text-xs border border-blue-200/80 text-[#002970]">
            <Cpu className="h-3.5 w-3.5 text-[#00BAF2]" />
            <span className="font-mono text-[11px] font-medium">Gemini 2.5 Flash</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50/70 px-2.5 py-1 text-xs border border-blue-200/80 text-[#002970]">
            <Sparkles className="h-3.5 w-3.5 text-[#00BAF2]" />
            <span className="font-mono text-[11px] font-medium">Sarvam AI</span>
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

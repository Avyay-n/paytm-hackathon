import React from 'react';
import { Building2 } from 'lucide-react';
import { Merchant } from '../types';

interface HeaderProps {
  merchants: Merchant[];
  selectedMerchantId: string;
  onSelectMerchant: (id: string) => void;
  onReset?: () => void;
  isResetting?: boolean;
  currentHour?: number;
}

export const Header: React.FC<HeaderProps> = ({
  merchants,
  selectedMerchantId,
  onSelectMerchant,
}) => {
  const selected = merchants.find((m) => m.id === selectedMerchantId);
  const nbfcPartner = selected?.loans?.[0]?.lender_nbfc_partner || 'SMFG India Credit';

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
      {/* Brand & LSP Identity with Official Paytm Logo & LSP Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Iconic Paytm Circular Logo */}
          <img
            src="/paytm-circle-logo.png"
            alt="Paytm Logo"
            className="h-9 w-9 object-contain rounded-full shadow-xs border border-slate-200 bg-white"
          />
          {/* Paytm LSP Badge */}
          <img
            src="/paytm-lsp-badge.png"
            alt="Paytm LSP"
            className="h-8 w-auto object-contain rounded"
          />
        </div>

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

      {/* Center Persona Switcher with Distinct Colors for Ramesh (Blue), Priya (Amber), Vikram (Rose) */}
      <div className="flex items-center gap-1.5 rounded-full bg-slate-100/90 p-1 border border-slate-200 shadow-inner">
        {merchants.map((m) => {
          const isSelected = m.id === selectedMerchantId;

          // Color themes per merchant
          let activeBtnClass = '';
          let inactiveBtnClass = '';
          let badgeActive = '';
          let badgeInactive = '';
          let badgeText = '';

          if (m.id === 'MCH_001') {
            // Ramesh: Blue/Cyan (IMD Weather Alert)
            badgeText = 'SMA-0 WEATHER SHOCK';
            activeBtnClass = 'bg-[#002970] text-white shadow-md ring-2 ring-[#00BAF2] scale-102';
            inactiveBtnClass = 'text-[#002970] bg-blue-100/90 hover:bg-blue-200 border border-blue-300 shadow-xs';
            badgeActive = 'bg-[#00BAF2] text-[#002970] font-black shadow-xs';
            badgeInactive = 'bg-blue-200 text-[#002970] font-bold border border-blue-300';
          } else if (m.id === 'MCH_002') {
            // Priya: Amber/Gold (NPCI Tech Glitch)
            badgeText = 'BANK GLITCH';
            activeBtnClass = 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300 scale-102';
            inactiveBtnClass = 'text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 shadow-xs';
            badgeActive = 'bg-amber-100 text-amber-950 font-black shadow-xs';
            badgeInactive = 'bg-amber-200 text-amber-900 font-bold border border-amber-300';
          } else {
            // Vikram: Crimson/Rose (SMA-2 Solitary Divergence)
            badgeText = 'SMA-2 FRAUD RISK';
            activeBtnClass = 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300 scale-102';
            inactiveBtnClass = 'text-rose-900 bg-rose-100/90 hover:bg-rose-200 border border-rose-300 shadow-xs';
            badgeActive = 'bg-rose-100 text-rose-950 font-black shadow-xs';
            badgeInactive = 'bg-rose-200 text-rose-900 font-bold border border-rose-300';
          }

          return (
            <button
              key={m.id}
              onClick={() => onSelectMerchant(m.id)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-98 ${
                isSelected ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <span className="tracking-wide">{m.name.split(' ')[0]}</span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                isSelected ? badgeActive : badgeInactive
              }`}>
                {badgeText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right spacer for centering */}
      <div className="w-12 hidden md:block" />
    </header>
  );
};

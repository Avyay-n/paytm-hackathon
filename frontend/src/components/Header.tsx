import React from 'react';
import { Building2 } from 'lucide-react';
import { Merchant } from '../types';
import { GooeyNav } from './GooeyNav';

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

  // Map merchants to items for React Bits GooeyNav
  const gooeyItems = merchants.map((m) => {
    const badge =
      m.id === 'MCH_001'
        ? 'Weather Shock'
        : m.id === 'MCH_002'
        ? 'Bank Glitch'
        : 'Fraud Risk';
    return {
      label: `${m.name.split(' ')[0]} (${badge})`,
    };
  });

  const activeIndex = Math.max(0, merchants.findIndex((m) => m.id === selectedMerchantId));

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

      {/* Center Persona Switcher using React Bits <GooeyNav /> */}
      <div className="flex items-center justify-center">
        {gooeyItems.length > 0 && (
          <GooeyNav
            items={gooeyItems}
            activeIndex={activeIndex}
            onChange={(index) => {
              if (merchants[index]) {
                onSelectMerchant(merchants[index].id);
              }
            }}
            theme="light"
            color="#002970"
            activeTextColor="#FFFFFF"
            colors={['#002970', '#00BAF2', '#003B95', '#25D366']}
            size="sm"
            frame={true}
            animationTime={550}
            particleCount={14}
            spread={48}
            timeVariance={250}
            gooeyness={0.5}
            wobble={0.4}
            hoverEffect={true}
          />
        )}
      </div>

      {/* Right spacer to keep center navbar perfectly centered (chips removed as requested) */}
      <div className="w-12 hidden md:block" />
    </header>
  );
};

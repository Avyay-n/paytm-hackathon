import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, Copy, Check } from 'lucide-react';
import { KFSDocument } from '../types';

interface KFSMandateCardProps {
  kfs: KFSDocument;
}

export const KFSMandateCard: React.FC<KFSMandateCardProps> = ({ kfs }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMandate = () => {
    navigator.clipboard.writeText(kfs.mandate_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm text-slate-800">
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#002970] border border-blue-200">
              RBI KFS PASS
            </span>
            <span className="font-mono text-xs text-slate-500 font-semibold">{kfs.kfs_document_id}</span>
          </div>
          <h3 className="mt-1 text-xs font-bold text-[#002970] flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-[#00BAF2]" />
            Digital Key Fact Statement (RBI Compliant)
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Regulated Entity</span>
          <span className="text-xs font-bold text-[#002970]">{kfs.lender_nbfc_partner}</span>
        </div>
      </div>

      {/* Loan Terms Grid in Clean White & Slate */}
      <div className="my-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-slate-50 p-2 border border-slate-200">
          <span className="text-slate-400 text-[10px] uppercase block">Borrower</span>
          <span className="font-bold text-slate-900">{kfs.borrower_name}</span>
          <span className="block font-mono text-[10px] text-[#002970] truncate">
            {kfs.dpdp_consent_id}
          </span>
        </div>

        <div className="rounded-lg bg-blue-50/50 p-2 border border-blue-100">
          <span className="text-slate-500 text-[10px] uppercase font-semibold block">Revised Daily Sweep</span>
          <span className="font-bold text-[#002970] text-sm">₹{kfs.revised_daily_edi}/day</span>
          <span className="block text-[10px] text-slate-400 line-through">
            Original: ₹{kfs.original_daily_edi}/day
          </span>
        </div>

        <div className="rounded-lg bg-slate-50 p-2 border border-slate-200">
          <span className="text-slate-400 text-[10px] uppercase block">Penal Charges</span>
          <span className="font-bold text-[#002970]">₹0.00 (Waived)</span>
          <span className="block text-[10px] text-slate-500">Per RBI Guidelines</span>
        </div>

        <div className="rounded-lg bg-slate-50 p-2 border border-slate-200">
          <span className="text-slate-400 text-[10px] uppercase block">Repayment Tenure</span>
          <span className="font-bold text-slate-800">14-Day Relief Window</span>
          <span className="block text-[10px] text-slate-500">{kfs.settlement_sweep_mode}</span>
        </div>
      </div>

      {/* Confirmation Mechanism */}
      <div className="flex items-center justify-between rounded-lg bg-blue-50/70 px-3 py-1.5 border border-blue-200 text-xs">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-[#002970]" />
          <span className="text-slate-700 text-[11px]">
            Confirmed via: <strong className="text-[#002970]">{kfs.confirmed_via}</strong>
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold text-[#002970]">STATUS: CURED</span>
      </div>

      {/* Mandate Link & GRO */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="truncate max-w-[200px]">
          <span className="text-[10px] text-slate-400 block">UPI AutoPay Mandate:</span>
          <code className="text-[10px] font-mono text-[#002970] truncate block">
            {kfs.mandate_link}
          </code>
        </div>
        <button
          onClick={handleCopyMandate}
          className="flex items-center gap-1 rounded bg-[#002970] hover:bg-[#003B95] text-white px-2 py-1 text-xs font-medium transition-colors shadow-2xs"
        >
          {copied ? <Check className="h-3 w-3 text-[#00BAF2]" /> : <Copy className="h-3 w-3" />}
          <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="mt-1.5 text-[10px] text-slate-400 text-center">
        GRO: <strong>{kfs.gro_name}</strong> ({kfs.gro_contact})
      </div>
    </div>
  );
};

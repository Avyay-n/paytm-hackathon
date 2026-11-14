import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, ExternalLink, Copy, Check, FileText } from 'lucide-react';
import { KFSDocument } from '../types';
import { BorderBeam } from './ui/BorderBeam';
import { DecryptedText } from './ui/DecryptedText';

interface KFSMandateCardProps {
  kfs: KFSDocument;
}

export const KFSMandateCard: React.FC<KFSMandateCardProps> = ({ kfs }) => {
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleCopyMandate = () => {
    navigator.clipboard.writeText(kfs.mandate_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-[#002970]/30 to-[#070B14] p-5 shadow-2xl"
    >
      <BorderBeam colorFrom="#10B981" colorTo="#00BAF2" duration={6} />

      {/* Holographic Sheen Overlay */}
      <div className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-pulse" />

      {/* Top Regulatory Header */}
      <div className="flex items-start justify-between border-b border-emerald-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
              RBI KFS PASS
            </span>
            <span className="font-mono text-xs text-slate-300">
              <DecryptedText text={kfs.kfs_document_id} />
            </span>
          </div>
          <h3 className="mt-1 text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Digital Key Fact Statement (RBI Compliant)
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">LSP / RE Partner</span>
          <span className="text-xs font-bold text-[#00BAF2]">{kfs.lender_nbfc_partner}</span>
        </div>
      </div>

      {/* Core Loan Modification Details Grid */}
      <div className="my-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Borrower & DPDP ID</span>
          <span className="font-bold text-white">{kfs.borrower_name}</span>
          <span className="block font-mono text-[10px] text-emerald-400 mt-0.5 truncate">
            {kfs.dpdp_consent_id}
          </span>
        </div>

        <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Repayment Terms</span>
          <span className="font-bold text-emerald-400">₹{kfs.revised_daily_edi}/day</span>
          <span className="block text-[10px] text-slate-300 line-through">
            Original: ₹{kfs.original_daily_edi}/day
          </span>
        </div>

        <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Penal Interest & Bounce Fee</span>
          <span className="font-bold text-emerald-400">{kfs.penal_interest_rate}</span>
          <span className="block text-[10px] text-slate-400">Zero charges levied</span>
        </div>

        <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Sweep Schedule</span>
          <span className="font-bold text-white">{kfs.settlement_sweep_mode}</span>
          <span className="block text-[10px] text-slate-400">Tenure: +{kfs.tenure_extension_days} Days</span>
        </div>
      </div>

      {/* Confirmation Mechanism */}
      <div className="flex items-center justify-between rounded-lg bg-emerald-950/40 px-3 py-2 border border-emerald-500/30 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-200">
            Confirmed via: <strong className="text-white">{kfs.confirmed_via}</strong>
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-300">STATUS: CURED</span>
      </div>

      {/* Mandate Link & Regulatory GRO Footer */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="truncate max-w-[240px]">
          <span className="text-[10px] text-slate-400 block">UPI AutoPay Mandate:</span>
          <code className="text-[10px] font-mono text-[#00BAF2] truncate block">
            {kfs.mandate_link}
          </code>
        </div>
        <button
          onClick={handleCopyMandate}
          className="flex items-center gap-1 rounded bg-[#00BAF2]/15 hover:bg-[#00BAF2]/25 text-[#00BAF2] px-2.5 py-1 text-xs font-semibold transition-colors flex-shrink-0"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Mandate'}</span>
        </button>
      </div>

      <div className="mt-2 text-[10px] text-slate-400 text-center">
        Grievance Redressal Officer: <strong>{kfs.gro_name}</strong> ({kfs.gro_contact}) • {kfs.gro_email}
      </div>
    </div>
  );
};

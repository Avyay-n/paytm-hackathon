import React, { useEffect, useState, useRef } from 'react';
import {
  fetchMerchants,
  fetchMerchantDetail,
  fetchSettlements,
  fetchMacroRadar,
  runPipeline,
  resetDatabase
} from './api';
import {
  Merchant,
  Loan,
  RegionalMacroSignal,
  UpiSettlement,
  NodeResult,
  ChatMessage,
  KFSDocument,
  HITLDossier,
  PeerClusterRadar
} from './types';
import { Header } from './components/Header';
import { ComplianceSimulator } from './components/ComplianceSimulator';
import { SoundboxWidget } from './components/SoundboxWidget';
import { WhatsAppChat } from './components/WhatsAppChat';
import { MacroRadarCard } from './components/MacroRadarCard';
import { SettlementChart } from './components/SettlementChart';
import { PipelineCascade } from './components/PipelineCascade';
import { AnimatedCounter } from './components/ui/AnimatedCounter';
import { SpotlightCard } from './components/ui/SpotlightCard';
import {
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Database,
  MapPin,
  Building2,
  Scale,
  AlertTriangle,
  UserCheck,
  LayoutDashboard
} from 'lucide-react';

export const App: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('MCH_001');
  const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(null);
  const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);
  const [currentMacro, setCurrentMacro] = useState<RegionalMacroSignal | null>(null);
  const [settlements, setSettlements] = useState<UpiSettlement[]>([]);
  const [radarData, setRadarData] = useState<PeerClusterRadar | null>(null);
  const [pipelineNodes, setPipelineNodes] = useState<NodeResult[]>([]);
  const [chatMessage, setChatMessage] = useState<ChatMessage | null>(null);
  const [kfsDocument, setKfsDocument] = useState<KFSDocument | null>(null);
  const [hitlDossier, setHitlDossier] = useState<HITLDossier | null>(null);
  const [currentHour, setCurrentHour] = useState<number>(14);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHAT_SOUNDBOX' | 'TELEMETRY' | 'COMPLIANCE'>('OVERVIEW');
  const [npaFramework, setNpaFramework] = useState<'PAYTM_30D' | 'RBI_90D'>('PAYTM_30D');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadAllMerchants();
  }, []);

  useEffect(() => {
    if (selectedMerchantId) {
      loadMerchantData(selectedMerchantId, currentHour);
    }
  }, [selectedMerchantId]);

  const loadAllMerchants = async () => {
    try {
      const data = await fetchMerchants();
      setMerchants(data);
    } catch (err) {
      console.error('Failed to load merchants:', err);
    }
  };

  const loadMerchantData = async (merchantId: string, hour: number) => {
    try {
      const detail = await fetchMerchantDetail(merchantId);
      setCurrentMerchant(detail.merchant);
      setCurrentLoan(detail.loan);
      setCurrentMacro(detail.macro_signal);

      const setts = await fetchSettlements(merchantId);
      setSettlements(setts);

      if (detail.merchant.pin_code) {
        const radar = await fetchMacroRadar(detail.merchant.pin_code);
        setRadarData(radar);
      }

      const pipelineRes = await runPipeline({
        merchant_id: merchantId,
        simulated_hour_ist: hour,
      });

      setPipelineNodes(pipelineRes.nodes);
      setChatMessage(pipelineRes.chat_message || null);
      setKfsDocument(pipelineRes.kfs_issued || null);
      setHitlDossier(pipelineRes.hitl_dossier || null);
      setCurrentLoan(pipelineRes.loan);
    } catch (err) {
      console.error('Error loading merchant data:', err);
    }
  };

  const handleHourChange = async (hour: number) => {
    setCurrentHour(hour);
    if (!selectedMerchantId) return;

    try {
      const res = await runPipeline({
        merchant_id: selectedMerchantId,
        simulated_hour_ist: hour,
      });
      setPipelineNodes(res.nodes);
      setChatMessage(res.chat_message || null);
      setKfsDocument(res.kfs_issued || null);
      setHitlDossier(res.hitl_dossier || null);
      setCurrentLoan(res.loan);
    } catch (err) {
      console.error('Pipeline failed on hour change:', err);
    }
  };

  const handleDoubleTapSoundbox = async () => {
    if (!selectedMerchantId) return;
    try {
      const res = await runPipeline({
        merchant_id: selectedMerchantId,
        simulated_hour_ist: currentHour,
        action_trigger: 'SOUNDBOX_DOUBLE_TAP',
      });
      setPipelineNodes(res.nodes);
      setKfsDocument(res.kfs_issued || null);
      setCurrentLoan(res.loan);
      playVoice('Paytm par ek sau pachaas rupaye prapt hue. Restructuring confirmed.');
    } catch (err) {
      console.error('Failed to commit soundbox restructuring:', err);
    }
  };

  const handleSelectOption = async (optionId: string) => {
    if (!selectedMerchantId) return;
    let trigger = 'WHATSAPP_ACCEPT_OPTION_A';
    if (optionId === 'ACCEPT_OPTION_B') trigger = 'WHATSAPP_ACCEPT_OPTION_B';
    if (optionId === 'RETRY_SWEEP') trigger = 'RETRY_SWEEP';
    if (optionId === 'SOUNDBOX_PROMPT') {
      handleDoubleTapSoundbox();
      return;
    }

    try {
      const res = await runPipeline({
        merchant_id: selectedMerchantId,
        simulated_hour_ist: currentHour,
        action_trigger: trigger,
      });
      setPipelineNodes(res.nodes);
      setKfsDocument(res.kfs_issued || null);
      setCurrentLoan(res.loan);
    } catch (err) {
      console.error('Option execution failed:', err);
    }
  };

  const handleSendCustomMessage = async (msg: string) => {
    if (!selectedMerchantId) return;
    try {
      const res = await runPipeline({
        merchant_id: selectedMerchantId,
        simulated_hour_ist: currentHour,
        merchant_message: msg,
      });
      setPipelineNodes(res.nodes);
      setChatMessage(res.chat_message || null);
      if (res.kfs_issued) setKfsDocument(res.kfs_issued);
    } catch (err) {
      console.error('Custom message handling failed:', err);
    }
  };

  const playVoice = (textOverride?: string) => {
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const audioBase64 = chatMessage?.audio?.audio_base64;
    if (audioBase64) {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audioRef.current = audio;
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      audio.play().catch(() => setIsPlayingAudio(false));
      return;
    }

    if ('speechSynthesis' in window) {
      const textToSpeak =
        textOverride ||
        chatMessage?.tts_native_text ||
        chatMessage?.display_text ||
        'Paytm Recovery Copilot restructuring active.';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (currentMerchant?.preferred_language === 'Telugu') {
        utterance.lang = 'te-IN';
      } else if (currentMerchant?.preferred_language === 'Hinglish') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetDatabase();
      await loadAllMerchants();
      if (selectedMerchantId) {
        await loadMerchantData(selectedMerchantId, 14);
      }
      setCurrentHour(14);
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const isCured = currentLoan?.status === 'RESTRUCTURED';
  const isEscalated = currentLoan?.status === 'ESCALATED' || hitlDossier !== null;
  const dpd = currentLoan?.days_past_due || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-12">
      {/* Header with Paytm LSP Badge */}
      <Header
        merchants={merchants}
        selectedMerchantId={selectedMerchantId}
        onSelectMerchant={(id) => setSelectedMerchantId(id)}
        onReset={handleReset}
        isResetting={isResetting}
        currentHour={currentHour}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-5">
        {/* Case Header Summary Card (Context at a glance) */}
        {currentMerchant && currentLoan && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs mb-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#002970] text-white font-extrabold text-base shadow-xs">
                  {currentMerchant.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#002970]">
                      {currentMerchant.business_name}
                    </h2>
                    <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-[#002970] border border-blue-200">
                      Loan: {currentLoan.loan_id}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 font-medium">
                      {currentMerchant.business_type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      Pin Code {currentMerchant.pin_code} ({currentMerchant.city})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      Lender: <strong className="text-slate-700">{currentLoan.lender_nbfc_partner}</strong>
                    </span>
                    <span>•</span>
                    <span>Language: <strong className="text-slate-700">{currentMerchant.preferred_language}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status and Rapid Cured Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Status</span>
                  <span className={`inline-block font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
                    isCured
                      ? 'bg-blue-50 text-[#002970] border-blue-200'
                      : isEscalated
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}>
                    {isCured ? 'SMA-0 (CURED - Restructured)' : currentLoan.sma_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clean Structured View Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#002970] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#002970] hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>1. Executive Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT_SOUNDBOX')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'CHAT_SOUNDBOX'
                ? 'bg-[#002970] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#002970] hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>2. Merchant Chat & Soundbox 4.0</span>
          </button>

          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'TELEMETRY'
                ? 'bg-[#002970] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#002970] hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>3. Regional Telemetry & Fraud Check</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'COMPLIANCE'
                ? 'bg-[#002970] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#002970] hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>4. RBI Fair Practices & Loan Ledger</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW & KPIS */}
        {/* ========================================================================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* 4 Clean Metric Cards */}
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-bold text-[#002970]">Lender Portfolio Recovery Metrics</h3>
                <p className="text-xs text-slate-500">Autonomous recovery metrics across the active Paytm lending cohort</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Recovered Cash Flow
                    </span>
                    <div className="p-1.5 rounded-lg bg-blue-50 text-[#002970]">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-[#002970]">
                    <AnimatedCounter
                      value={isCured ? 430000 : 385000}
                      isCurrency={true}
                      prefix="₹"
                      duration={1000}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                    +₹45,000 Restructured Today
                  </span>
                </SpotlightCard>

                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      SMA-0 &rarr; NPA Cured
                    </span>
                    <div className="p-1.5 rounded-lg bg-blue-50 text-[#002970]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-[#002970]">
                    <AnimatedCounter value={isCured ? 7 : 6} suffix=" Merchants" duration={800} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                    Zero Defaults Recorded
                  </span>
                </SpotlightCard>

                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Autonomous Restructure
                    </span>
                    <div className="p-1.5 rounded-lg bg-blue-50 text-[#002970]">
                      <Zap className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-[#002970]">
                    <AnimatedCounter value={88.4} decimals={1} suffix="%" duration={1000} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                    Zero Human Tele-calls
                  </span>
                </SpotlightCard>

                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      RBI Compliance Rate
                    </span>
                    <div className="p-1.5 rounded-lg bg-blue-50 text-[#002970]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-[#002970]">
                    <AnimatedCounter value={100} suffix="%" duration={600} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                    100% Audit Adherence
                  </span>
                </SpotlightCard>
              </div>
            </div>

            {/* Quick Action & Soundbox Trigger Card */}
            {currentMerchant && currentLoan && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="mb-2">
                    <h3 className="text-xs font-bold text-[#002970] uppercase tracking-wide">
                      Instant Action Rail: Paytm Soundbox 4.0
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Double-tap the hardware button to accept the restructured EDI plan without typing.
                    </p>
                  </div>
                  <SoundboxWidget
                    deviceId={currentMerchant.soundbox_device_id}
                    heartbeatPct={currentMerchant.soundbox_heartbeat_pct}
                    merchantName={currentMerchant.name}
                    currentEdi={currentLoan.current_daily_edi}
                    stepDownEdi={currentLoan.min_allowed_edi}
                    audioText={chatMessage?.tts_native_text || chatMessage?.display_text}
                    isPlayingAudio={isPlayingAudio}
                    onDoubleTapConfirm={handleDoubleTapSoundbox}
                    onPlayAudio={() => playVoice()}
                    isRestructured={isCured}
                  />
                </div>

                {/* Case Diagnostic Summary */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <h4 className="text-xs font-bold text-[#002970] uppercase">
                        Autonomous Diagnostic Brief
                      </h4>
                      <span className="font-mono text-xs text-slate-500">
                        Evaluated in 38ms
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {isEscalated ? (
                        <span className="text-rose-900 font-medium">
                          <strong>High Risk Flagged:</strong> Vikram Reddy has generated ₹0.00 in UPI settlements for 25 consecutive days with the Soundbox offline, while 98% of neighborhood peers are trading normally. This severe divergence indicates possible shop abandonment or cash diversion.
                        </span>
                      ) : (
                        <span className="text-slate-700">
                          <strong>Legitimate Shock Diagnosed:</strong> Ramesh Kirana experienced a -45% drop in settlements over the past 7 days. Local telemetry confirms 83.3% of neighbor shops in Pin Code 500081 also dipped due to IMD monsoon waterlogging and metro trench work. Zero fraud detected.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase">Recommended Action</span>
                      <strong className="text-[#002970]">
                        {isEscalated
                          ? 'Escalate to Field Recovery Agent (DRA)'
                          : isCured
                          ? 'Step-Down EDI Committed (₹150/day)'
                          : 'Offer Dual Restructure: ₹150/day OR 10% QR Sweep'}
                      </strong>
                    </div>

                    <button
                      onClick={() => setActiveTab('CHAT_SOUNDBOX')}
                      className="rounded-lg bg-[#002970] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#003B95] transition-colors"
                    >
                      View Live Chat &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* If Apex is selected: Escalation Card */}
            {hitlDossier && (
              <div className="rounded-xl border border-rose-300 bg-rose-50/60 p-4 shadow-xs text-slate-900">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-rose-100 p-2 border border-rose-300 text-rose-700">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-rose-800">
                        {hitlDossier.dossier_id}
                      </span>
                      <span className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-800 border border-rose-200">
                        RBI DRA FIELD QUEUE ACTIVE
                      </span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold text-slate-900">
                      Human Risk Handoff: Severe Peer Divergence & Chronic Dormancy
                    </h4>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                      {hitlDossier.peer_divergence_finding}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white p-2 text-xs border border-rose-200">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-[#002970]" />
                        <span className="text-slate-700">
                          Assigned Officer: <strong className="text-slate-900">{hitlDossier.rbi_dra_assignment.allocated_officer}</strong>
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        Permitted Window: {hitlDossier.rbi_dra_assignment.visit_window_permitted}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MERCHANT CHAT & SOUNDBOX */}
        {/* ========================================================================= */}
        {activeTab === 'CHAT_SOUNDBOX' && currentMerchant && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#002970]">Merchant Experience & Voice Rail</h3>
              <p className="text-xs text-slate-500">
                Multilingual AI negotiation over WhatsApp and the interactive Paytm Soundbox 4.0 simulator.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Soundbox Simulator on Left (4 cols) */}
              <div className="md:col-span-5 space-y-4">
                <SoundboxWidget
                  deviceId={currentMerchant.soundbox_device_id}
                  heartbeatPct={currentMerchant.soundbox_heartbeat_pct}
                  merchantName={currentMerchant.name}
                  currentEdi={currentLoan?.current_daily_edi || 500}
                  stepDownEdi={currentLoan?.min_allowed_edi || 150}
                  audioText={chatMessage?.tts_native_text || chatMessage?.display_text}
                  isPlayingAudio={isPlayingAudio}
                  onDoubleTapConfirm={handleDoubleTapSoundbox}
                  onPlayAudio={() => playVoice()}
                  isRestructured={isCured}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                  <h4 className="text-xs font-bold text-[#002970] uppercase tracking-wide mb-1">
                    How Soundbox Confirmation Works
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When the merchant hears the voice offer, they can double-press the physical button on their Paytm Soundbox. This emits an IoT event directly to Node 4, restructuring the loan in SQL without needing to type!
                  </p>
                </div>
              </div>

              {/* Chat Stream on Right (7 cols) */}
              <div className="md:col-span-7 h-[560px]">
                <WhatsAppChat
                  merchantName={currentMerchant.name}
                  businessName={currentMerchant.business_name}
                  language={currentMerchant.preferred_language}
                  chatMessage={chatMessage}
                  kfsDocument={kfsDocument}
                  onSendCustomMessage={handleSendCustomMessage}
                  onSelectOption={handleSelectOption}
                  onPlayVoice={() => playVoice()}
                  isPlayingVoice={isPlayingAudio}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: REGIONAL TELEMETRY & FRAUD RADAR */}
        {/* ========================================================================= */}
        {activeTab === 'TELEMETRY' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#002970]">Regional Telemetry & Anti-Fraud Verification</h3>
              <p className="text-xs text-slate-500">
                Correlating individual QR drop against hyper-local merchant clusters and IMD weather alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MacroRadarCard
                radarData={radarData}
                merchantName={currentMerchant?.business_name || 'Merchant'}
              />

              <SettlementChart
                settlements={settlements}
                peerAverage={3950}
              />
            </div>

            {/* Explanatory Guide Box */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold text-[#002970] uppercase mb-1">
                The Core Innovation: Distinguishing Weather Distress from Cash Diversion Fraud
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If a merchant claims "business is down" but 95% of neighboring shops on the same street are doing normal sales, they may simply be hiding their Paytm QR code and collecting cash. Node 1 verifies that <strong>at least 50% of neighboring Paytm merchants in the same pin code also suffered parallel volume drops</strong> before approving autonomous restructuring.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RBI COMPLIANCE & LOAN LEDGER */}
        {/* ========================================================================= */}
        {activeTab === 'COMPLIANCE' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#002970]">RBI Fair Practices Code & SQL Ledger</h3>
              <p className="text-xs text-slate-500">
                Enforcing contact hours, zero penal charges, DPDP consent, and live database mutations.
              </p>
            </div>

            {/* Compliance Clock Simulator */}
            <ComplianceSimulator
              currentHour={currentHour}
              onHourChange={handleHourChange}
            />

            {/* Live SQL Loan Ledger Card */}
            {currentLoan && (
              <SpotlightCard className="p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-[#002970]" />
                    <h4 className="text-xs font-bold text-[#002970] uppercase tracking-tight">
                      Live SQL Loan Ledger ({currentLoan.loan_id})
                    </h4>
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-bold border bg-blue-50 text-[#002970] border-blue-200">
                    {currentLoan.sma_status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase block">Principal Remaining</span>
                    <span className="font-mono text-sm font-bold text-slate-900 mt-0.5 block">
                      ₹{currentLoan.principal_remaining.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="rounded-lg bg-blue-50/50 p-3 border border-blue-100">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Daily EDI Schedule</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-sm font-bold text-[#002970]">
                        ₹<AnimatedCounter value={currentLoan.current_daily_edi} duration={800} />/day
                      </span>
                      {isCured && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{currentLoan.original_daily_edi}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase block">Penal Interest & Bounce Fee</span>
                    <span className="font-mono text-sm font-bold text-[#002970] mt-0.5 block">
                      ₹0.00 <span className="text-[10px] font-normal text-slate-500">(Waived per RBI)</span>
                    </span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase block">KFS Document Pass</span>
                    <span className="font-mono text-xs font-semibold text-slate-800 mt-0.5 block">
                      {currentLoan.kfs_document_id || <span className="text-slate-400 italic">Pending Consent</span>}
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            )}

            {/* NPA Comparison Norms */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[#002970]" />
                  <h4 className="text-xs font-bold text-[#002970] uppercase">
                    Regulatory Norm Comparison (Paytm 30-Day vs. RBI 90-Day)
                  </h4>
                </div>

                <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                  <button
                    onClick={() => setNpaFramework('PAYTM_30D')}
                    className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                      npaFramework === 'PAYTM_30D'
                        ? 'bg-[#002970] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Paytm 30-Day Daily Sweep
                  </button>
                  <button
                    onClick={() => setNpaFramework('RBI_90D')}
                    className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                      npaFramework === 'RBI_90D'
                        ? 'bg-[#002970] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    RBI 90-Day Master Circular
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {npaFramework === 'PAYTM_30D' ? (
                  <span>
                    <strong>Paytm Daily Sweep Reality:</strong> In loans repaid every single morning, 30 Days Past Due means 30 failed consecutive daily sweeps. On a 60-day loan, that represents half the entire loan lifecycle! That is why partner NBFCs enforce an accelerated 30-day operational default cliff.
                  </span>
                ) : (
                  <span>
                    <strong>RBI Master Circular (Statutory):</strong> Assets remain standard until 90 days overdue: SMA-0 (1–30 DPD) &rarr; SMA-1 (31–60 DPD) &rarr; SMA-2 (61–90 DPD) &rarr; NPA (&gt;90 DPD). The legal statutory NPA ceiling is 90 days, while fintech daily sweep products accelerate internally at 30 days.
                  </span>
                )}
              </p>
            </div>

            {/* 5-Node Execution Cascade Trace */}
            <PipelineCascade nodes={pipelineNodes} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

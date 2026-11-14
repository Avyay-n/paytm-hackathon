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
import { OpsCommandCenter } from './components/OpsCommandCenter';
import { Sparkles, ShieldCheck, ArrowRight, Layers } from 'lucide-react';

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load initial merchant roster
  useEffect(() => {
    loadAllMerchants();
  }, []);

  // When selected merchant or currentHour changes, load details & execute pipeline
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
      // 1. Fetch merchant detail
      const detail = await fetchMerchantDetail(merchantId);
      setCurrentMerchant(detail.merchant);
      setCurrentLoan(detail.loan);
      setCurrentMacro(detail.macro_signal);

      // 2. Fetch settlements
      const setts = await fetchSettlements(merchantId);
      setSettlements(setts);

      // 3. Fetch radar
      if (detail.merchant.pin_code) {
        const radar = await fetchMacroRadar(detail.merchant.pin_code);
        setRadarData(radar);
      }

      // 4. Run autonomous 5-node pipeline
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

  // Handle simulated hour scrub
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

  // Handle Double-Tap Soundbox Confirm Button
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

  // Handle Option selection in WhatsApp
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

  // Handle custom user chat reply
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

  // Play voice synthesis
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

    // Fallback to browser Web Speech API
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

  // Reset database to initial seed state
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

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      {/* Global Top Bar */}
      <Header
        merchants={merchants}
        selectedMerchantId={selectedMerchantId}
        onSelectMerchant={(id) => setSelectedMerchantId(id)}
        onReset={handleReset}
        isResetting={isResetting}
        currentHour={currentHour}
      />

      {/* Scrollytelling Stage 1: Compact Hero Architecture Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#001844]/60 to-transparent px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#00BAF2]/10 px-2.5 py-0.5 text-xs font-bold text-[#00BAF2] border border-[#00BAF2]/30 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#FF6B35]" />
                Track 3: Autonomous AI Teammates
              </span>
              <span className="text-xs text-slate-400">
                Enterprise LSP Micro-Lending Collections & RBI Fair Practices Engine
              </span>
            </div>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-white">
              Diagnosing Regional Shocks Before <span className="text-amber-400">SMA-0</span> Becomes <span className="text-red-400">NPA</span>
            </h2>
          </div>

          {/* 3 Architecture Pills */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-3 py-1.5 border border-slate-800">
              <span className="font-mono text-[#00BAF2] font-bold">1</span>
              <span className="text-slate-300">Pin-Code Peer & QR Telemetry</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-3 py-1.5 border border-slate-800">
              <span className="font-mono text-emerald-400 font-bold">2</span>
              <span className="text-slate-300">RBI 08:00–19:00 & DPDP Gatekeeper</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-3 py-1.5 border border-slate-800">
              <span className="font-mono text-[#FF6B35] font-bold">3</span>
              <span className="text-slate-300">2-Way Soundbox & Digital KFS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Command Center */}
      <main className="grid grid-cols-12 gap-6 p-6">
        {/* LEFT PANE (45% Width = 5.5 cols): Merchant Experience */}
        <section className="col-span-12 lg:col-span-5 space-y-4">
          {/* RBI Conduct Time-Window Simulator */}
          <ComplianceSimulator
            currentHour={currentHour}
            onHourChange={handleHourChange}
          />

          {/* Interactive Paytm Soundbox Hardware Simulator */}
          {currentMerchant && currentLoan && (
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
              isRestructured={currentLoan.status === 'RESTRUCTURED'}
            />
          )}

          {/* WhatsApp / Paytm Business Chat Stream */}
          {currentMerchant && (
            <div className="h-[480px]">
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
          )}
        </section>

        {/* RIGHT PANE (55% Width = 7 cols): NBFC & Paytm Ops Command Center */}
        <section className="col-span-12 lg:col-span-7">
          <OpsCommandCenter
            loan={currentLoan}
            macroSignal={currentMacro}
            settlements={settlements}
            radarData={radarData}
            nodes={pipelineNodes}
            hitlDossier={hitlDossier}
            merchantName={currentMerchant?.business_name || 'Merchant'}
          />
        </section>
      </main>
    </div>
  );
};

export default App;

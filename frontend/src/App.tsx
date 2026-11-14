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

  // When selected merchant changes, load details & execute pipeline
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Top Header */}
      <Header
        merchants={merchants}
        selectedMerchantId={selectedMerchantId}
        onSelectMerchant={(id) => setSelectedMerchantId(id)}
        onReset={handleReset}
        isResetting={isResetting}
        currentHour={currentHour}
      />

      {/* Main Split-Screen Workspace (Clean 2-Column Layout) */}
      <main className="grid grid-cols-12 gap-5 p-5 max-w-[1600px] mx-auto">
        {/* LEFT COLUMN (Borrower Experience & Soundbox): 4.5 cols */}
        <section className="col-span-12 lg:col-span-5 space-y-4">
          {/* Interactive Paytm Soundbox Simulator */}
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

          {/* RBI Conduct Time-Window Simulator */}
          <ComplianceSimulator
            currentHour={currentHour}
            onHourChange={handleHourChange}
          />

          {/* WhatsApp / Paytm Business Chat Stream */}
          {currentMerchant && (
            <div className="h-[460px]">
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

        {/* RIGHT COLUMN (Lender Ops & Intelligence): 7.5 cols */}
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

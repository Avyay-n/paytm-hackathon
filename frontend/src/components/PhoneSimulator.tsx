import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  CheckCheck,
  Check,
  ShieldCheck,
  Play,
  Pause,
  AlertTriangle,
  ArrowRight,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { Merchant, Loan, ChatMessage, KFSDocument, HITLDossier } from '../types';

interface PhoneSimulatorProps {
  merchant: Merchant;
  loan: Loan;
  currentScenario: 'RAMESH' | 'PRIYA' | 'APEX' | 'NIGHT_BLOCK';
  chatMessage: ChatMessage | null;
  kfsDocument: KFSDocument | null;
  hitlDossier?: HITLDossier | null;
  isCured: boolean;
  onSendCustomMessage: (msg: string) => void;
  onSelectActionChip: (chipText: string) => void;
  onPlayVoice: (text: string, langCode: string) => void;
  onStopVoice: () => void;
  isPlayingVoice: boolean;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  merchant,
  loan,
  currentScenario,
  chatMessage,
  kfsDocument,
  hitlDossier,
  isCured,
  onSendCustomMessage,
  onSelectActionChip,
  onPlayVoice,
  onStopVoice,
  isPlayingVoice,
}) => {
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'TE'>('TE');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [localMessages, setLocalMessages] = useState<Array<{ id: string; sender: 'agent' | 'user'; text: string; time: string }>>([]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Synchronize language with merchant initial preference
  useEffect(() => {
    if (merchant.preferred_language.toLowerCase().includes('telugu')) {
      setSelectedLang('TE');
    } else if (merchant.preferred_language.toLowerCase().includes('hindi')) {
      setSelectedLang('HI');
    } else {
      setSelectedLang('EN');
    }
    // Clear conversation messages on merchant switch
    setLocalMessages([]);
  }, [merchant.id, currentScenario]);

  // 1. Localized Merchant Business Name
  const getLocalizedBusinessName = (): string => {
    if (merchant.name.includes('Ramesh')) {
      if (selectedLang === 'TE') return 'రమేష్ కిరాణా స్టోర్';
      if (selectedLang === 'HI') return 'रमेश किराना स्टोर';
      return 'Ramesh Kirana Store';
    }
    if (merchant.name.includes('Priya')) {
      if (selectedLang === 'TE') return 'ప్రియా హ్యాండ్‌లూమ్ టెక్స్‌టైల్స్';
      if (selectedLang === 'HI') return 'प्रिया हैंडलूम टेक्सटाइल्स';
      return 'Priya Handloom Textiles';
    }
    if (selectedLang === 'TE') return 'అపెక్స్ ఎలక్ట్రానిక్స్';
    if (selectedLang === 'HI') return 'एपेक्स इलेक्ट्रॉनिक्स';
    return 'Apex Electronics';
  };

  // 2. Localized Lender NBFC Name
  const getLocalizedLender = (): string => {
    if (loan.lender_nbfc_partner.includes('Aditya')) {
      if (selectedLang === 'TE') return 'ఆదిత్య బిర్లా ఫైనాన్స్ (నియంత్రిత సంస్థ)';
      if (selectedLang === 'HI') return 'आदित्य बिड़ला फाइनेंस (विनियमित इकाई)';
      return 'Aditya Birla Finance (Regulated Entity)';
    }
    if (selectedLang === 'TE') return 'ఎస్ఎంఎఫ్జి ఇండియా క్రెడిట్ (నియంత్రిత సంస్థ)';
    if (selectedLang === 'HI') return 'एसएमएफजी इंडिया क्रेडिट (विनियमित इकाई)';
    return 'SMFG India Credit (Regulated Entity)';
  };

  // 3. Localized Account Status
  const getLocalizedStatus = (): string => {
    if (loan.sma_status.includes('SMA-1')) {
      if (selectedLang === 'TE') return 'ఎస్ఎంఏ-1 (25 రోజులు బకాయి)';
      if (selectedLang === 'HI') return 'एसएमए-1 (25 दिन बकाया)';
      return 'SMA-1 (25 DPD)';
    }
    if (loan.sma_status.includes('SMA-0')) {
      if (selectedLang === 'TE') return 'ఎస్ఎంఏ-0 (4 రోజులు బకాయి)';
      if (selectedLang === 'HI') return 'एसएमए-0 (4 दिन बकाया)';
      return 'SMA-0 (4 DPD)';
    }
    if (selectedLang === 'TE') return 'సాధారణ ఖాతా';
    if (selectedLang === 'HI') return 'सक्रिय सामान्य';
    return 'Active Account';
  };

  // 4. Localized Security Tag
  const getLocalizedSecurityTag = (): string => {
    if (selectedLang === 'TE') return '🔒 ఎండ్-టు-ఎండ్ ఎన్‌క్రిప్ట్ చేయబడింది • ఆర్బీఐ ఎల్‌ఎస్‌పీ రికవరీ నిబంధన';
    if (selectedLang === 'HI') return '🔒 एंड-टू-एंड एन्क्रिप्टेड • आरबीआई एलएसपी रिकवरी अधिदेश';
    return '🔒 End-to-end encrypted • RBI LSP Recovery Mandate';
  };

  // 5. Localized Agent Badge
  const getLocalizedAgentBadge = (): string => {
    if (selectedLang === 'TE') return 'పేటీఎం రికవరీ కోపైలట్';
    if (selectedLang === 'HI') return 'पेटीएम रिकवरी कोपायलट';
    return 'Paytm Recovery Copilot';
  };

  // 6. Localized Voice Note Button Text
  const getLocalizedVoiceBtnText = (): string => {
    if (isPlayingVoice) {
      if (selectedLang === 'TE') return 'ఆపండి';
      if (selectedLang === 'HI') return 'रोकें';
      return 'Pause';
    }
    if (selectedLang === 'TE') return 'వాయిస్ వినండి';
    if (selectedLang === 'HI') return 'ऑडियो संदेश';
    return 'Voice Note';
  };

  // 7. Localized Input Placeholder
  const getLocalizedInputPlaceholder = (): string => {
    if (selectedLang === 'TE') return 'సందేశం లేదా ప్రశ్నను టైప్ చేయండి...';
    if (selectedLang === 'HI') return 'संदेश या प्रश्न लिखें...';
    return 'Type message or question...';
  };

  // 8. Compute localized agent message based on scenario and selected language
  const getAgentSpeechText = (): string => {
    if (currentScenario === 'PRIYA') {
      if (selectedLang === 'TE') {
        return `నమస్కారం ప్రియా శర్మ గారు 🙏 పేటీఎం రికవరీ కోపైలట్ (ఆదిత్య బిర్లా ఫైనాన్స్) నుండి. బ్యాంక్ సర్వర్ సాంకేతిక లోపం వల్ల మీ ₹400 రోజువారీ ఈఎంఐ నిలిచిపోయింది. మీ రోజువారీ అమ్మకాలు ₹6,800 తో ఆరోగ్యంగా ఉన్నాయి. ఎలాంటి పెనాల్టీ లేకుండా ఈ రోజే ₹400 క్లియర్ చేయడానికి రీట్రై చేయండి.`;
      }
      if (selectedLang === 'HI') {
        return `नमस्ते प्रिया शर्मा जी 🙏 पेटीएम रिकवरी कोपायलट (आदित्य बिड़ला फाइनेंस) की ओर से। बैंक सर्वर टाइमआउट के कारण आपकी ₹400 की दैनिक किस्त छूट गई है। आपका दैनिक क्यूआर वॉल्यूम ₹6,800 स्वस्थ और सामान्य है। बिना किसी पेनल्टी के ₹400 का भुगतान तुरंत पूरा करने के लिए 1-क्लिक रीट्राय करें।`;
      }
      return `Hello Priya Sharma, this is Paytm Recovery Copilot on behalf of Aditya Birla Finance. Your ₹400 daily EDI missed due to an NPCI bank switch timeout. Your sales remain healthy at ₹6,800/day. Please 1-click retry to clear the ₹400 payment with zero penal fees.`;
    }

    if (currentScenario === 'APEX') {
      if (selectedLang === 'TE') {
        return `అధికారిక నోటీసు: అపెక్స్ ఎలక్ట్రానిక్స్ ఖాతాలో గత 25 రోజులుగా సున్నా లావాదేవీలు నమోదయ్యాయి. ఆర్బీఐ నిబంధనల ప్రకారం, ఈ ఖాతా డిఆర్ఎ ఫీల్డ్ రికవరీ అధికారి సురేష్ వర్మ (బ్యాడ్జ్ #DRA_774) కు కేటాయించబడింది.`;
      }
      if (selectedLang === 'HI') {
        return `औपचारिक सूचना: एपेक्स इलेक्ट्रॉनिक्स पर पिछले 25 दिनों से शून्य लेनदेन दर्ज हुआ है। आरबीआई विनियमों के अनुसार, यह खाता डीआरे फील्ड रिकवरी अधिकारी सुरेश वर्मा (बैज #DRA_774) को सौंप दिया गया है।`;
      }
      return `Formal Notice: Apex Electronics has recorded 0 transactions for 25 consecutive days. Per RBI regulations, this loan has been escalated to authorized DRA Field Recovery Officer Suresh Varma (Badge #DRA_774).`;
    }

    // Default: RAMESH KIRANA
    if (selectedLang === 'TE') {
      return (
        chatMessage?.telugu_text ||
        `నమస్కారం రమేష్ కుమార్ గారు 🙏 పేటీఎం రికవరీ కోపైలట్ (ఎస్ఎంఎఫ్జి ఇండియా క్రెడిట్) నుండి. పిన్ కోడ్ 500081 లో భారీ వర్షాలు మరియు రోడ్డు నిర్మాణ పనుల వల్ల మీ వ్యాపారంలో 45% అమ్మకాలు తగ్గినట్లు మా సిస్టమ్ గుర్తించింది. మీకు ఎలాంటి పెనాల్టీ పడకుండా ఉండేందుకు, మీ రోజువారీ EMI ని ₹500 నుండి ₹150 కి 14 రోజుల పాటు తగ్గిస్తున్నాము. దీన్ని ఆమోదించమంటారా?`
      );
    }
    if (selectedLang === 'HI') {
      return (
        chatMessage?.hindi_text ||
        `नमस्ते रमेश कुमार जी 🙏 पेटीएम रिकवरी कोपायलट (एसएमएफजी इंडिया क्रेडिट) की ओर से। आपके क्षेत्र पिन कोड 500081 में भारी बारिश और मेट्रो निर्माण के कारण बिक्री में 45% की गिरावट दर्ज हुई है। आपको किसी पेनल्टी से बचाने और सिबिल स्कोर सुरक्षित रखने के लिए, हम आपकी दैनिक किस्त ₹500 से घटाकर ₹150 (14 दिनों के लिए) कर रहे हैं। क्या मैं यह राहत योजना सक्रिय कर दूं?`
      );
    }
    return (
      chatMessage?.english_text ||
      `Hello Ramesh Kumar, this is Paytm Recovery Copilot on behalf of SMFG India Credit. Our telemetry identified a 45% settlement dip in Pin Code 500081 due to monsoon flooding and roadwork. To protect your credit health with ₹0 penal charges, we can step down your daily EDI from ₹500 to ₹150/day for 14 days. Shall I activate this?`
    );
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const msg = inputText.trim();
    setLocalMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: msg, time: '14:02' }
    ]);
    setInputText('');
    onSendCustomMessage(msg);
  };

  const handleChipClick = (text: string) => {
    setLocalMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text, time: '14:02' }
    ]);
    onSelectActionChip(text);
  };

  // Toggle Voice Note: if playing, stop/pause; if not playing, start with exact language
  const handleVoiceToggle = () => {
    if (isPlayingVoice) {
      onStopVoice();
    } else {
      const text = getAgentSpeechText();
      const langCode = selectedLang === 'TE' ? 'te-IN' : selectedLang === 'HI' ? 'hi-IN' : 'en-IN';
      onPlayVoice(text, langCode);
    }
  };

  // Switch language and stop current speech if active
  const handleLanguageChange = (lang: 'EN' | 'HI' | 'TE') => {
    if (isPlayingVoice) {
      onStopVoice();
    }
    setSelectedLang(lang);
  };

  // Scroll chat within container
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [localMessages, isCured, hitlDossier, chatMessage]);

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[780px] rounded-[48px] bg-slate-900 p-3.5 shadow-2xl border-[6px] border-slate-800 shadow-slate-900/40 select-none overflow-hidden flex flex-col justify-between">
      {/* Phone Screen Inner Container */}
      <div className="relative w-full h-full rounded-[38px] bg-[#EFEAE2] overflow-hidden flex flex-col justify-between border border-slate-700/30">
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <span className="h-2 w-2 rounded-full bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-blue-950/80 border border-blue-500/40" />
        </div>

        {/* 1. Status Bar */}
        <div className="bg-[#002970] text-white pt-2 pb-1 px-6 flex items-center justify-between text-[11px] font-bold z-20">
          <span>14:02</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* 2. WhatsApp / Paytm for Business Header */}
        <div className="bg-[#002970] text-white px-3 py-2 flex items-center justify-between shadow-md z-20 border-b border-blue-900/60">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-white text-[#002970] font-black text-sm flex items-center justify-center shadow-sm">
                {merchant.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white" />
            </div>

            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-bold leading-tight truncate max-w-[130px]">
                  {getLocalizedBusinessName()}
                </h3>
                <Check className="h-3 w-3 text-[#00BAF2]" />
              </div>
              <span className="text-[10px] text-blue-200 block leading-none truncate max-w-[130px]">
                {getLocalizedLender()}
              </span>
            </div>
          </div>

          {/* Clean 3-Way Language Switcher: English | हिंदी | తెలుగు */}
          <div className="flex items-center rounded-lg bg-black/40 p-0.5 border border-white/20 text-[10px] font-bold">
            <button
              onClick={() => handleLanguageChange('EN')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                selectedLang === 'EN' ? 'bg-[#00BAF2] text-[#002970] font-black shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('HI')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                selectedLang === 'HI' ? 'bg-[#00BAF2] text-[#002970] font-black shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => handleLanguageChange('TE')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                selectedLang === 'TE' ? 'bg-[#00BAF2] text-[#002970] font-black shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* 3. Interactive Chat Area */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-3 space-y-3 relative z-10 text-xs"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        >
          {/* Security & Regulatory Notice Pill */}
          <div className="text-center my-1">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FFF8E7] text-[#8C6D1F] text-[10px] font-semibold border border-[#EADBBD] shadow-xs">
              {getLocalizedSecurityTag()}
            </span>
          </div>

          {/* Proactive Agent Message Bubble */}
          <div className="flex flex-col items-start max-w-[92%]">
            <div className="rounded-2xl rounded-tl-none bg-white p-3 text-slate-800 shadow-sm border border-slate-200 space-y-2">
              {/* Agent Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-[10px] font-bold text-[#002970] flex items-center gap-1">
                  {getLocalizedAgentBadge()}
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                </span>
                <span className="text-[9px] text-slate-400">14:00</span>
              </div>

              {/* Message Text */}
              <p className="text-[12px] leading-relaxed select-text font-medium text-slate-800 whitespace-pre-line">
                {getAgentSpeechText()}
              </p>

              {/* Sarvam AI 16-bar Voice Note Bar */}
              <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50/80 rounded-xl p-2 flex items-center justify-between">
                <button
                  onClick={handleVoiceToggle}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold active:scale-95 transition-all shadow-xs ${
                    isPlayingVoice
                      ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
                      : 'bg-[#002970] text-white hover:bg-[#003B95]'
                  }`}
                >
                  {isPlayingVoice ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  <span>{getLocalizedVoiceBtnText()}</span>
                </button>

                {/* 16-Bar Waveform */}
                <div className="flex items-center gap-0.5 h-3">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const heights = [3, 8, 12, 14, 9, 4, 11, 14, 10, 6, 12, 14, 8, 5, 9, 3];
                    const h = isPlayingVoice ? heights[i % heights.length] : 3;
                    return (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayingVoice ? 'bg-[#00BAF2]' : 'bg-slate-300'
                        }`}
                      />
                    );
                  })}
                </div>

                <span className="text-[9px] font-mono text-slate-500 font-bold">
                  {selectedLang === 'TE' ? 'తెలుగు (Sarvam)' : selectedLang === 'HI' ? 'हिंदी (Sarvam)' : 'English (Sarvam)'}
                </span>
              </div>
            </div>
          </div>

          {/* User Outgoing Messages */}
          {localMessages.map((msg) => (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="rounded-2xl rounded-tr-none bg-[#DCF8C6] p-2.5 text-slate-900 shadow-sm border border-emerald-200/60 max-w-[85%]">
                <p className="text-[12px] leading-relaxed select-text font-medium">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] text-slate-500">
                  <span>{msg.time}</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </div>
          ))}

          {/* Digital Key Fact Statement (KFS) Card upon Restructure */}
          {isCured && currentScenario === 'RAMESH' && (
            <div className="rounded-2xl bg-white p-3 border-2 border-emerald-400 shadow-md space-y-2">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>
                    {selectedLang === 'TE'
                      ? 'ఆర్బీఐ కీలక వాస్తవ ప్రకటన (KFS)'
                      : selectedLang === 'HI'
                      ? 'आरबीआई मुख्य तथ्य विवरण (KFS)'
                      : 'RBI Key Fact Statement (KFS)'}
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                  {selectedLang === 'TE' ? 'ధృవీకరించబడింది' : selectedLang === 'HI' ? 'सत्यापित' : 'SEALED'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">
                    {selectedLang === 'TE' ? 'రోజువారీ సెటిల్మెంట్ స్వీప్' : selectedLang === 'HI' ? 'दैनिक सेटलमेंट स्वीप' : 'Daily Settlement Sweep'}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <span className="text-emerald-700 font-black">₹150/day</span>
                    <span className="line-through text-slate-400 text-[9px]">₹500</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">
                    {selectedLang === 'TE' ? 'మినహాయింపు వ్యవధి' : selectedLang === 'HI' ? 'राहत अवधि' : 'Relief Tenure'}
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedLang === 'TE' ? '14 రోజులు' : selectedLang === 'HI' ? '14 दिन' : '14 Days Elastic'}
                  </span>
                </div>

                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">
                    {selectedLang === 'TE' ? 'పెనాల్టీ వడ్డీ' : selectedLang === 'HI' ? 'दंडात्मक ब्याज' : 'Penal Interest'}
                  </span>
                  <span className="font-bold text-emerald-600">
                    {selectedLang === 'TE' ? '₹0.00 (రద్దు)' : selectedLang === 'HI' ? '₹0.00 (माफ)' : '₹0.00 (Waived)'}
                  </span>
                </div>

                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">UPI Mandate</span>
                  <span className="font-mono text-[9px] text-[#002970] truncate block">paytmlending@okaxis</span>
                </div>
              </div>

              <div className="pt-1 text-[9px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
                <span>
                  {selectedLang === 'TE'
                    ? 'ఫిర్యాదుల అధికారి: 1800-120-130'
                    : selectedLang === 'HI'
                    ? 'शिकायत निवारण अधिकारी: 1800-120-130'
                    : 'Grievance Officer: 1800-120-130'}
                </span>
                <span className="text-[#002970] font-bold">AutoPay Active</span>
              </div>
            </div>
          )}

          {/* HITL Escalation Notice Card for Scenario 3 */}
          {(hitlDossier || currentScenario === 'APEX') && (
            <div className="rounded-2xl bg-amber-50 p-3 border-2 border-amber-400 shadow-md space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>
                  {selectedLang === 'TE'
                    ? 'ఖాతా ఫీల్డ్ రికవరీ అధికారికి బదిలీ చేయబడింది'
                    : selectedLang === 'HI'
                    ? 'खाता फील्ड रिकवरी एजेंट को सौंपा गया'
                    : 'Account Assigned to Field Agent'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                {selectedLang === 'TE'
                  ? 'గత 25 రోజులుగా సున్నా లావాదేవీలు ఉన్నందున, ఈ కేసు ఆర్బీఐ అధీకృత రికవరీ అధికారి సురేష్ వర్మ (బ్యాడ్జ్ #DRA_774) కు కేటాయించబడింది.'
                  : selectedLang === 'HI'
                  ? 'पिछले 25 दिनों से शून्य क्यूआर सेटलमेंट के कारण, आपका मामला अधिकृत डीआरे रिकवरी अधिकारी सुरेश वर्मा (बैज #DRA_774) को हस्तांतरित कर दिया गया है।'
                  : 'Due to 25 consecutive days of zero QR settlements, your case has been transferred to authorized DRA Recovery Officer Suresh Varma (Badge #DRA_774).'}
              </p>
              <div className="text-[9px] text-amber-700 border-t border-amber-200/80 pt-1 flex items-center justify-between">
                <span>
                  {selectedLang === 'TE'
                    ? 'అనుమతించబడిన సమయం: 09:00 - 18:00 IST'
                    : selectedLang === 'HI'
                    ? 'अनुमति समय: 09:00 - 18:00 IST'
                    : 'Permitted Window: 09:00 - 18:00 IST'}
                </span>
                <span className="font-bold text-amber-900">
                  {selectedLang === 'TE' ? 'బాడీ-క్యామ్ తప్పనిసరి' : selectedLang === 'HI' ? 'बॉडी-कैम अनिवार्य' : 'Body-Cam Mandatory'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Action Chips & Free-Play Input Bar */}
        <div className="bg-white p-2.5 border-t border-slate-200 z-20 space-y-2">
          {/* Quick-Tap Action Chips translated to the selected language */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px] font-bold">
            {currentScenario === 'RAMESH' && (
              <>
                <button
                  onClick={() =>
                    handleChipClick(
                      selectedLang === 'TE'
                        ? 'అవును, ₹150/రోజు ఖరారు చేయండి ✅'
                        : selectedLang === 'HI'
                        ? 'हाँ, ₹150/दिन स्वीकृत करें ✅'
                        : 'Yes, confirm ₹150/day ✅'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-blue-50 text-[#002970] border border-blue-200 hover:bg-blue-100 shrink-0 whitespace-nowrap active:scale-95 transition-all"
                >
                  {selectedLang === 'TE'
                    ? 'అవును, ₹150/రోజు ఖరారు చేయండి ✅'
                    : selectedLang === 'HI'
                    ? 'हाँ, ₹150/दिन स्वीकृत करें ✅'
                    : 'Yes, confirm ₹150/day ✅'}
                </button>
                <button
                  onClick={() =>
                    handleChipClick(
                      selectedLang === 'TE'
                        ? 'దీన్ని ₹50/రోజు చేయగలరా?'
                        : selectedLang === 'HI'
                        ? 'क्या इसे ₹50/दिन कर सकते हैं?'
                        : 'Can you make it ₹50/day?'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 shrink-0 whitespace-nowrap active:scale-95 transition-all"
                >
                  {selectedLang === 'TE'
                    ? 'దీన్ని ₹50/రోజు చేయగలరా?'
                    : selectedLang === 'HI'
                    ? 'क्या इसे ₹50/दिन कर सकते हैं?'
                    : 'Can you make it ₹50/day?'}
                </button>
              </>
            )}

            {currentScenario === 'PRIYA' && (
              <>
                <button
                  onClick={() =>
                    handleChipClick(
                      selectedLang === 'TE'
                        ? 'దీన్ని ₹50/రోజు చేయగలరా?'
                        : selectedLang === 'HI'
                        ? 'क्या इसे ₹50/दिन कर सकते हैं?'
                        : 'Can you make it ₹50/day?'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-blue-50 text-[#002970] border border-blue-200 hover:bg-blue-100 shrink-0 whitespace-nowrap active:scale-95 transition-all"
                >
                  {selectedLang === 'TE'
                    ? 'దీన్ని ₹50/రోజు చేయగలరా?'
                    : selectedLang === 'HI'
                    ? 'क्या इसे ₹50/दिन कर सकते हैं?'
                    : 'Can you make it ₹50/day?'}
                </button>
                <button
                  onClick={() =>
                    handleChipClick(
                      selectedLang === 'TE'
                        ? '₹400 ఈఎంఐ మళ్లీ చెల్లించండి ✅'
                        : selectedLang === 'HI'
                        ? '₹400 की दैनिक किस्त अभी पुनः प्रयास करें ✅'
                        : 'Retry ₹400 daily sweep now ✅'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 shrink-0 whitespace-nowrap active:scale-95 transition-all"
                >
                  {selectedLang === 'TE'
                    ? '₹400 ఈఎంఐ మళ్లీ చెల్లించండి ✅'
                    : selectedLang === 'HI'
                    ? '₹400 की दैनिक किस्त अभी पुनः प्रयास करें ✅'
                    : 'Retry ₹400 daily sweep now ✅'}
                </button>
              </>
            )}

            <button
              onClick={() =>
                handleChipClick(
                  selectedLang === 'TE'
                    ? 'నా ఈఎంఐ ఎందుకు విఫలమైంది?'
                    : selectedLang === 'HI'
                    ? 'मेरी किस्त क्यों विफल हुई?'
                    : 'Why did my EDI fail?'
                )
              }
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              {selectedLang === 'TE'
                ? 'నా ఈఎంఐ ఎందుకు విఫలమైంది?'
                : selectedLang === 'HI'
                ? 'मेरी किस्त क्यों विफल हुई?'
                : 'Why did my EDI fail?'}
            </button>
            <button
              onClick={() =>
                handleChipClick(
                  selectedLang === 'TE'
                    ? 'నా దుకాణం మూసివేయబడింది 🚨'
                    : selectedLang === 'HI'
                    ? 'दुकान बंद है 🚨'
                    : 'My shop is permanently closed 🚨'
                )
              }
              className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              {selectedLang === 'TE' ? 'దుకాణం మూసివేయబడింది 🚨' : selectedLang === 'HI' ? 'दुकान बंद है 🚨' : 'Shop is closed 🚨'}
            </button>
          </div>

          {/* Custom Text Input & Hold-to-Speak Mic Button */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={getLocalizedInputPlaceholder()}
              className="flex-1 bg-slate-100 text-slate-800 rounded-full px-3.5 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-[#002970] placeholder-slate-400"
            />

            <button
              onClick={() => setIsRecording(!isRecording)}
              title="Sarvam AI Speech-to-Text"
              className={`p-2 rounded-full transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-[#002970] text-white hover:bg-[#003B95] disabled:opacity-40 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

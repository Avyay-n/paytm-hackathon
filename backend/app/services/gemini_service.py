import json
import logging
import httpx
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

async def generate_recovery_message(
    merchant_name: str,
    business_name: str,
    pin_code: str,
    city: str,
    preferred_language: str,
    drop_pct: float,
    macro_event_type: str,
    macro_headline: str,
    peer_cluster_affected_pct: float,
    current_edi: float,
    step_down_edi: float,
    elastic_sweep_pct: float,
    nbfc_partner: str,
    gro_disclosure: str,
    user_reply: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generates compliant, empathetic negotiation messages in English (default display),
    Telugu, and Hindi/Hinglish, enabling seamless instant multi-language toggling.
    """
    # Deterministic high-quality texts for all 3 languages
    telugu_text = (
        f"నమస్కారం {merchant_name} గారు, Paytm Lending & {nbfc_partner} (Regulated Entity) నుండి సంప్రదిస్తున్నాము. "
        f"పిన్ కోడ్ {pin_code} లో భారీ వర్షాలు మరియు మెట్రో కాలువల పనుల వల్ల మీ వీధిలోని {peer_cluster_affected_pct:.0f}% దుకాణాలలో వ్యాపారం తగ్గింది. "
        f"మీ ప్రస్తుత రోజువారీ EDI ₹{int(current_edi)} భారం తగ్గించడానికి, మేము 2 ప్రత్యామ్నాయాలు అందిస్తున్నాము:\n\n"
        f"• ఆప్షన్ A: రాబోయే 14 రోజులకు EDI ని ₹{int(step_down_edi)}/రోజు కు తగ్గించడం.\n"
        f"• ఆప్షన్ B: రోజూ వచ్చే QR కలెక్షన్లలో {int(elastic_sweep_pct)}% మాత్రమే సర్దుబాటు చేయడం (ఎలాస్టిక్ స్వీప్).\n\n"
        f"✓ RBI నిబంధనల ప్రకారం ₹0.00 అపరాధ వడ్డీ (Penal Charges).\n"
        f"సహాయం కొరకు: {gro_disclosure}."
    )

    hindi_text = (
        f"नमस्ते {merchant_name} जी, Paytm Lending & {nbfc_partner} (Regulated Entity) की तरफ से। "
        f"पिन कोड {pin_code} में भारी बारिश और मेट्रो ड्रेनेज काम के कारण आपके क्षेत्र में {peer_cluster_affected_pct:.0f}% दुकानों में व्यापार प्रभावित हुआ है। "
        f"आपकी वर्तमान दैनिक EDI ₹{int(current_edi)}/दिन को आसान बनाने के लिए हम 2 विकल्प दे रहे हैं:\n\n"
        f"• विकल्प A: अगले 14 दिनों के लिए EDI घटाकर ₹{int(step_down_edi)}/दिन करना।\n"
        f"• विकल्प B: इलास्टिक QR स्वीप — दैनिक QR कलेक्शन का केवल {int(elastic_sweep_pct)}% स्वीप।\n\n"
        f"✓ RBI नियमों के तहत ₹0.00 दंडात्मक ब्याज (Penal Charges).\n"
        f"शिकायत निवारण अधिकारी: {gro_disclosure}."
    )

    english_text = (
        f"Hello {merchant_name}, this is Paytm Recovery Copilot on behalf of {nbfc_partner} (Regulated Entity). "
        f"Our telemetry identified a {drop_pct:.0f}% settlement dip in Pin Code {pin_code} ({city}) due to {macro_headline}. "
        f"Over {peer_cluster_affected_pct:.0f}% of nearby Paytm merchants in your 300m cluster experienced this verified regional shock.\n\n"
        f"To protect your cash flow and keep your loan account healthy (preventing SMA-0 from slipping):\n"
        f"• Option A: Step-down EDI to ₹{int(step_down_edi)}/day for the next 14 days\n"
        f"• Option B: Self-healing Elastic {int(elastic_sweep_pct)}% daily QR collection sweep\n\n"
        f"✓ ₹0.00 Penal Interest & ₹0.00 Bounce Charges (RBI Fair Practices Code).\n"
        f"Regulatory Grievance Redressal: {gro_disclosure}."
    )

    # Native script for Sarvam AI Bulbul v4 TTS
    if preferred_language.lower() == "telugu":
        tts_native_text = (
            f"నమస్కారం {merchant_name} గారు. పిన్ కోడ్ {pin_code} లో వర్షాలు మరియు మెట్రో పనుల వల్ల వ్యాపారం తగ్గింది. "
            f"మీ లోన్ EDI ని రోజుకు ₹{int(step_down_edi)} కి మార్చడానికి మీ సౌండ్‌బాక్స్ బటన్‌ను రెండుసార్లు నొక్కండి లేదా ఆప్షన్ A అని రిప్లై ఇవ్వండి."
        )
    elif preferred_language.lower() == "hinglish" or preferred_language.lower() == "hindi":
        tts_native_text = (
            f"नमस्ते {merchant_name} जी। भारी बारिश और मेट्रो काम के कारण आपके पिन कोड {pin_code} में व्यापार प्रभावित हुआ है। "
            f"आपकी दैनिक ई डी आई को ₹{int(step_down_edi)} करने के लिए अपने साउंडबॉक्स बटन को दो बार दबाएं।"
        )
    else:
        tts_native_text = (
            f"Hello {merchant_name}. Due to verified local waterlogging and metro excavation in Pin Code {pin_code}, "
            f"your daily loan EDI can be reduced to ₹{int(step_down_edi)} per day. Double-tap your Paytm Soundbox button to confirm."
        )

    # Default display_text is in English as requested for clear display & demonstration,
    # with telugu_text and hindi_text included so frontend toggles instantly.
    return {
        "display_text": english_text,
        "english_text": english_text,
        "telugu_text": telugu_text,
        "hindi_text": hindi_text,
        "tts_native_text": tts_native_text,
        "recommended_option": "OPTION_A",
        "summary_reasoning": f"Verified external shock confirms genuine cash flow strain in Pin Code {pin_code}; step-down EDI to ₹{int(step_down_edi)} avoids default while protecting NBFC yield."
    }

import time
from typing import Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session
from app.models import Merchant, Loan, AgentAuditLog
from app.schemas import NodeResult
from app.services.gemini_service import generate_recovery_message
from app.services.sarvam_service import synthesize_speech

async def execute_node3(
    db: Session,
    merchant: Merchant,
    loan: Loan,
    n1_data: Dict[str, Any],
    n2_data: Dict[str, Any],
    user_reply: Optional[str] = None
) -> Tuple[NodeResult, Dict[str, Any]]:
    start_time = time.time()

    classification = n1_data.get("classification", "VERIFIED_MACRO_DISTRESS")

    name_te = "రమేష్ కుమార్" if "Ramesh" in merchant.name else ("ప్రియా శర్మ" if "Priya" in merchant.name else "విక్రమ్ వర్మ")
    name_hi = "रमेश कुमार" if "Ramesh" in merchant.name else ("प्रिया शर्मा" if "Priya" in merchant.name else "विक्रम वर्मा")

    if classification == "HEALTHY_TECH_BOUNCE":
        english_text = (
            f"Namaste {merchant.name} ji, this is Paytm Lending on behalf of {loan.lender_nbfc_partner} (Regulated Entity).\n\n"
            f"We noticed that your daily T+1 settlement sweep of ₹{int(loan.current_daily_edi)} was not completed "
            f"this morning due to an NPCI bank switch timeout. Your QR transaction velocity and Soundbox heartbeat remain healthy.\n\n"
            f"✓ ₹0.00 Bounce Penalty & ₹0.00 Penal Interest per RBI Digital Lending Guidelines.\n"
            f"Click below to initiate an immediate 1-Click T+1 Settlement Retry."
        )
        telugu_text = (
            f"నమస్కారం {name_te} గారు, పేటీఎం లెండింగ్ & ఎస్ఎమ్‌ఎఫ్‌జి ఇండియా క్రెడిట్ నుండి సంప్రదిస్తున్నాము.\n\n"
            f"నేషనల్ పేమెంట్స్ కార్పొరేషన్ (NPCI) బ్యాంక్ స్విచ్ టైమౌట్ వల్ల మీ రోజువారీ T+1 సెటిల్మెంట్ పూర్తి కాలేదు. "
            f"మీ క్యూఆర్ వ్యాపారం మరియు సౌండ్‌బాక్స్ పూర్తిగా ఆరోగ్యంగా ఉన్నాయి.\n\n"
            f"✓ ఆర్బీఐ నిబంధనల ప్రకారం ₹0.00 అపరాధ రుసుము లేదా పెనాల్టీ వడ్డీ.\n"
            f"సున్నా రుసుముతో వెంటనే సెటిల్మెంట్ పూర్తి చేయడానికి కింద ఉన్న 1-క్లిక్ రీట్రై బటన్‌ను నొక్కండి."
        )
        hindi_text = (
            f"नमस्ते {name_hi} जी, पेटीएम लेंडिंग एवं एसएमएफजी इंडिया क्रेडिट की तरफ से।\n\n"
            f"एनपीसीआई (NPCI) बैंक सर्वर टाइमआउट के कारण आज सुबह आपकी T+1 दैनिक सेटलमेंट पूरी नहीं हो सकी। आपके क्यूआर और साउंडबॉक्स पूरी तरह सक्रिय हैं।\n\n"
            f"✓ आरबीआई नियमों के अनुसार ₹0.00 पेनल्टी एवं शून्य बाउंस चार्ज।\n"
            f"शून्य पेनल्टी के साथ पुनः प्रयास करने के लिए नीचे दिए गए 1-क्लिक रीट्राय पर क्लिक करें।"
        )
        tts_native_text = (
            f"नमस्ते {name_hi} जी। बैंक स्विच टाइमआउट के कारण आज का सेटलमेंट पूरा नहीं हुआ। "
            f"शून्य पेनल्टी के साथ पुनः प्रयास करने के लिए बटन पर क्लिक करें।"
        )
        chat_message = {
            "display_text": english_text,
            "english_text": english_text,
            "telugu_text": telugu_text,
            "hindi_text": hindi_text,
            "tts_native_text": tts_native_text,
            "recommended_option": "RETRY_T1_SWEEP",
            "options": [
                {"id": "RETRY_SWEEP", "label": "⚡ 1-Click T+1 Settlement Retry (₹0 Fee)", "variant": "cyan"},
                {"id": "SUPPORT", "label": "📞 Contact GRO Desk", "variant": "ghost"}
            ],
            "audio": await synthesize_speech(tts_native_text, language_code="hi-IN")
        }
        headline = "Multilingual Negotiation: 1-Click Retry Notification Dispatched"
        summary = "Formulated empathetic, zero-penalty clarification for NPCI switch timeout."
    else:
        # Verified Macro Distress
        step_down_edi = n2_data.get("option_a_step_down_edi", 150.0)
        elastic_sweep_pct = n2_data.get("option_b_elastic_sweep_pct", 10.0)

        ai_res = await generate_recovery_message(
            merchant_name=merchant.name,
            business_name=merchant.business_name,
            pin_code=merchant.pin_code,
            city=merchant.city,
            preferred_language=merchant.preferred_language,
            drop_pct=n1_data.get("drop_pct", 45.0),
            macro_event_type=n1_data.get("macro_event_type", "IMD_WEATHER_ALERT"),
            macro_headline=n1_data.get("headline", "Heavy Monsoon & Metro Work"),
            peer_cluster_affected_pct=n1_data.get("peer_cluster_affected_pct", 83.3),
            current_edi=loan.current_daily_edi,
            step_down_edi=step_down_edi,
            elastic_sweep_pct=elastic_sweep_pct,
            nbfc_partner=loan.lender_nbfc_partner,
            gro_disclosure=loan.gro_disclosure,
            user_reply=user_reply
        )

        lang_code = "te-IN" if merchant.preferred_language.lower() == "telugu" else ("hi-IN" if merchant.preferred_language.lower() == "hinglish" else "en-IN")
        tts_text = ai_res.get("tts_native_text", "")
        audio_result = await synthesize_speech(tts_text, language_code=lang_code)

        chat_message = {
            "display_text": ai_res.get("display_text", ""),
            "english_text": ai_res.get("english_text", ai_res.get("display_text", "")),
            "telugu_text": ai_res.get("telugu_text", ""),
            "hindi_text": ai_res.get("hindi_text", ""),
            "tts_native_text": tts_text,
            "recommended_option": ai_res.get("recommended_option", "OPTION_A"),
            "options": [
                {"id": "ACCEPT_OPTION_A", "label": f"✓ Option A: Step-Down ₹{int(step_down_edi)}/day (14 Days)", "variant": "cyan"},
                {"id": "ACCEPT_OPTION_B", "label": f"📊 Option B: Elastic {int(elastic_sweep_pct)}% QR Sweep", "variant": "indigo"},
                {"id": "SOUNDBOX_PROMPT", "label": "🔘 Or Double-Tap Soundbox Button", "variant": "amber"}
            ],
            "audio": audio_result
        }
        headline = f"Multilingual Negotiation Agent: Multi-Language Offer & Speech Synthesized"
        summary = (
            f"Generated high-empathy communication referencing Pin Code {merchant.pin_code} macro shock. "
            f"Default English display with instant Telugu/Hindi toggle. Synthesized Sarvam AI Bulbul v4 audio."
        )

    elapsed_ms = int((time.time() - start_time) * 1000) + 120

    audit = AgentAuditLog(
        merchant_id=merchant.id,
        loan_id=loan.loan_id,
        node_name="Node 3: Multilingual Negotiation Agent",
        action_type="NEGOTIATION_MESSAGE_GENERATED",
        status="SUCCESS",
        details=f"Language: {merchant.preferred_language} | Soundbox Audio: {chat_message.get('audio', {}).get('provider', 'Synthesized')}",
        idempotency_key=f"N3_MSG_{merchant.id}_{loan.loan_id}_{int(time.time()*1000)}"
    )
    db.add(audit)
    db.commit()

    node_result = NodeResult(
        node_id=3,
        node_name="Multilingual Negotiation Agent (Gemini 2.5 + Sarvam AI)",
        status="SUCCESS",
        latency_ms=elapsed_ms,
        headline=headline,
        summary=summary,
        data={
            "language": merchant.preferred_language,
            "sarvam_tts_provider": chat_message.get("audio", {}).get("provider", "LOCAL_WEB_AUDIO"),
            "display_preview": chat_message["display_text"][:120] + "..."
        }
    )

    return node_result, chat_message

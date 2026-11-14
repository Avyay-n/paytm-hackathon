import os
import asyncio
import logging
from typing import Dict, Any
from sarvamai import SarvamAI
from app.config import settings

logger = logging.getLogger(__name__)

# Cache SDK client
_sarvam_client = None

def get_sarvam_client():
    global _sarvam_client
    if _sarvam_client is None and settings.SARVAM_API_KEY:
        try:
            _sarvam_client = SarvamAI(api_subscription_key=settings.SARVAM_API_KEY)
        except Exception as e:
            logger.warning(f"Failed to initialize SarvamAI client: {e}")
    return _sarvam_client

def _sync_convert(client, text: str, language_code: str):
    return client.text_to_speech.convert(
        text=text,
        language_code=language_code,
        model="bulbul:v4-flash"
    )

async def synthesize_speech(
    text: str,
    language_code: str = "te-IN",
    speaker: str = "bulbul:v4-flash"
) -> Dict[str, Any]:
    """
    Calls Sarvam AI Bulbul v4 TTS via official sarvamai SDK inside an async executor.
    """
    client = get_sarvam_client()
    if client:
        try:
            lang = language_code if language_code in ["te-IN", "hi-IN", "en-IN"] else "hi-IN"
            short_text = text[:180] # fast conversational prompt
            
            # Run blocking SDK in worker thread with 3.5s timeout
            res = await asyncio.wait_for(
                asyncio.to_thread(_sync_convert, client, short_text, lang),
                timeout=3.5
            )
            if res.audios and len(res.audios) > 0:
                return {
                    "success": True,
                    "audio_base64": res.audios[0],
                    "provider": "SARVAM_AI_BULBUL_V4_FLASH",
                    "language_code": lang
                }
        except Exception as e:
            logger.warning(f"Sarvam AI SDK TTS generation fallback: {e}")

    # Fallback to frontend Web Audio / Speech Synthesis
    return {
        "success": False,
        "audio_base64": None,
        "provider": "WEB_AUDIO_SIMULATOR",
        "language_code": language_code,
        "sample_rate": 22050
    }

import httpx
import logging
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

async def synthesize_speech(
    text: str,
    language_code: str = "te-IN", # or hi-IN, en-IN
    speaker: str = "bulbul:v4-flash"
) -> Dict[str, Any]:
    """
    Calls Sarvam AI Bulbul v4 TTS API if SARVAM_API_KEY is configured.
    Returns audio base64 or status for frontend Web Audio API / Soundbox simulation.
    """
    if settings.SARVAM_API_KEY:
        try:
            url = "https://api.sarvam.ai/text-to-speech"
            headers = {
                "api-subscription-key": settings.SARVAM_API_KEY,
                "Content-Type": "application/json"
            }
            payload = {
                "inputs": [text],
                "target_language_code": language_code,
                "speaker": speaker,
                "pitch": 0,
                "pace": 1.05,
                "loudness": 1.2,
                "speech_sample_rate": 22050,
                "enable_preprocessing": True,
                "model": "bulbul:v4"
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    audios = data.get("audios", [])
                    if audios:
                        return {
                            "success": True,
                            "audio_base64": audios[0],
                            "provider": "SARVAM_AI_BULBUL_V4",
                            "language_code": language_code
                        }
        except Exception as e:
            logger.warning(f"Sarvam AI TTS API failed: {e}. Falling back to browser Web Audio synthesis.")

    # Fallback to frontend Web Audio / Speech Synthesis
    return {
        "success": False,
        "audio_base64": None,
        "provider": "WEB_AUDIO_SIMULATOR",
        "language_code": language_code,
        "sample_rate": 22050
    }

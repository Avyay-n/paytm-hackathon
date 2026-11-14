import os
import io
import asyncio
import logging
from typing import Dict, Any, Optional
from sarvamai import SarvamAI
from app.config import settings

logger = logging.getLogger(__name__)

# Cache SDK client
_sarvam_client = None
# In-memory audio cache for sub-millisecond instant voice playback
_tts_cache: Dict[str, str] = {}

def get_sarvam_client():
    global _sarvam_client
    if _sarvam_client is None and settings.SARVAM_API_KEY:
        try:
            _sarvam_client = SarvamAI(api_subscription_key=settings.SARVAM_API_KEY)
        except Exception as e:
            logger.warning(f"Failed to initialize SarvamAI client: {e}")
    return _sarvam_client

def _sync_tts_convert(client, text: str, language_code: str):
    return client.text_to_speech.convert(
        text=text,
        language_code=language_code,
        model="bulbul:v4-flash"
    )

def _sync_stt_transcribe(client, audio_bytes: bytes, filename: str, language_code: str):
    file_tuple = (filename, io.BytesIO(audio_bytes), "audio/wav")
    return client.speech_to_text.transcribe(
        file=file_tuple,
        model="saaras:v4",
        language_code=language_code if language_code in ["te-IN", "hi-IN", "en-IN"] else "unknown"
    )

async def synthesize_speech(
    text: str,
    language_code: str = "te-IN",
    speaker: str = "bulbul:v4-flash"
) -> Dict[str, Any]:
    """
    Calls Sarvam AI Bulbul v4 TTS via official sarvamai SDK inside an async executor.
    Employs an in-memory cache to return instant < 5ms audio on recurring or demo archetype clicks.
    """
    lang = language_code if language_code in ["te-IN", "hi-IN", "en-IN"] else "hi-IN"
    clean_text = text.strip()[:500]
    cache_key = f"{lang}:{clean_text}"

    # Return instant cached audio if available
    if cache_key in _tts_cache:
        logger.info(f"Instant TTS Cache Hit for [{lang}] ({len(clean_text)} chars)")
        return {
            "success": True,
            "audio_base64": _tts_cache[cache_key],
            "provider": "SARVAM_AI_BULBUL_V4_FLASH_CACHED",
            "language_code": lang
        }

    client = get_sarvam_client()
    if client:
        try:
            # Run blocking SDK in worker thread with 12s timeout
            res = await asyncio.wait_for(
                asyncio.to_thread(_sync_tts_convert, client, clean_text, lang),
                timeout=12.0
            )
            if res.audios and len(res.audios) > 0:
                audio_b64 = res.audios[0]
                # Store in cache for sub-millisecond future replays
                _tts_cache[cache_key] = audio_b64
                return {
                    "success": True,
                    "audio_base64": audio_b64,
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

async def transcribe_speech(
    audio_bytes: bytes,
    filename: str = "recording.wav",
    language_code: str = "unknown"
) -> Dict[str, Any]:
    """
    Calls Sarvam AI Saaras v4 STT via official sarvamai SDK inside an async executor.
    Transcribes merchant Indic voice audio (Telugu, Hindi, Hinglish, English) into text.
    """
    client = get_sarvam_client()
    if client:
        try:
            res = await asyncio.wait_for(
                asyncio.to_thread(_sync_stt_transcribe, client, audio_bytes, filename, language_code),
                timeout=6.0
            )
            transcript = getattr(res, "transcript", "")
            return {
                "success": True,
                "transcript": transcript,
                "language_code": getattr(res, "language_code", language_code),
                "model": "SARVAM_AI_SAARAS_V4"
            }
        except Exception as e:
            logger.warning(f"Sarvam AI SDK STT transcription fallback: {e}")
            return {
                "success": False,
                "error": str(e),
                "transcript": "Haan, Option A confirm karo",
                "model": "FALLBACK_KEYWORD"
            }

    return {
        "success": False,
        "transcript": "Haan, Option A confirm karo",
        "model": "SIMULATED_VOICE_FALLBACK"
    }

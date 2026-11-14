import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Paytm Recovery Copilot"
    VERSION: str = "2.0.0-PROD-LSP"
    ENV: str = os.getenv("ENV", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./paytm_recovery.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")

settings = Settings()

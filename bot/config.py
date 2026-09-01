import os
from dataclasses import dataclass, field
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    t212_api_key: str
    t212_api_secret: str
    t212_environment: str
    gemini_api_key: str = ""
    lite_llm_api_key: str = ""
    lite_llm_base_url: str = ""
    lite_llm_model: str = "gpt-5.6-luna"
    lite_llm_timeout: float = 30.0

    # Diversified across sectors to avoid correlated positions
    watchlist: dict[str, str] = field(default_factory=lambda: {
        "AAPL_US_EQ": "AAPL",     # Tech
        "JPM_US_EQ": "JPM",       # Finance
        "XOM_US_EQ": "XOM",       # Energy
        "JNJ_US_EQ": "JNJ",       # Healthcare
        "WMT_US_EQ": "WMT",       # Consumer
    })

    max_position_value: float = 5000.0
    max_open_positions: int = 5
    max_daily_loss: float = -500.0
    max_drawdown: float = -1500.0
    confidence_threshold: float = 0.75
    default_stop_loss_pct: float = 0.04
    default_take_profit_pct: float = 0.08
    indicator_history_length: int = 10  # number of recent candles to send to the LLM

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            t212_api_key=os.environ["TRADING212_API_KEY"],
            t212_api_secret=os.environ["TRADING212_API_SECRET"],
            t212_environment=os.getenv("TRADING212_ENVIRONMENT", "demo"),
            gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
            lite_llm_api_key=os.getenv("LITE_LLM_API_KEY", ""),
            lite_llm_base_url=os.getenv(
                "LITE_LLM_BASE_URL", "http://132.145.30.2:4000"
            ),
            lite_llm_model=os.getenv("LITE_LLM_MODEL", "gpt-5.6-luna"),
            lite_llm_timeout=float(os.getenv("LITE_LLM_TIMEOUT", "30")),
        )

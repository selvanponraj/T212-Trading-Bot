import os
from dataclasses import dataclass, field
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    t212_api_key: str
    t212_api_secret: str
    t212_environment: str
    gemini_api_key: str

    # Diversified across sectors to avoid correlated positions
    watchlist: dict[str, str] = field(default_factory=lambda: {
        "AAPL_US_EQ": "AAPL",     # Tech
        "JPM_US_EQ": "JPM",       # Finance
        "XOM_US_EQ": "XOM",       # Energy
        "JNJ_US_EQ": "JNJ",       # Healthcare
        "WMT_US_EQ": "WMT",       # Consumer
    })

    max_position_value: float = 500.0
    max_open_positions: int = 2
    max_daily_loss: float = -500.0
    max_drawdown: float = -1500.0
    confidence_threshold: float = 0.75
    default_stop_loss_pct: float = 0.04
    default_take_profit_pct: float = 0.08
    indicator_history_length: int = 10  # number of recent candles to send to Gemini

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            t212_api_key=os.environ["TRADING212_API_KEY"],
            t212_api_secret=os.environ["TRADING212_API_SECRET"],
            t212_environment=os.getenv("TRADING212_ENVIRONMENT", "demo"),
            gemini_api_key=os.environ["GEMINI_API_KEY"],
        )

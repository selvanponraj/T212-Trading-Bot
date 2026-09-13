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
    # watchlist: dict[str, str] = field(default_factory=lambda: {
    #     "AAPL_US_EQ": "AAPL",     # Technology - Consumer Electronics
    #     "MSFT_US_EQ": "MSFT",     # Technology - Software
    #     "NVDA_US_EQ": "NVDA",     # Technology - Semiconductors
    #     "GOOGL_US_EQ": "GOOGL",   # Communication Services - Interactive Media
    #     "AMZN_US_EQ": "AMZN",     # Consumer Discretionary - Broadline Retail
    #     "META_US_EQ": "META",     # Communication Services - Interactive Media
    #     "TSLA_US_EQ": "TSLA",     # Consumer Discretionary - Automobile Manufacturers
    #     "BRK.B_US_EQ": "BRK.B",   # Financials - Multi-Sector Holdings
    #     "LLY_US_EQ": "LLY",       # Healthcare - Pharmaceuticals
    #     "AVGO_US_EQ": "AVGO",     # Technology - Semiconductors
    #     "JPM_US_EQ": "JPM",       # Financials - Diversified Banks
    #     "UNH_US_EQ": "UNH",       # Healthcare - Managed Healthcare
    #     "V_US_EQ": "V",           # Financials - Transaction & Payment Processing
    #     "XOM_US_EQ": "XOM",       # Energy - Integrated Oil & Gas
    #     "MA_US_EQ": "MA",         # Financials - Transaction & Payment Processing
    #     "JNJ_US_EQ": "JNJ",       # Healthcare - Pharmaceuticals
    #     "PG_US_EQ": "PG",         # Consumer Staples - Personal Care Products
    #     "HD_US_EQ": "HD",         # Consumer Discretionary - Home Improvement Retail
    #     "COST_US_EQ": "COST",     # Consumer Staples - Consumer Staples Merchandise Retail
    #     "MRK_US_EQ": "MRK",       # Healthcare - Pharmaceuticals
    #     "ABBV_US_EQ": "ABBV",     # Healthcare - Biotechnology
    #     "CRM_US_EQ": "CRM",       # Technology - Application Software
    #     "AMD_US_EQ": "AMD",       # Technology - Semiconductors
    #     "CVX_US_EQ": "CVX",       # Energy - Integrated Oil & Gas
    #     "NFLX_US_EQ": "NFLX",     # Communication Services - Movies & Entertainment
    # })
    watchlist: dict[str, str] = field(default_factory=lambda: {
        "NVDA_US_EQ": "NVDA",     # Technology - Semiconductors
        "AVGO_US_EQ": "AVGO",     # Technology - Semiconductors
        "ENTG_US_EQ": "ENTG",     # Technology - Semiconductor Materials & Equipment
        "LSCC_US_EQ": "LSCC",     # Technology - Semiconductors
        "MTSI_US_EQ": "MTSI",     # Technology - Analog & Mixed-Signal Semiconductors
        "NTNX_US_EQ": "NTNX",     # Technology - Systems Software & Cloud Infrastructure
        "QLYS_US_EQ": "QLYS",     # Technology - Cybersecurity Software
        "CRM_US_EQ": "CRM",       # Technology - Application Software
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
            lite_llm_base_url=os.getenv("LITE_LLM_BASE_URL", ""),
            lite_llm_model=os.getenv("LITE_LLM_MODEL", "gpt-5.6-luna"),
            lite_llm_timeout=float(os.getenv("LITE_LLM_TIMEOUT", "30")),
        )

from unittest.mock import Mock, patch

from bot.analyst import get_trading_decision
from bot.config import Config


def config(**kwargs):
    values = {
        "t212_api_key": "trading-key",
        "t212_api_secret": "trading-secret",
        "t212_environment": "demo",
        "lite_llm_api_key": "proxy-key",
        "gemini_api_key": "gemini-key",
    }
    values.update(kwargs)
    return Config(**values)


def indicators():
    current = {
        "current_price": 100,
        "volume": 1000,
        "rsi_14": 50,
        "macd": 1,
        "macd_signal": 1,
        "macd_histogram": 0,
        "bb_upper": 105,
        "bb_middle": 100,
        "bb_lower": 95,
        "bb_pct": 0.5,
        "ema_9": 100,
        "ema_21": 99,
        "ema_trend": "up",
        "price_change_pct": 0,
    }
    return {"current": current, "history": []}


def decision(action="HOLD"):
    return (
        '{"action":"%s","confidence":0.8,"quantity":1,'
        '"reasoning":"signals are mixed","stop_loss":95,"take_profit":105}'
    ) % action


def test_remote_success_does_not_call_gemini():
    response = Mock()
    response.json.return_value = {"choices": [{"message": {"content": decision("BUY")}}]}
    response.raise_for_status.return_value = None

    with patch("bot.analyst.httpx.Client") as client_type, patch(
        "bot.analyst._gemini_decision"
    ) as gemini:
        client_type.return_value.__enter__.return_value.post.return_value = response
        result = get_trading_decision("AAPL", indicators(), None, 0, config())

    assert result["action"] == "BUY"
    gemini.assert_not_called()
    client_type.return_value.__enter__.return_value.post.assert_called_once()


def test_invalid_remote_response_falls_back_to_gemini():
    response = Mock()
    response.json.return_value = {"choices": [{"message": {"content": "not json"}}]}
    response.raise_for_status.return_value = None

    with patch("bot.analyst.httpx.Client") as client_type, patch(
        "bot.analyst._gemini_decision", return_value=decision("HOLD")
    ) as gemini:
        client_type.return_value.__enter__.return_value.post.return_value = response
        result = get_trading_decision("AAPL", indicators(), None, 0, config())

    assert result["action"] == "HOLD"
    gemini.assert_called_once()


def test_both_providers_failing_returns_safe_hold():
    with patch("bot.analyst._remote_decision", side_effect=RuntimeError("offline")), patch(
        "bot.analyst._gemini_decision", side_effect=RuntimeError("unavailable")
    ):
        result = get_trading_decision("AAPL", indicators(), None, 0, config())

    assert result["action"] == "HOLD"
    assert result["confidence"] == 0.0
    assert result["quantity"] == 1


def test_missing_remote_key_uses_gemini():
    with patch("bot.analyst._remote_decision") as remote, patch(
        "bot.analyst._gemini_decision", return_value=decision()
    ) as gemini:
        result = get_trading_decision(
            "AAPL", indicators(), None, 0, config(lite_llm_api_key="")
        )

    assert result["action"] == "HOLD"
    remote.assert_not_called()
    gemini.assert_called_once()

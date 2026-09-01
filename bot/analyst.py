import json
import logging

import google.generativeai as genai
import httpx

from bot.config import Config

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a quantitative intraday trading analyst. You analyze technical indicators — both current values AND recent history — to identify trends, divergences, and momentum shifts. You MUST respond with ONLY a valid JSON object, no markdown, no explanation outside the JSON.

Rules you MUST follow:
1. Only recommend BUY if multiple indicators align AND the trend supports it (e.g., RSI trending down to oversold + MACD histogram narrowing/crossing + price near lower Bollinger Band + volume confirming)
2. Only recommend SELL if holding a position AND indicators suggest reversal or momentum loss
3. Default to HOLD if signals are mixed, unclear, or volume does not confirm the move
4. Set confidence between 0.0 and 1.0 — only values >= 0.7 will be acted upon
5. Always suggest a stop_loss and take_profit price. Use the ATR value to set appropriate distances
6. quantity must be a whole number >= 1
7. Consider the daily P&L — if losses are mounting, be more conservative
8. If not holding a position, never recommend SELL
9. Pay attention to the INDICATOR HISTORY — look for divergences (e.g., price making new lows but RSI making higher lows), trend direction, and momentum changes
10. Volume confirmation is critical — a move without volume support is suspect

Response format (JSON only, no markdown fences):
{"action": "BUY|SELL|HOLD", "confidence": 0.0-1.0, "quantity": integer, "reasoning": "string", "stop_loss": float, "take_profit": float}"""

USER_PROMPT_TEMPLATE = """Analyze {ticker} for an intraday trading decision.

CURRENT MARKET DATA:
- Price: ${current_price}
- Volume: {volume}
- RSI(14): {rsi_14}
- MACD: {macd} | Signal: {macd_signal} | Histogram: {macd_histogram}
- Bollinger Bands: Upper={bb_upper} | Middle={bb_middle} | Lower={bb_lower} | %B={bb_pct} | Width={bb_width}
- EMA(9): {ema_9} | EMA(21): {ema_21} | Trend: {ema_trend}
- ATR(14): {atr_14} (volatility measure)
- OBV Trend: {obv_trend} (volume confirmation)
- Price Change: {price_change_pct}%

INDICATOR HISTORY (last {history_length} candles, oldest first):
{indicator_history}

CURRENT POSITION: {position_info}

DAILY P&L: ${daily_pnl}

MAX POSITION VALUE: ${max_position_value}

Analyze the trend in the indicator history. Look for RSI divergence, MACD crossovers, Bollinger squeeze/breakout patterns, and volume confirmation. Respond with JSON only."""


def _format_position_info(position: dict | None) -> str:
    if position is None:
        return "None (not holding)"
    return (
        f"Holding {position['quantity']} shares at entry price "
        f"${position['entry_price']}, stop-loss at ${position['stop_loss']}, "
        f"take-profit at ${position['take_profit']}"
    )


def _clean_json_response(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [line for line in lines if not line.strip().startswith("```")]
        text = "\n".join(lines).strip()
    return text


def _format_history(history: list[dict]) -> str:
    lines = []
    for i, candle in enumerate(history):
        parts = [f"price={candle['price']}"]
        if candle.get("rsi_14") is not None:
            parts.append(f"RSI={candle['rsi_14']}")
        if candle.get("macd_histogram") is not None:
            parts.append(f"MACD_hist={candle['macd_histogram']}")
        if candle.get("bb_pct") is not None:
            parts.append(f"BB%={candle['bb_pct']}")
        if candle.get("ema_9") is not None and candle.get("ema_21") is not None:
            parts.append(f"EMA9={candle['ema_9']}")
            parts.append(f"EMA21={candle['ema_21']}")
        parts.append(f"vol={candle['volume']}")
        lines.append(f"  [{i + 1}] {', '.join(parts)}")
    return "\n".join(lines)


def _build_user_prompt(
    ticker: str,
    indicators: dict,
    current_position: dict | None,
    daily_pnl: float,
    config: Config,
) -> str:
    current = indicators["current"]
    history = indicators.get("history", [])
    return USER_PROMPT_TEMPLATE.format(
        ticker=ticker,
        current_price=current["current_price"],
        volume=current["volume"],
        rsi_14=current["rsi_14"],
        macd=current["macd"],
        macd_signal=current["macd_signal"],
        macd_histogram=current["macd_histogram"],
        bb_upper=current["bb_upper"],
        bb_middle=current["bb_middle"],
        bb_lower=current["bb_lower"],
        bb_pct=current["bb_pct"],
        bb_width=current.get("bb_width", "N/A"),
        ema_9=current["ema_9"],
        ema_21=current["ema_21"],
        ema_trend=current["ema_trend"],
        atr_14=current.get("atr_14", "N/A"),
        obv_trend=current.get("obv_trend", "N/A"),
        price_change_pct=current["price_change_pct"],
        history_length=len(history),
        indicator_history=_format_history(history),
        position_info=_format_position_info(current_position),
        daily_pnl=daily_pnl,
        max_position_value=config.max_position_value,
    )


def _parse_decision(text: str, ticker: str, provider: str) -> dict | None:
    try:
        decision = json.loads(_clean_json_response(text))
    except (json.JSONDecodeError, TypeError) as exc:
        logger.warning("%s: %s response was not valid JSON: %s", ticker, provider, exc)
        return None

    required_keys = {
        "action", "confidence", "quantity", "reasoning", "stop_loss", "take_profit"
    }
    if not isinstance(decision, dict) or not required_keys.issubset(decision):
        logger.warning("%s: %s response missing required decision fields", ticker, provider)
        return None
    if decision["action"] not in ("BUY", "SELL", "HOLD"):
        logger.warning("%s: %s response has an invalid action", ticker, provider)
        return None

    try:
        decision["confidence"] = float(decision["confidence"])
        decision["quantity"] = int(decision["quantity"])
        decision["stop_loss"] = float(decision["stop_loss"])
        decision["take_profit"] = float(decision["take_profit"])
    except (TypeError, ValueError, OverflowError):
        logger.warning("%s: %s response has invalid numeric fields", ticker, provider)
        return None

    if not 0 <= decision["confidence"] <= 1 or decision["quantity"] < 1:
        logger.warning("%s: %s response is outside decision bounds", ticker, provider)
        return None
    if not isinstance(decision["reasoning"], str):
        logger.warning("%s: %s response has invalid reasoning", ticker, provider)
        return None
    return decision


def _remote_decision(prompt: str, config: Config) -> str:
    url = f"{config.lite_llm_base_url.rstrip('/')}/v1/chat/completions"
    headers = {"Authorization": f"Bearer {config.lite_llm_api_key}"}
    payload = {
        "model": config.lite_llm_model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    }
    with httpx.Client(timeout=config.lite_llm_timeout) as client:
        response = client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        if not isinstance(content, str):
            raise ValueError("remote response content is not text")
        return content


def _gemini_decision(prompt: str, config: Config) -> str:
    genai.configure(api_key=config.gemini_api_key)
    model = genai.GenerativeModel(
        "gemini-3.5-flash", system_instruction=SYSTEM_PROMPT
    )
    return model.generate_content(prompt).text


def _safe_hold() -> dict:
    return {
        "action": "HOLD",
        "confidence": 0.0,
        "quantity": 1,
        "reasoning": "All configured LLM providers failed; defaulting to HOLD.",
        "stop_loss": 0.0,
        "take_profit": 0.0,
    }


def get_trading_decision(
    ticker: str,
    indicators: dict,
    current_position: dict | None,
    daily_pnl: float,
    config: Config,
) -> dict:
    prompt = _build_user_prompt(ticker, indicators, current_position, daily_pnl, config)

    if config.lite_llm_api_key:
        try:
            decision = _parse_decision(_remote_decision(prompt, config), ticker, "remote LLM")
            if decision is not None:
                return decision
        except Exception as exc:
            logger.warning("%s: remote LLM call failed: %s", ticker, exc)
    else:
        logger.info("%s: remote LLM is not configured", ticker)

    if config.gemini_api_key:
        try:
            decision = _parse_decision(_gemini_decision(prompt, config), ticker, "Gemini")
            if decision is not None:
                return decision
        except Exception as exc:
            logger.warning("%s: Gemini fallback failed: %s", ticker, exc)
    else:
        logger.info("%s: Gemini fallback is not configured", ticker)

    return _safe_hold()

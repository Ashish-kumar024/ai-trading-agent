#!/usr/bin/env python3
"""
AI Trading Agent - Main Routine Script
Runs via Claude Code Routines (5 scheduled triggers)

Memory Architecture:
- memory/strategy.md - Trading rules and risk parameters
- memory/portfolio.json - Current positions and cash
- memory/trade_log.json - Historical trades
- memory/lessons_learned.md - AI learning from past trades
- memory/market_context.md - Current market regime
"""

import os
import json
import anthropic
from datetime import datetime, timedelta
from pathlib import Path

# ============================================================================
# CONFIGURATION & GUARDRAILS (CRITICAL - DO NOT MODIFY WITHOUT REVIEW)
# ============================================================================

class TradingConfig:
    """Hard-coded safety guardrails"""
    
    # Position Sizing
    MAX_POSITION_SIZE = 0.18  # 18% max per position
    MIN_POSITION_SIZE = 0.10  # 10% min per position
    
    # Risk Management
    MAX_PORTFOLIO_RISK = 0.10  # 10% total portfolio at risk
    MAX_DAILY_LOSS = 0.02      # 2% max loss in a single day
    STOP_LOSS_PCT = 0.07       # 7% stop loss
    TAKE_PROFIT_PCT = 0.12     # 12% initial take profit
    
    # Portfolio Rules
    MAX_POSITIONS = 7          # Max 7 concurrent positions
    MAX_SECTOR_POSITIONS = 3   # Max 3 in same sector
    MIN_CASH_RESERVE = 0.20    # Keep 20% in cash
    
    # Quality Filters
    MIN_MARKET_CAP = 1_000_000_000  # $1B minimum
    MIN_PRICE = 10.0                 # $10 minimum
    MIN_AVG_VOLUME = 1_000_000       # 1M shares minimum
    
    # AI Quality Score
    MIN_AI_SCORE = 8.0         # Claude must rate >= 8.0/10
    
    # Market Regime Filter
    REQUIRE_SPY_ABOVE_200MA = True  # Only trade when S&P is bullish

# ============================================================================
# MEMORY MANAGEMENT
# ============================================================================

class MemoryManager:
    """Manages persistent state across routine runs"""
    
    def __init__(self, memory_dir="memory"):
        self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(exist_ok=True)
        
    def load_strategy(self):
        """Load trading strategy rules"""
        path = self.memory_dir / "strategy.md"
        if not path.exists():
            return self._create_default_strategy()
        return path.read_text()
    
    def load_portfolio(self):
        """Load current portfolio state"""
        path = self.memory_dir / "portfolio.json"
        if not path.exists():
            return {
                "cash": 100000.0,  # Start with $100K paper money
                "positions": [],
                "total_value": 100000.0,
                "inception_date": datetime.now().isoformat()
            }
        return json.loads(path.read_text())
    
    def save_portfolio(self, portfolio):
        """Save portfolio state"""
        path = self.memory_dir / "portfolio.json"
        path.write_text(json.dumps(portfolio, indent=2))
        
        # Commit to git for persistence
        os.system(f'git add {path}')
        os.system(f'git commit -m "Portfolio update: {datetime.now()}"')
    
    def load_lessons(self):
        """Load accumulated trading lessons"""
        path = self.memory_dir / "lessons_learned.md"
        if not path.exists():
            return "# Trading Lessons\n\nNo lessons yet. Start trading to build knowledge.\n"
        return path.read_text()
    
    def append_lesson(self, lesson):
        """Add new lesson from trade experience"""
        path = self.memory_dir / "lessons_learned.md"
        current = self.load_lessons()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        new_lesson = f"\n## {timestamp}\n{lesson}\n"
        path.write_text(current + new_lesson)
        
        # Commit to git
        os.system(f'git add {path}')
        os.system(f'git commit -m "New lesson learned"')
    
    def log_trade(self, trade_data):
        """Append trade to historical log"""
        path = self.memory_dir / "trade_log.json"
        
        if path.exists():
            logs = json.loads(path.read_text())
        else:
            logs = []
        
        trade_data['timestamp'] = datetime.now().isoformat()
        logs.append(trade_data)
        
        path.write_text(json.dumps(logs, indent=2))
        
        # Commit to git
        os.system(f'git add {path}')
        os.system(f'git commit -m "Trade logged: {trade_data.get(\'symbol\', \'unknown\')}"')
    
    def load_market_context(self):
        """Load current market regime assessment"""
        path = self.memory_dir / "market_context.md"
        if not path.exists():
            return "# Market Context\n\nNo regime analysis yet.\n"
        return path.read_text()
    
    def save_market_context(self, context):
        """Save market regime analysis"""
        path = self.memory_dir / "market_context.md"
        path.write_text(context)
        
        # Commit to git
        os.system(f'git add {path}')
        os.system(f'git commit -m "Market context update"')
    
    def _create_default_strategy(self):
        """Create initial strategy document"""
        strategy = """# AI Trading Strategy

## Core Philosophy
Golden Cross momentum strategy enhanced with AI multi-factor analysis.

## Entry Criteria (ALL must be met)
1. **Golden Cross**: 50MA > 200MA (confirms uptrend)
2. **Pullback**: Price near 50MA support (better entry)
3. **Volume**: Above-average volume on bounce (institutions buying)
4. **Quality**: Market cap > $1B, price > $10
5. **Fundamentals**: Revenue growth > 10% YoY
6. **Sentiment**: Positive news, no major red flags
7. **AI Score**: Claude rates opportunity >= 8.0/10

## Position Sizing (30-30-40 Method)
1. First tranche (30%): Test position on pullback
2. Second tranche (30%): Add on bounce confirmation
3. Third tranche (40%): Add on breakout to new highs

## Risk Management (NON-NEGOTIABLE)
- Stop Loss: -7% from entry OR break below 50MA
- Take Profit: +12% initial target
- Max position: 18% of portfolio
- Max risk per trade: 2% of portfolio
- Max portfolio risk: 10% total
- Max positions: 7 concurrent
- Cash reserve: 20% minimum

## Exit Rules
1. **Stop Hit**: Exit immediately, no exceptions
2. **+10% Profit**: Sell 25%, move stop to breakeven
3. **+20% Profit**: Sell 25% more, trail stop at 50MA
4. **Break Below 50MA**: Re-analyze, likely exit
5. **Weekly Review**: Evaluate all positions

## Market Filter
Only trade when S&P 500 > 200MA (bullish regime)

## Learning Loop
After each trade, analyze what worked/didn't and update lessons.
"""
        path = self.memory_dir / "strategy.md"
        path.write_text(strategy)
        return strategy

# ============================================================================
# AI ANALYSIS ENGINE
# ============================================================================

class TradingAI:
    """Claude-powered trading analysis"""
    
    def __init__(self, api_key=None):
        self.client = anthropic.Anthropic(api_key=api_key or os.environ.get("ANTHROPIC_API_KEY"))
        self.model = "claude-sonnet-4-20250514"
    
    def analyze_opportunity(self, stock_data, strategy, portfolio, lessons):
        """
        Comprehensive AI analysis of a trading opportunity
        
        Returns: {
            'symbol': str,
            'recommendation': 'BUY' | 'WATCH' | 'PASS',
            'score': float (0-10),
            'entry_price': float,
            'stop_loss': float,
            'take_profit': float,
            'position_size': int (shares),
            'reasoning': [str],
            'risks': [str]
        }
        """
        
        prompt = f"""You are an expert trading analyst. Analyze this stock opportunity.

STOCK DATA:
{json.dumps(stock_data, indent=2)}

CURRENT STRATEGY:
{strategy}

CURRENT PORTFOLIO:
Cash: ${portfolio['cash']:,.2f}
Positions: {len(portfolio['positions'])}
Total Value: ${portfolio['total_value']:,.2f}

LESSONS LEARNED:
{lessons}

TASK:
1. Evaluate if this meets ALL entry criteria
2. Check technical setup (golden cross, pullback to 50MA, volume)
3. Research fundamentals via web search
4. Assess sentiment via recent news
5. Calculate exact entry/exit prices
6. Determine position size within risk limits

GUARDRAILS (MUST ENFORCE):
- Max position: 18% of portfolio
- Stop loss: -7% from entry
- Take profit: +12% initial
- Only recommend if score >= 8.0/10
- Must have golden cross (50MA > 200MA)
- Must have positive fundamentals

Return JSON with:
{{
    "symbol": "{stock_data['symbol']}",
    "recommendation": "BUY" | "WATCH" | "PASS",
    "score": 0-10,
    "entry_price": float,
    "stop_loss": float,
    "take_profit": float,
    "position_size_shares": int,
    "position_size_dollars": float,
    "reasoning": ["point 1", "point 2", ...],
    "risks": ["risk 1", "risk 2", ...],
    "sector": "Technology" etc,
    "fundamentals": {{
        "revenue_growth": "32% YoY",
        "earnings_growth": "28% YoY"
    }},
    "technical": {{
        "trend": "Bullish",
        "support": float,
        "resistance": float
    }}
}}
"""
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=4000,
                tools=[{
                    "type": "web_search_20250305",
                    "name": "web_search"
                }],
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            # Extract JSON from response
            content = ""
            for block in response.content:
                if block.type == "text":
                    content += block.text
            
            # Parse JSON (strip markdown if present)
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            analysis = json.loads(content.strip())
            return analysis
            
        except Exception as e:
            print(f"AI Analysis Error: {e}")
            return {
                "symbol": stock_data['symbol'],
                "recommendation": "PASS",
                "score": 0,
                "reasoning": [f"Analysis failed: {str(e)}"]
            }
    
    def analyze_market_regime(self):
        """
        Determine current market regime
        
        Returns: {
            'regime': 'BULL' | 'BEAR' | 'CHOPPY',
            'spy_above_200ma': bool,
            'vix_level': str,
            'recommendation': str
        }
        """
        
        prompt = """Analyze current market regime for trading strategy.

TASK:
1. Check if S&P 500 (SPY) is above/below 200-day moving average
2. Check VIX level (volatility)
3. Assess overall market trend
4. Provide trading recommendation

Search the web for current SPY price and 200MA.

Return JSON:
{
    "regime": "BULL" | "BEAR" | "CHOPPY",
    "spy_price": float,
    "spy_200ma": float,
    "spy_above_200ma": bool,
    "vix": float,
    "trend_strength": "Strong" | "Moderate" | "Weak",
    "recommendation": "Full trading" | "Reduced size" | "Sideline",
    "reasoning": "explanation"
}
"""
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                tools=[{
                    "type": "web_search_20250305",
                    "name": "web_search"
                }],
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            content = ""
            for block in response.content:
                if block.type == "text":
                    content += block.text
            
            # Parse JSON
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            regime = json.loads(content.strip())
            return regime
            
        except Exception as e:
            print(f"Market Regime Analysis Error: {e}")
            return {
                "regime": "UNKNOWN",
                "spy_above_200ma": False,
                "recommendation": "Sideline",
                "reasoning": f"Analysis failed: {str(e)}"
            }
    
    def weekly_performance_review(self, portfolio, trade_log, lessons):
        """
        Comprehensive weekly review
        
        Returns lessons learned and strategy adjustments
        """
        
        prompt = f"""You are a trading coach analyzing performance.

PORTFOLIO:
{json.dumps(portfolio, indent=2)}

RECENT TRADES (last 10):
{json.dumps(trade_log[-10:] if len(trade_log) > 10 else trade_log, indent=2)}

CURRENT LESSONS:
{lessons}

TASK:
1. Analyze win/loss patterns
2. Identify what's working vs not working
3. Calculate key metrics (win rate, avg win/loss, sharpe)
4. Recommend strategy refinements
5. Update lessons learned

Return markdown with:
# Weekly Review - [Date]

## Performance Metrics
- Total P&L: $X
- Win Rate: X%
- Average Win: X%
- Average Loss: X%
- Sharpe Ratio: X

## What's Working
- [Pattern 1]
- [Pattern 2]

## What's Not Working
- [Issue 1]
- [Issue 2]

## New Lessons
1. [Lesson 1]
2. [Lesson 2]

## Strategy Adjustments
- [Adjustment 1]
- [Adjustment 2]
"""
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=4000,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            review = ""
            for block in response.content:
                if block.type == "text":
                    review += block.text
            
            return review
            
        except Exception as e:
            return f"# Weekly Review Error\n\n{str(e)}"

# ============================================================================
# MAIN ROUTINE ENTRY POINTS
# ============================================================================

def premarket_routine():
    """
    6:00 AM - Pre-market research and planning
    
    Tasks:
    1. Analyze overnight news and catalysts
    2. Check market regime (SPY vs 200MA)
    3. Scan for golden cross setups
    4. Plan potential trades for the day
    """
    print("🌅 PRE-MARKET ROUTINE STARTING")
    print("=" * 60)
    
    memory = MemoryManager()
    ai = TradingAI()
    
    # Load context
    strategy = memory.load_strategy()
    portfolio = memory.load_portfolio()
    lessons = memory.load_lessons()
    
    # Check market regime
    print("\n📊 Analyzing market regime...")
    regime = ai.analyze_market_regime()
    
    regime_text = f"""# Market Regime Update - {datetime.now().strftime('%Y-%m-%d')}

**Regime**: {regime['regime']}
**S&P 500**: ${regime.get('spy_price', 'N/A')} (200MA: ${regime.get('spy_200ma', 'N/A')})
**Above 200MA**: {regime.get('spy_above_200ma', False)}
**VIX**: {regime.get('vix', 'N/A')}
**Trend**: {regime.get('trend_strength', 'Unknown')}

**Trading Recommendation**: {regime['recommendation']}

**Reasoning**: {regime.get('reasoning', 'N/A')}
"""
    
    memory.save_market_context(regime_text)
    print(regime_text)
    
    # Check if we should trade today
    if TradingConfig.REQUIRE_SPY_ABOVE_200MA and not regime.get('spy_above_200ma', False):
        print("\n⚠️  S&P 500 below 200MA - SIDELINING per strategy")
        print("No trades will be executed today.")
        return
    
    print("\n✅ Market regime suitable for trading")
    print(f"Current portfolio: ${portfolio['total_value']:,.2f}")
    print(f"Cash available: ${portfolio['cash']:,.2f}")
    print(f"Active positions: {len(portfolio['positions'])}")
    
    print("\n🔍 Scanning for opportunities...")
    print("(In full implementation, this would scan market data)")
    print("For now, run the market_open_routine to analyze specific stocks")
    
    print("\n" + "=" * 60)
    print("✅ PRE-MARKET ROUTINE COMPLETE")


def market_open_routine():
    """
    8:30 AM - Execute planned trades at market open
    
    Tasks:
    1. Review pre-market plan
    2. Get latest prices
    3. Execute trades via Alpaca
    4. Set stop losses and take profits
    """
    print("🔔 MARKET OPEN ROUTINE STARTING")
    print("=" * 60)
    
    print("\n⚠️  NOTE: This is a PAPER TRADING system")
    print("All trades are simulated via Alpaca Paper Trading API")
    print("No real money at risk.")
    
    memory = MemoryManager()
    portfolio = memory.load_portfolio()
    
    print(f"\n📊 Portfolio Status:")
    print(f"Total Value: ${portfolio['total_value']:,.2f}")
    print(f"Cash: ${portfolio['cash']:,.2f}")
    print(f"Positions: {len(portfolio['positions'])}/{TradingConfig.MAX_POSITIONS}")
    
    # In full implementation, this would:
    # 1. Load watchlist from pre-market routine
    # 2. Get current prices via Alpaca
    # 3. Execute limit orders
    # 4. Set bracket orders (stop loss + take profit)
    
    print("\n💡 To execute trades:")
    print("1. Identify stock symbols to analyze")
    print("2. Run: analyze_stock('SYMBOL')")
    print("3. If recommended, execute via Alpaca API")
    
    print("\n" + "=" * 60)
    print("✅ MARKET OPEN ROUTINE COMPLETE")


def midday_check_routine():
    """
    12:00 PM - Risk management and position monitoring
    
    Tasks:
    1. Check all positions vs stop losses
    2. Cut losers hitting -7%
    3. Tighten stops on winners
    4. Monitor for break below 50MA
    """
    print("🕐 MIDDAY CHECK ROUTINE STARTING")
    print("=" * 60)
    
    memory = MemoryManager()
    portfolio = memory.load_portfolio()
    
    print(f"\n📊 Portfolio Health Check:")
    print(f"Total Value: ${portfolio['total_value']:,.2f}")
    
    positions = portfolio.get('positions', [])
    
    if not positions:
        print("\n✅ No active positions to monitor")
        print("\n" + "=" * 60)
        return
    
    print(f"\n🎯 Monitoring {len(positions)} positions:")
    
    for pos in positions:
        symbol = pos['symbol']
        entry = pos['entry_price']
        current = pos.get('current_price', entry)
        pnl_pct = ((current - entry) / entry) * 100
        
        print(f"\n{symbol}:")
        print(f"  Entry: ${entry:.2f}")
        print(f"  Current: ${current:.2f}")
        print(f"  P&L: {pnl_pct:+.2f}%")
        print(f"  Stop Loss: ${pos['stop_loss']:.2f}")
        
        # Check if stop hit
        if current <= pos['stop_loss']:
            print(f"  ⚠️  STOP LOSS HIT - WOULD EXIT")
        
        # Check if take profit hit
        elif current >= pos.get('take_profit', float('inf')):
            print(f"  🎯 TAKE PROFIT HIT - WOULD TAKE PARTIAL")
        
        else:
            print(f"  ✅ Position healthy")
    
    print("\n" + "=" * 60)
    print("✅ MIDDAY CHECK COMPLETE")


def market_close_routine():
    """
    3:00 PM - End of day logging and summary
    
    Tasks:
    1. Update all position prices
    2. Calculate daily P&L
    3. Log all trades
    4. Send summary notification
    """
    print("🌆 MARKET CLOSE ROUTINE STARTING")
    print("=" * 60)
    
    memory = MemoryManager()
    portfolio = memory.load_portfolio()
    
    print(f"\n📊 End of Day Summary:")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d')}")
    print(f"Total Value: ${portfolio['total_value']:,.2f}")
    print(f"Cash: ${portfolio['cash']:,.2f}")
    
    positions = portfolio.get('positions', [])
    print(f"Active Positions: {len(positions)}")
    
    if positions:
        total_pnl = 0
        for pos in positions:
            pnl = pos.get('pnl', 0)
            total_pnl += pnl
            print(f"  {pos['symbol']}: {pnl:+.2f}%")
        
        print(f"\nTotal Unrealized P&L: {total_pnl:+.2f}%")
    
    # In full implementation:
    # - Fetch final prices from Alpaca
    # - Calculate exact P&L
    # - Send notification via Slack/Email
    
    print("\n" + "=" * 60)
    print("✅ MARKET CLOSE ROUTINE COMPLETE")


def weekly_review_routine():
    """
    Friday 4:00 PM - Comprehensive performance analysis
    
    Tasks:
    1. Analyze all trades from the week
    2. Calculate performance metrics
    3. Compare to S&P 500 benchmark
    4. Extract lessons learned
    5. Update strategy if needed
    """
    print("📈 WEEKLY REVIEW ROUTINE STARTING")
    print("=" * 60)
    
    memory = MemoryManager()
    ai = TradingAI()
    
    # Load all data
    portfolio = memory.load_portfolio()
    lessons = memory.load_lessons()
    
    # Load trade log
    trade_log_path = memory.memory_dir / "trade_log.json"
    if trade_log_path.exists():
        trade_log = json.loads(trade_log_path.read_text())
    else:
        trade_log = []
    
    print(f"\n📊 Week in Review:")
    print(f"Trades executed: {len(trade_log)}")
    print(f"Current portfolio value: ${portfolio['total_value']:,.2f}")
    print(f"Starting value: ${portfolio.get('inception_value', 100000):,.2f}")
    
    # AI-powered review
    print("\n🤖 Running AI performance analysis...")
    review = ai.weekly_performance_review(portfolio, trade_log, lessons)
    
    print("\n" + review)
    
    # Save review as lesson
    memory.append_lesson(review)
    
    print("\n" + "=" * 60)
    print("✅ WEEKLY REVIEW COMPLETE")


def analyze_stock(symbol):
    """
    Manual stock analysis function
    Can be called from any routine
    """
    memory = MemoryManager()
    ai = TradingAI()
    
    strategy = memory.load_strategy()
    portfolio = memory.load_portfolio()
    lessons = memory.load_lessons()
    
    # In full implementation, fetch real data from Alpaca
    # For now, use placeholder
    stock_data = {
        'symbol': symbol,
        'price': 100.0,  # Would fetch from Alpaca
        'ma50': 95.0,
        'ma200': 85.0,
        'volume': 5000000,
        'avg_volume': 3000000
    }
    
    print(f"\n🤖 Analyzing {symbol}...")
    analysis = ai.analyze_opportunity(stock_data, strategy, portfolio, lessons)
    
    print(f"\n📊 Analysis Results:")
    print(json.dumps(analysis, indent=2))
    
    return analysis


# ============================================================================
# ROUTINE DISPATCHER
# ============================================================================

if __name__ == "__main__":
    import sys
    
    # Determine which routine to run based on argument
    # Claude Code Routines will pass the routine name
    
    routine = sys.argv[1] if len(sys.argv) > 1 else "help"
    
    routines = {
        'premarket': premarket_routine,
        'open': market_open_routine,
        'midday': midday_check_routine,
        'close': market_close_routine,
        'weekly': weekly_review_routine
    }
    
    if routine in routines:
        routines[routine]()
    else:
        print("AI Trading Agent - Available Routines:")
        print("  python trading_agent.py premarket  - 6:00 AM pre-market analysis")
        print("  python trading_agent.py open       - 8:30 AM market open execution")
        print("  python trading_agent.py midday     - 12:00 PM risk management")
        print("  python trading_agent.py close      - 3:00 PM end of day summary")
        print("  python trading_agent.py weekly     - Friday 4:00 PM weekly review")

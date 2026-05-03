# AI-Powered Automated Stock Trading System

**Complete implementation of the Golden Cross strategy enhanced with Claude AI**

Built for experienced traders ready to automate their paper trading workflow.

---

## 🎯 What You're Getting

A production-grade automated trading system that:

- ✅ Runs 24/7 in the cloud (no computer needed)
- ✅ Analyzes markets using Claude AI
- ✅ Executes trades via Alpaca Paper Trading
- ✅ Learns from every trade (persistent memory)
- ✅ Manages risk automatically
- ✅ Generates weekly performance reviews

**Zero real money at risk** - Paper trading only with $100K fake money.

---

## 📦 What's Included

### Core System Files

1. **trading_agent.py** - Main trading logic with 5 scheduled routines
   - Pre-market analysis (6:00 AM)
   - Market open execution (8:30 AM)
   - Midday risk check (12:00 PM)
   - Market close summary (3:00 PM)
   - Weekly review (Friday 4:00 PM)

2. **alpaca_client.py** - Alpaca API integration
   - Order execution
   - Position management
   - Market data retrieval
   - Golden cross scanning

3. **ai_trading_system.jsx** - Interactive dashboard
   - Visual portfolio tracker
   - AI-powered stock analysis
   - Paper trading interface
   - Learning center

### Documentation

4. **SETUP_GUIDE.md** - Complete step-by-step setup (30-45 min)
   - Account creation
   - API key configuration
   - Claude Code Routines setup
   - Testing and validation

5. **ROUTINE_PROMPTS.md** - Copy-paste prompts for all 5 routines
   - Exact prompts to use
   - Environment configuration
   - Troubleshooting guide

6. **README.md** - This file

---

## 🚀 Quick Start

### Prerequisites
- Claude Pro/Max/Team subscription ($20-100/month)
- 6+ years trading experience
- 30-45 minutes for setup

### Setup Steps

1. **Read SETUP_GUIDE.md** - Complete walkthrough
2. **Create Alpaca account** - Get paper trading API keys
3. **Create GitHub repo** - Host your code and memory
4. **Setup Claude Code Routines** - Configure 5 automated routines
5. **Test everything** - Verify before going live
6. **Monitor daily** - Watch it trade for you

**Detailed instructions in SETUP_GUIDE.md**

---

## 💡 How It Works

### The Strategy

**Golden Cross Momentum** + **AI Enhancement**

Entry criteria (ALL must be met):
1. ✅ 50MA crossed above 200MA (golden cross)
2. ✅ Price pulled back to 50MA support
3. ✅ Above-average volume (institutions buying)
4. ✅ Quality stock (>$1B market cap, >$10 price)
5. ✅ Strong fundamentals (>10% revenue growth)
6. ✅ Positive sentiment (news, analysts)
7. ✅ AI score ≥ 8.0/10 (Claude's analysis)

Risk management:
- 7% stop loss on every trade
- 12% take profit target
- Max 18% per position
- Max 2% risk per trade
- Max 10% total portfolio risk

Exit rules:
- Stop hit → exit immediately
- +10% profit → sell 25%, tighten stop
- +20% profit → sell 25% more, trail stop
- Break below 50MA → re-analyze

### The Memory Architecture

Unlike stateless AI, this system **learns and remembers**:

```
memory/
├── strategy.md          - Trading rules
├── portfolio.json       - Current positions
├── trade_log.json       - All historical trades
├── lessons_learned.md   - AI insights from experience
└── market_context.md    - Current market regime
```

Every routine:
1. Wakes up and reads memory files
2. Executes its scheduled task
3. Updates memory with new learnings
4. Commits to GitHub for persistence

**The AI gets smarter over time** by analyzing what works and what doesn't.

### The Daily Schedule

```
6:00 AM  │ 📊 Pre-Market Analysis
         │ - Check market regime (SPY vs 200MA)
         │ - Scan for golden cross setups
         │ - Plan trades for the day
         │
8:30 AM  │ 🔔 Market Open Execution
         │ - Execute planned trades
         │ - Set stop losses
         │ - Set take profits
         │
12:00 PM │ 🎯 Midday Risk Check
         │ - Monitor all positions
         │ - Cut losers at -7%
         │ - Tighten stops on winners
         │
3:00 PM  │ 🌆 Market Close Summary
         │ - Update final prices
         │ - Calculate daily P&L
         │ - Log performance
         │
Friday   │ 📈 Weekly Review
4:00 PM  │ - Analyze week's trades
         │ - Extract lessons
         │ - Update strategy
         │ - Compare to S&P 500
```

---

## 🛡️ Safety Features

### Hard-Coded Guardrails

- ❌ Can't exceed 18% per position
- ❌ Can't exceed 7 concurrent positions
- ❌ Must have 7% stop loss on every trade
- ❌ Can't risk more than 2% per trade
- ❌ Can't risk more than 10% of portfolio total
- ❌ Won't trade penny stocks (<$10, <$1B market cap)

### Market Filter

- Only trades when S&P 500 > 200MA (bullish regime)
- Sidelines during bear markets automatically
- Adapts position sizes based on market conditions

### AI Quality Gate

- Claude analyzes every opportunity across 10+ factors
- Must score ≥ 8.0/10 to execute
- Provides reasoning for every decision
- Flags risks and concerns

### Paper Trading

- **ZERO real money at risk**
- $100,000 fake money via Alpaca
- Real market prices and execution
- Full simulation of live trading

---

## 📊 Expected Performance

### Realistic Expectations

**Good Markets (trending up - 60% of time):**
- Win rate: 55-65%
- Average win: +12-15%
- Average loss: -6%
- Annual return: 15-30%

**Choppy Markets (sideways - 25% of time):**
- Win rate: 40-50%
- Many whipsaws
- Annual return: -5% to +5%

**Bear Markets (trending down - 15% of time):**
- System sidelines (SPY below 200MA)
- Capital preserved
- Minimal trading

**10-Year Blended:** ~12-18% annual return (if disciplined)

### Performance Targets

**Month 1:**
- Focus: Learning the system
- Target: Break-even to +3%
- Goal: Execute 5-10 trades

**Month 2:**
- Focus: Refining entries
- Target: +3-5%
- Goal: Win rate > 50%

**Month 3:**
- Focus: Consistency
- Target: +5-8%
- Goal: Beat S&P 500 (risk-adjusted)

**Only go live with real money after:**
- ✅ 3+ months consistent profitability
- ✅ Win rate > 55%
- ✅ Understand every trade
- ✅ Comfortable with max drawdown

---

## 🔧 Customization

### Adjust Risk Parameters

Edit `trading_agent.py`:

```python
class TradingConfig:
    MAX_POSITION_SIZE = 0.18  # 18% → adjust to your risk tolerance
    STOP_LOSS_PCT = 0.07      # 7% → tighter or wider
    TAKE_PROFIT_PCT = 0.12    # 12% → adjust target
    MIN_AI_SCORE = 8.0        # 8.0 → be more or less selective
```

### Change Schedule

Edit routines in Claude Code:
- Pre-market: 6:00 AM → Your preferred time
- Open: 8:30 AM → Adjust to your timezone
- Close: 3:00 PM → Match market hours

### Add Sectors/Filters

Edit AI prompts to focus on:
- Specific sectors (tech, healthcare, etc.)
- Market cap ranges
- Volatility preferences
- Fundamental criteria

### Add Notifications

Connect Slack or Gmail to routines:
- Real-time trade alerts
- Daily summaries
- Weekly reviews
- Risk warnings

---

## 📈 Monitoring & Maintenance

### Daily (5 minutes)

**Morning:**
- Check pre-market routine ran
- Review identified opportunities
- Verify market regime assessment

**Evening:**
- Check close routine completed
- Review daily P&L
- Note any interesting trades

### Weekly (30 minutes)

**Friday evening:**
- Read full weekly review
- Analyze lessons learned
- Adjust strategy if needed
- Plan for next week

### Monthly (1 hour)

**End of month:**
- Calculate monthly metrics
- Compare to benchmark
- Review max drawdown
- Assess strategy effectiveness

---

## ⚠️ Important Warnings

### This is NOT:

- ❌ A get-rich-quick scheme
- ❌ Guaranteed profits
- ❌ Set-and-forget passive income
- ❌ Replacement for financial education
- ❌ Suitable for trading novices

### This IS:

- ✅ A professional trading tool
- ✅ Educational platform to learn systematic trading
- ✅ Risk-managed approach to markets
- ✅ Automation of proven strategy
- ✅ Safe environment to test ideas (paper trading)

### Critical Rules:

1. **NEVER skip paper trading phase** - Minimum 3 months
2. **Start small if going live** - 10-20% of intended capital
3. **Follow risk limits religiously** - They exist for a reason
4. **Don't modify during losses** - Emotional changes usually worsen results
5. **Keep learning** - Markets change, adapt with them

---

## 🎓 Learning Resources

### Included Documentation

1. **SETUP_GUIDE.md** - Complete setup walkthrough
2. **ROUTINE_PROMPTS.md** - Copy-paste routine configurations
3. **ai_trading_system.jsx** - Interactive learning dashboard
4. **memory/lessons_learned.md** - Your AI's trading journal

### External Resources

**Trading Strategy:**
- Investopedia: Golden Cross
- Investopedia: Risk Management
- Your own 6 years of experience!

**Alpaca API:**
- https://alpaca.markets/docs
- https://alpaca.markets/docs/trading/paper-trading/

**Claude Code:**
- https://code.claude.com/docs
- https://code.claude.com/docs/en/routines

---

## 🆘 Support

### Common Issues

**Problem:** "Routine won't run"
**Solution:** Check SETUP_GUIDE.md troubleshooting section

**Problem:** "Can't connect to Alpaca"
**Solution:** Verify API keys in environment variables

**Problem:** "No trades executing"
**Solution:** Likely S&P 500 below 200MA or no setups found (normal!)

**Problem:** "Memory files not updating"
**Solution:** Enable "unrestricted branch pushes" on routines

### Getting Help

**For Alpaca issues:**
- support@alpaca.markets

**For Claude Code issues:**
- https://support.claude.com

**For strategy questions:**
- Review your `memory/lessons_learned.md`
- Analyze trade logs for patterns
- Test changes in paper account first

---

## 🎯 Next Steps

1. **Read SETUP_GUIDE.md** - Start here
2. **Create accounts** - Alpaca + GitHub
3. **Setup routines** - Follow ROUTINE_PROMPTS.md
4. **Test thoroughly** - Verify everything works
5. **Monitor daily** - First 2 weeks closely
6. **Learn continuously** - Read weekly reviews
7. **Stay patient** - 3 months minimum before live

---

## 📜 License & Disclaimer

**License:** MIT (use, modify, distribute freely)

**Disclaimer:**

This software is provided for educational purposes only. Trading stocks involves substantial risk of loss. Past performance does not guarantee future results. The authors and contributors are not financial advisors and accept no liability for your trading decisions or results.

By using this system, you acknowledge:
- You understand trading risks
- You will start with paper trading
- You will follow risk management rules
- You are responsible for your own decisions
- You will not risk money you can't afford to lose

**Always consult a financial advisor before trading with real money.**

---

## 🎉 You're Ready!

You have everything needed to build a professional automated trading system.

**Time investment:**
- Setup: 30-45 minutes
- Daily monitoring: 5 minutes
- Weekly review: 30 minutes

**Cost:**
- Alpaca: Free for paper trading
- Claude Pro: $20-100/month
- GitHub: Free

**Return:**
- Skills: Systematic trading approach
- Knowledge: AI-enhanced decision making
- Experience: 3+ months of automated trading data
- Potential: Foundation for live trading (if successful)

**Start with SETUP_GUIDE.md and build your future!**

---

**Questions?** Re-read the guides. Test in paper trading. Learn from the AI's analysis.

**Ready?** Let's automate your trading! 🚀

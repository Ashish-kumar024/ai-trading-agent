# Claude Code Routine Prompts - Quick Reference

Copy these prompts exactly when creating your routines in https://claude.ai/code/routines

---

## Routine 1: Pre-Market Analysis
**Schedule:** Weekdays, 6:00 AM

```
Run the pre-market trading routine.

Tasks:
1. Analyze market regime (check if S&P 500 is above 200MA)
2. Scan for golden cross opportunities
3. Plan potential trades for the day

Execute: python trading_agent.py premarket

Use web search to get current SPY price and 200-day moving average.

Save all updates to memory files and commit to git with message "Pre-market analysis [date]".
```

---

## Routine 2: Market Open Execution
**Schedule:** Weekdays, 8:30 AM (Central Time)

```
Run the market open trading routine.

Tasks:
1. Review pre-market plan
2. Execute planned trades via Alpaca API
3. Set stop losses and take profits

Execute: python trading_agent.py open

For each trade, use the Alpaca API to:
- Get current price
- Calculate position size based on risk (max 2% portfolio risk per trade)
- Place bracket order with stop loss and take profit

Only execute trades that:
- Have AI score >= 8.0
- Meet all entry criteria
- Stay within position limits (max 7 positions, max 18% per position)

Log all trades to memory/trade_log.json and commit to git.
```

---

## Routine 3: Midday Risk Check
**Schedule:** Weekdays, 12:00 PM

```
Run the midday risk management routine.

Tasks:
1. Check all positions vs stop losses
2. Exit positions hitting -7% stop
3. Tighten stops on winners
4. Monitor for breaks below 50MA

Execute: python trading_agent.py midday

Use Alpaca API to:
- Get current prices for all positions
- Check if any stops need tightening
- Execute exits if stop losses are hit
- Update position data in memory/portfolio.json

If any position breaks below 50MA, analyze whether to exit.

Commit updates to git with message "Midday check [date]".
```

---

## Routine 4: Market Close Summary
**Schedule:** Weekdays, 3:00 PM (Central Time)

```
Run the market close routine.

Tasks:
1. Update all position prices from Alpaca
2. Calculate daily P&L
3. Log performance
4. Generate end-of-day summary

Execute: python trading_agent.py close

Use Alpaca API to:
- Get final prices for all positions
- Calculate unrealized P&L
- Update memory/portfolio.json with current state

Generate summary including:
- Total portfolio value
- Daily P&L (dollars and percentage)
- Position status (healthy, at risk, etc.)
- Any notable market events

Commit all updates to git with message "EOD summary [date]".
```

---

## Routine 5: Weekly Performance Review
**Schedule:** Friday, 4:00 PM

```
Run the weekly review routine.

Tasks:
1. Analyze all trades from the week
2. Calculate performance metrics (win rate, avg win/loss, Sharpe ratio)
3. Compare to S&P 500 benchmark
4. Extract lessons learned
5. Update strategy based on what's working

Execute: python trading_agent.py weekly

Deep analysis required:
- Read all trades from memory/trade_log.json
- Calculate: win rate, average winner %, average loser %, max drawdown
- Use web search to get SPY performance for the week
- Compare our performance to benchmark

Generate comprehensive review including:
1. Performance Metrics
   - Total P&L this week
   - Win rate
   - Average win vs average loss
   - Risk-adjusted returns

2. What's Working
   - Patterns in winning trades
   - Best sectors/setups
   - Optimal entry timing

3. What's Not Working
   - Common mistakes
   - Losing patterns
   - Missed signals

4. New Lessons
   - Key takeaways from this week
   - Strategy adjustments needed
   - Risk management insights

5. Action Items
   - Strategy tweaks to implement
   - Watchlist for next week
   - Risk parameters to adjust

Save detailed analysis to memory/lessons_learned.md and commit with message "Weekly review [date]".

Use Claude AI reasoning capabilities to find non-obvious patterns and generate actionable insights.
```

---

## Environment Configuration

**Name:** Trading Production

**Network Access:** Restricted domains
```
api.alpaca.markets
paper-api.alpaca.markets
data.alpaca.markets
api.anthropic.com
```

**Environment Variables:**
```
ALPACA_API_KEY=PKxxxxxxxxxxxxxxxxxx
ALPACA_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Setup Script:**
```bash
pip install --break-system-packages anthropic requests python-dotenv
```

---

## Repository Settings

**For ALL routines:**
- Repository: `ai-trading-agent`
- Branch: `main`
- ✅ Enable "Allow unrestricted branch pushes"

---

## Connectors (Optional)

**Add these if you want notifications:**

- **Slack:** Get trade alerts and summaries in Slack
- **Gmail:** Receive daily/weekly reports via email
- **Linear:** Create tasks for trade reviews

To add:
1. Connect the service in Claude.ai settings
2. Include in routine configuration
3. Add notification steps to prompts

Example Slack notification in close routine:
```
After generating EOD summary, post to Slack channel #trading:
"📊 EOD Summary [Date]
Portfolio: $XXX,XXX
Daily P&L: +X.XX%
Active Positions: X/7
[brief highlights]"
```

---

## Testing Checklist

Before deploying:

**Pre-Market Routine:**
- [ ] Market regime detection works
- [ ] SPY 200MA check accurate
- [ ] Memory files update correctly
- [ ] Git commits successful

**Market Open Routine:**
- [ ] Alpaca connection established
- [ ] Position size calculation correct
- [ ] Bracket orders include stop/take profit
- [ ] Trade logs updated

**Midday Routine:**
- [ ] Current prices fetched
- [ ] Stop loss checks work
- [ ] Risk management triggers

**Close Routine:**
- [ ] Final prices accurate
- [ ] P&L calculations correct
- [ ] Daily summary generated

**Weekly Routine:**
- [ ] Historical analysis works
- [ ] Metrics calculated correctly
- [ ] Lessons extracted
- [ ] Strategy updates committed

---

## Troubleshooting Commands

**Check routine status:**
```bash
# View routine history
Visit: https://claude.ai/code/routines
Click on routine → See execution history
```

**Check memory state:**
```bash
# Clone and inspect
git clone https://github.com/YOUR_USERNAME/ai-trading-agent.git
cd ai-trading-agent
cat memory/portfolio.json
cat memory/lessons_learned.md
```

**Test Alpaca locally:**
```bash
export ALPACA_API_KEY="your_key"
export ALPACA_SECRET_KEY="your_secret"
python alpaca_client.py
```

**Manual trigger:**
```bash
# Run any routine manually for testing
Visit: https://claude.ai/code/routines
Click routine → Click "Run now"
Monitor execution in real-time
```

---

## Monitoring Dashboard

Create a simple monitoring routine (optional):

**Name:** Daily Health Check  
**Schedule:** Weekdays, 7:00 AM

**Prompt:**
```
Check system health and report status.

Tasks:
1. Verify all 5 routines ran successfully yesterday
2. Check for any errors in execution
3. Verify memory files are up to date
4. Confirm Alpaca connection working
5. Check portfolio value hasn't dropped > 2% (daily loss limit)

Generate health report with:
- ✅ All systems operational
- ⚠️ Any warnings
- ❌ Any critical issues

If critical issues found, alert immediately.
```

---

## Performance Targets

**After 1 Month:**
- Win rate: 45-55%
- Average win: 8-12%
- Average loss: 5-7%
- Max drawdown: < 10%

**After 3 Months:**
- Win rate: 55-65%
- Average win: 10-15%
- Average loss: 5-7%
- Max drawdown: < 15%
- Beating S&P 500 (risk-adjusted)

**If not meeting targets:**
- Review lessons learned
- Analyze losing patterns
- Adjust AI score threshold
- Tighten entry criteria
- Consider market regime issues

---

## Upgrade Path

**Phase 1:** Paper trading (3+ months)
**Phase 2:** Small real money ($5K)
**Phase 3:** Scale up gradually
**Phase 4:** Full portfolio allocation

**Never skip Phase 1!**

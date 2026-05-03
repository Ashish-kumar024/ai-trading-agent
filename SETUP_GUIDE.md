# AI Trading Agent - Complete Setup Guide

This guide will take you from zero to a fully automated paper trading system running 24/7 in the cloud.

**Time to complete:** 30-45 minutes  
**Cost:** $0 (all free for paper trading)  
**Risk:** Zero (paper trading only with fake money)

---

## Prerequisites

Before starting, make sure you have:

- ✅ Claude Pro, Max, Team, or Enterprise subscription (required for routines)
- ✅ GitHub account
- ✅ Basic command line familiarity
- ✅ 6 years trading experience (you have this!)

---

## Part 1: Account Setup (10 minutes)

### Step 1: Alpaca Paper Trading Account

1. Go to https://alpaca.markets
2. Click "Sign Up" → Choose "Individual Account"
3. Complete registration (name, email, password)
4. **Enable Paper Trading:**
   - Log in to your dashboard
   - Look for "Paper Trading" in the left sidebar
   - You'll get $100,000 in fake money automatically

5. **Generate API Keys:**
   - Go to "Paper Trading" section
   - Click "Generate New Key"
   - **SAVE THESE SOMEWHERE SAFE:**
     ```
     API Key: PKxxxxxxxxxxxxxxxxxx
     Secret Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - ⚠️ You can only see the secret once!

### Step 2: GitHub Repository

1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Repository settings:
   - Name: `ai-trading-agent`
   - Visibility: **Private** (important!)
   - Initialize with README: ✅ Yes
   - Click "Create repository"

4. **Generate Personal Access Token:**
   - Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Note: "AI Trading Agent"
   - Scopes: Check `repo` (full control)
   - Click "Generate token"
   - **SAVE THIS TOKEN:**
     ```
     ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```

5. **Install Claude GitHub App:**
   - Go to https://github.com/apps/claude-ai
   - Click "Configure"
   - Select your account
   - Under "Repository access", select "Only select repositories"
   - Choose `ai-trading-agent`
   - Click "Save"

---

## Part 2: Project Setup (10 minutes)

### Step 3: Clone and Setup Repository

Open your terminal and run:

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/ai-trading-agent.git
cd ai-trading-agent

# Create directory structure
mkdir -p memory
mkdir -p logs

# Initialize memory files
echo "# Trading Strategy" > memory/strategy.md
echo '{"cash": 100000.0, "positions": [], "total_value": 100000.0}' > memory/portfolio.json
echo "# Trading Lessons" > memory/lessons_learned.md
echo "[]" > memory/trade_log.json
echo "# Market Context" > memory/market_context.md

# Create .gitignore
cat > .gitignore << EOF
*.pyc
__pycache__/
.env
.DS_Store
logs/*.log
EOF

# Create requirements.txt
cat > requirements.txt << EOF
anthropic>=0.40.0
requests>=2.31.0
python-dotenv>=1.0.0
EOF

# Commit initial structure
git add .
git commit -m "Initial trading agent setup"
git push origin main
```

### Step 4: Add Your Code Files

Download the three main files I created:
1. `trading_agent.py` (main routine script)
2. `alpaca_client.py` (Alpaca API integration)
3. `README.md` (this file)

Place them in your `ai-trading-agent` directory.

```bash
# Commit the code
git add *.py README.md
git commit -m "Add trading agent code"
git push origin main
```

---

## Part 3: Claude Code Routines Setup (15 minutes)

### Step 5: Access Claude Code Routines

1. Go to https://claude.ai/code/routines
2. You should see the Routines dashboard
3. If you see "Upgrade required", make sure you have Pro/Max/Team subscription

### Step 6: Create Custom Environment

Before creating routines, set up the environment with your API keys:

1. Go to https://claude.ai/settings
2. Click "Environments" in the left sidebar
3. Click "Create Environment"
4. Settings:
   - Name: `Trading Production`
   - Network Access: `Restricted domains` → Add:
     - `api.alpaca.markets`
     - `paper-api.alpaca.markets`
     - `data.alpaca.markets`
     - `api.anthropic.com`
   - Environment Variables:
     ```
     ALPACA_API_KEY = PKxxxxxxxxxxxxxxxxxx
     ALPACA_SECRET_KEY = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
     (Get your Anthropic API key from https://console.anthropic.com)
   
   - Setup Script:
     ```bash
     pip install --break-system-packages anthropic requests python-dotenv
     ```

5. Click "Save"

### Step 7: Create the 5 Routines

Now create each routine. Click "New Routine" for each:

#### Routine 1: Pre-Market Analysis

- **Name:** `Pre-Market Analysis`
- **Prompt:**
  ```
  Run the pre-market trading routine.
  
  Tasks:
  1. Analyze market regime (check if S&P 500 is above 200MA)
  2. Scan for golden cross opportunities
  3. Plan potential trades for the day
  
  Execute: python trading_agent.py premarket
  
  Save all updates to memory files and commit to git.
  ```
- **Model:** Claude Sonnet 4
- **Repository:** Select `ai-trading-agent`
- **Environment:** Select `Trading Production`
- **Trigger:** Schedule
  - Type: Weekdays
  - Time: 6:00 AM (your timezone)
- **Connectors:** None needed (or add Slack if you want notifications)

#### Routine 2: Market Open Execution

- **Name:** `Market Open Execution`
- **Prompt:**
  ```
  Run the market open trading routine.
  
  Tasks:
  1. Review pre-market plan
  2. Execute planned trades via Alpaca API
  3. Set stop losses and take profits
  
  Execute: python trading_agent.py open
  
  For each trade, use the Alpaca API to:
  - Get current price
  - Calculate position size
  - Place bracket order with stop loss and take profit
  
  Log all trades and commit to git.
  ```
- **Model:** Claude Sonnet 4
- **Repository:** `ai-trading-agent`
- **Environment:** `Trading Production`
- **Trigger:** Schedule
  - Type: Weekdays
  - Time: 8:30 AM (market open Central Time)

#### Routine 3: Midday Risk Check

- **Name:** `Midday Risk Check`
- **Prompt:**
  ```
  Run the midday risk management routine.
  
  Tasks:
  1. Check all positions vs stop losses
  2. Exit positions hitting -7% stop
  3. Tighten stops on winners
  4. Monitor for breaks below 50MA
  
  Execute: python trading_agent.py midday
  
  Use Alpaca API to get current prices and execute exits if needed.
  
  Commit updates to git.
  ```
- **Model:** Claude Sonnet 4
- **Repository:** `ai-trading-agent`
- **Environment:** `Trading Production`
- **Trigger:** Schedule
  - Type: Weekdays
  - Time: 12:00 PM

#### Routine 4: Market Close Summary

- **Name:** `Market Close Summary`
- **Prompt:**
  ```
  Run the market close routine.
  
  Tasks:
  1. Update all position prices from Alpaca
  2. Calculate daily P&L
  3. Log performance
  4. Generate end-of-day summary
  
  Execute: python trading_agent.py close
  
  Commit all updates to git.
  ```
- **Model:** Claude Sonnet 4
- **Repository:** `ai-trading-agent`
- **Environment:** `Trading Production`
- **Trigger:** Schedule
  - Type: Weekdays
  - Time: 3:00 PM (market close Central Time)

#### Routine 5: Weekly Review

- **Name:** `Weekly Performance Review`
- **Prompt:**
  ```
  Run the weekly review routine.
  
  Tasks:
  1. Analyze all trades from the week
  2. Calculate performance metrics (win rate, avg win/loss, Sharpe ratio)
  3. Compare to S&P 500 benchmark
  4. Extract lessons learned
  5. Update strategy based on what's working
  
  Execute: python trading_agent.py weekly
  
  Use Claude AI to do deep analysis of patterns and generate actionable insights.
  
  Commit lessons and strategy updates to git.
  ```
- **Model:** Claude Sonnet 4
- **Repository:** `ai-trading-agent`
- **Environment:** `Trading Production`
- **Trigger:** Schedule
  - Type: Weekly
  - Day: Friday
  - Time: 4:00 PM

### Step 8: Enable Unrestricted Branch Pushes

For each routine:
1. Click on the routine
2. Click "Edit"
3. Scroll to "Repository Settings"
4. Enable "Allow unrestricted branch pushes"
5. Save

This allows the routines to commit memory updates back to GitHub.

---

## Part 4: Testing & Validation (5-10 minutes)

### Step 9: Manual Test Run

Before letting it run automatically, test manually:

1. Go to any routine
2. Click "Run now"
3. Watch the session execute
4. Check the logs for errors
5. Verify memory files were updated in GitHub

### Step 10: Verify Alpaca Connection

Test the Alpaca integration locally first:

```bash
# Set environment variables
export ALPACA_API_KEY="PKxxxxxxxxxxxxxxxxxx"
export ALPACA_SECRET_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Run the Alpaca test
python alpaca_client.py
```

You should see:
- Your account balance ($100,000)
- Current positions (probably empty)
- Golden cross analysis for AAPL

---

## Part 5: Monitoring & Maintenance

### Daily Monitoring (First 2 Weeks)

**Morning (6:15 AM):**
- Check pre-market routine ran successfully
- Review market regime analysis
- Look at identified opportunities

**After Market Close (3:15 PM):**
- Check close routine completed
- Review daily P&L
- Verify all positions are tracked correctly

**Weekly (Friday evening):**
- Read the full weekly review
- Check lessons learned
- Adjust strategy if needed

### Where to Check

**Routine Execution:**
- Go to https://claude.ai/code/routines
- Click on each routine to see history
- Check "Last Run" status

**Memory Files:**
- Go to your GitHub repo
- Check the `memory/` folder
- Review commit history to see updates

**Trading Activity:**
- Log in to Alpaca paper trading dashboard
- Review orders and positions
- Check P&L

---

## Understanding the System

### How It Works

```
┌─────────────────────────────────────────────────┐
│        Claude Code Routines (Cloud)             │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  6:00 AM     │  │  8:30 AM     │            │
│  │  Pre-Market  │→│  Market Open │            │
│  └──────────────┘  └──────────────┘            │
│         ↓                 ↓                      │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  12:00 PM    │  │  3:00 PM     │            │
│  │  Midday      │  │  Close       │            │
│  └──────────────┘  └──────────────┘            │
│         ↓                                        │
│  ┌──────────────┐                               │
│  │  Friday 4PM  │                               │
│  │  Weekly      │                               │
│  └──────────────┘                               │
└─────────────────────────────────────────────────┘
         ↓                    ↓
┌─────────────────┐  ┌─────────────────┐
│  GitHub Repo    │  │  Alpaca API     │
│  (Memory)       │  │  (Trading)      │
└─────────────────┘  └─────────────────┘
```

### Memory Architecture

The system uses files as memory to persist state:

- `memory/strategy.md` - Trading rules (rarely changes)
- `memory/portfolio.json` - Current positions (updates daily)
- `memory/trade_log.json` - All historical trades (append-only)
- `memory/lessons_learned.md` - AI learning (grows over time)
- `memory/market_context.md` - Market regime (updates daily)

Every routine:
1. Reads these files (wakes up with context)
2. Does its work
3. Updates relevant files
4. Commits to GitHub (persists learning)

### Safety Guardrails

The system has multiple safety layers:

**Hard-Coded Limits:**
- Max 18% per position
- Max 7 concurrent positions
- 7% stop loss on every trade
- 2% max daily loss
- 10% max portfolio risk

**Market Filter:**
- Only trades when S&P 500 > 200MA
- Sidelines during bear markets

**AI Quality Gate:**
- Claude must rate opportunity ≥ 8.0/10
- Analyzes fundamentals, technicals, sentiment
- Provides reasoning for every trade

**Paper Trading:**
- Zero real money at risk
- Full market simulation
- Real prices and execution

---

## Common Issues & Solutions

### "Routine failed to run"

**Check:**
1. Environment variables set correctly?
2. Repository permissions (unrestricted pushes enabled)?
3. Network access includes Alpaca domains?
4. Setup script ran successfully?

**Fix:**
- Edit routine → Check environment settings
- Re-run setup script
- Check Claude Code session logs

### "Can't connect to Alpaca"

**Check:**
1. API keys correct?
2. Using paper trading keys (PK prefix)?
3. Network access enabled for alpaca domains?

**Fix:**
```bash
# Test locally first
export ALPACA_API_KEY="your_key"
export ALPACA_SECRET_KEY="your_secret"
python alpaca_client.py
```

### "No trades executing"

**Possible reasons:**
1. S&P 500 below 200MA (system sidelined)
2. No golden cross setups found
3. AI score below 8.0
4. Max positions reached

**This is normal!** Quality over quantity. The system is designed to wait for great setups.

### "Memory files not updating"

**Check:**
1. Unrestricted branch pushes enabled?
2. Git commits in session logs?
3. GitHub app permissions?

**Fix:**
- Re-configure repository access
- Check GitHub app installation
- Review routine execution logs

---

## Next Steps

### Week 1-2: Learning Phase
- Monitor daily
- Read every analysis
- Understand why trades were taken/passed
- Verify all components working

### Week 3-4: Calibration
- Review lessons learned
- Adjust AI score threshold if needed
- Fine-tune position sizing
- Compare to benchmark

### Month 2-3: Validation
- Analyze monthly performance
- Calculate win rate, avg win/loss
- Check strategy vs S&P 500
- Decide if ready for real money

### Month 4+: Go Live (Maybe)

**Only proceed if:**
- ✅ Consistent profitability for 3+ months
- ✅ Win rate > 50%
- ✅ You understand every trade
- ✅ Comfortable with risk management
- ✅ Max drawdown acceptable

**When going live:**
1. Start with 10-20% of intended capital
2. Keep position sizes small
3. Require human approval for first month
4. Scale up gradually based on performance

---

## Resources

**Alpaca Documentation:**
- Paper Trading: https://alpaca.markets/docs/trading/paper-trading/
- API Reference: https://alpaca.markets/docs/api-references/trading-api/

**Claude Code:**
- Routines Guide: https://code.claude.com/docs/en/routines
- Best Practices: https://code.claude.com/docs/en/best-practices

**GitHub:**
- Personal Access Tokens: https://github.com/settings/tokens
- Claude App: https://github.com/apps/claude-ai

**Trading Strategy:**
- Golden Cross: https://www.investopedia.com/terms/g/goldencross.asp
- Risk Management: https://www.investopedia.com/articles/trading/09/risk-management.asp

---

## Support & Questions

**For Alpaca issues:**
- support@alpaca.markets
- https://alpaca.markets/support

**For Claude Code issues:**
- https://support.claude.com

**For strategy questions:**
- Review `memory/lessons_learned.md` - the AI learns with you
- Check trade logs for patterns
- Backtest changes before deploying

---

## Final Checklist

Before going live, confirm:

- [ ] Alpaca account created and API keys saved
- [ ] GitHub repository created and private
- [ ] Code files uploaded to repository
- [ ] Claude GitHub App installed
- [ ] Custom environment created with API keys
- [ ] All 5 routines created and scheduled
- [ ] Unrestricted branch pushes enabled
- [ ] Test run completed successfully
- [ ] Memory files updating in GitHub
- [ ] Alpaca connection verified
- [ ] Monitoring plan in place

---

**You're ready! The system will now run automatically 24/7.**

Check back tomorrow morning to see your first pre-market analysis.

Good luck, and remember: Paper trade for at least 3 months before considering real money!

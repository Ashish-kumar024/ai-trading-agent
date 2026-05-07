#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "Installing Python dependencies..."
pip install -r "$CLAUDE_PROJECT_DIR/requirements.txt" --quiet

echo "Verifying core module syntax..."
python3 -m py_compile "$CLAUDE_PROJECT_DIR/trading_agent.py"
python3 -m py_compile "$CLAUDE_PROJECT_DIR/alpaca_client.py"

echo "Session setup complete."

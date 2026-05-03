#!/usr/bin/env python3
"""
Alpaca API Integration for Paper Trading
Handles order execution, position management, and market data
"""

import os
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class AlpacaClient:
    """
    Alpaca Paper Trading API Client
    
    Setup:
    1. Sign up at https://alpaca.markets
    2. Enable paper trading
    3. Generate API keys
    4. Set environment variables:
       - ALPACA_API_KEY
       - ALPACA_SECRET_KEY
    """
    
    def __init__(self, api_key=None, secret_key=None, paper=True):
        self.api_key = api_key or os.environ.get('ALPACA_API_KEY')
        self.secret_key = secret_key or os.environ.get('ALPACA_SECRET_KEY')
        
        if not self.api_key or not self.secret_key:
            raise ValueError("Alpaca API keys not found. Set ALPACA_API_KEY and ALPACA_SECRET_KEY")
        
        # Use paper trading endpoint
        self.base_url = "https://paper-api.alpaca.markets" if paper else "https://api.alpaca.markets"
        self.data_url = "https://data.alpaca.markets"
        
        self.headers = {
            'APCA-API-KEY-ID': self.api_key,
            'APCA-API-SECRET-KEY': self.secret_key,
            'accept': 'application/json'
        }
    
    # ========================================================================
    # ACCOUNT MANAGEMENT
    # ========================================================================
    
    def get_account(self) -> Dict:
        """Get account information"""
        url = f"{self.base_url}/v2/account"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_portfolio_value(self) -> float:
        """Get total portfolio value"""
        account = self.get_account()
        return float(account['portfolio_value'])
    
    def get_cash(self) -> float:
        """Get available cash"""
        account = self.get_account()
        return float(account['cash'])
    
    def get_buying_power(self) -> float:
        """Get buying power"""
        account = self.get_account()
        return float(account['buying_power'])
    
    # ========================================================================
    # POSITIONS
    # ========================================================================
    
    def get_positions(self) -> List[Dict]:
        """Get all open positions"""
        url = f"{self.base_url}/v2/positions"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_position(self, symbol: str) -> Optional[Dict]:
        """Get position for specific symbol"""
        try:
            url = f"{self.base_url}/v2/positions/{symbol}"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                return None  # No position
            raise
    
    def close_position(self, symbol: str, qty: Optional[int] = None) -> Dict:
        """
        Close position (all or partial)
        
        Args:
            symbol: Stock symbol
            qty: Number of shares (None = close all)
        """
        url = f"{self.base_url}/v2/positions/{symbol}"
        
        params = {}
        if qty:
            params['qty'] = qty
        
        response = requests.delete(url, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()
    
    # ========================================================================
    # ORDERS
    # ========================================================================
    
    def place_order(
        self,
        symbol: str,
        qty: int,
        side: str,  # 'buy' or 'sell'
        order_type: str = 'market',
        limit_price: Optional[float] = None,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None,
        time_in_force: str = 'day'
    ) -> Dict:
        """
        Place order with optional bracket (stop loss + take profit)
        
        Args:
            symbol: Stock symbol
            qty: Number of shares
            side: 'buy' or 'sell'
            order_type: 'market' or 'limit'
            limit_price: Limit price (for limit orders)
            stop_loss: Stop loss price
            take_profit: Take profit price
            time_in_force: 'day', 'gtc', 'ioc', 'fok'
        
        Returns:
            Order details
        """
        url = f"{self.base_url}/v2/orders"
        
        order_data = {
            'symbol': symbol,
            'qty': qty,
            'side': side,
            'type': order_type,
            'time_in_force': time_in_force
        }
        
        if limit_price:
            order_data['limit_price'] = limit_price
        
        # Add bracket orders (stop loss + take profit)
        if stop_loss or take_profit:
            order_data['order_class'] = 'bracket'
            
            if stop_loss:
                order_data['stop_loss'] = {
                    'stop_price': stop_loss
                }
            
            if take_profit:
                order_data['take_profit'] = {
                    'limit_price': take_profit
                }
        
        response = requests.post(url, headers=self.headers, json=order_data)
        response.raise_for_status()
        return response.json()
    
    def get_orders(self, status: str = 'open') -> List[Dict]:
        """
        Get orders by status
        
        Args:
            status: 'open', 'closed', 'all'
        """
        url = f"{self.base_url}/v2/orders"
        params = {'status': status}
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()
    
    def cancel_order(self, order_id: str) -> None:
        """Cancel an order"""
        url = f"{self.base_url}/v2/orders/{order_id}"
        response = requests.delete(url, headers=self.headers)
        response.raise_for_status()
    
    def cancel_all_orders(self) -> List[Dict]:
        """Cancel all open orders"""
        url = f"{self.base_url}/v2/orders"
        response = requests.delete(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    # ========================================================================
    # MARKET DATA
    # ========================================================================
    
    def get_quote(self, symbol: str) -> Dict:
        """Get latest quote for symbol"""
        url = f"{self.data_url}/v2/stocks/{symbol}/quotes/latest"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        data = response.json()
        return data['quote']
    
    def get_price(self, symbol: str) -> float:
        """Get current price (midpoint of bid/ask)"""
        quote = self.get_quote(symbol)
        bid = float(quote['bp'])
        ask = float(quote['ap'])
        return (bid + ask) / 2
    
    def get_bars(
        self,
        symbol: str,
        timeframe: str = '1Day',
        start: Optional[str] = None,
        end: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict]:
        """
        Get historical bars
        
        Args:
            symbol: Stock symbol
            timeframe: '1Min', '5Min', '15Min', '1Hour', '1Day'
            start: Start date (YYYY-MM-DD)
            end: End date (YYYY-MM-DD)
            limit: Max number of bars
        """
        url = f"{self.data_url}/v2/stocks/{symbol}/bars"
        
        params = {
            'timeframe': timeframe,
            'limit': limit
        }
        
        if start:
            params['start'] = start
        if end:
            params['end'] = end
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get('bars', [])
    
    def calculate_moving_average(self, symbol: str, period: int = 50) -> float:
        """
        Calculate moving average
        
        Args:
            symbol: Stock symbol
            period: Number of days (50 or 200 typical)
        """
        # Get bars for period + 10 buffer
        bars = self.get_bars(symbol, timeframe='1Day', limit=period + 10)
        
        if len(bars) < period:
            raise ValueError(f"Insufficient data to calculate {period}-day MA")
        
        # Get closing prices
        closes = [float(bar['c']) for bar in bars[-period:]]
        
        # Calculate average
        ma = sum(closes) / len(closes)
        return round(ma, 2)
    
    def check_golden_cross(self, symbol: str) -> Dict:
        """
        Check if stock has golden cross (50MA > 200MA)
        
        Returns:
            {
                'has_golden_cross': bool,
                'ma50': float,
                'ma200': float,
                'current_price': float,
                'distance_to_ma50': float
            }
        """
        try:
            ma50 = self.calculate_moving_average(symbol, 50)
            ma200 = self.calculate_moving_average(symbol, 200)
            current_price = self.get_price(symbol)
            
            return {
                'has_golden_cross': ma50 > ma200,
                'ma50': ma50,
                'ma200': ma200,
                'current_price': current_price,
                'distance_to_ma50': ((current_price - ma50) / ma50) * 100
            }
        except Exception as e:
            return {
                'error': str(e),
                'has_golden_cross': False
            }
    
    # ========================================================================
    # SCANNER
    # ========================================================================
    
    def scan_for_golden_cross(self, symbols: List[str]) -> List[Dict]:
        """
        Scan list of symbols for golden cross setups
        
        Args:
            symbols: List of stock symbols to scan
        
        Returns:
            List of stocks with golden cross setups
        """
        results = []
        
        for symbol in symbols:
            try:
                print(f"Scanning {symbol}...")
                analysis = self.check_golden_cross(symbol)
                
                if analysis.get('has_golden_cross'):
                    # Check if near 50MA (pullback opportunity)
                    distance = abs(analysis['distance_to_ma50'])
                    
                    if distance <= 5:  # Within 5% of 50MA
                        results.append({
                            'symbol': symbol,
                            **analysis,
                            'signal': 'PULLBACK_OPPORTUNITY'
                        })
                    else:
                        results.append({
                            'symbol': symbol,
                            **analysis,
                            'signal': 'GOLDEN_CROSS'
                        })
            
            except Exception as e:
                print(f"Error scanning {symbol}: {e}")
                continue
        
        return results
    
    # ========================================================================
    # TRADING HELPERS
    # ========================================================================
    
    def calculate_position_size(
        self,
        symbol: str,
        entry_price: float,
        stop_loss: float,
        risk_per_trade: float = 0.02,  # 2% risk
        max_position_pct: float = 0.18  # 18% max position
    ) -> int:
        """
        Calculate position size based on risk
        
        Args:
            symbol: Stock symbol
            entry_price: Intended entry price
            stop_loss: Stop loss price
            risk_per_trade: % of portfolio to risk (0.02 = 2%)
            max_position_pct: Max % of portfolio per position (0.18 = 18%)
        
        Returns:
            Number of shares to buy
        """
        portfolio_value = self.get_portfolio_value()
        
        # Calculate risk per share
        risk_per_share = entry_price - stop_loss
        
        if risk_per_share <= 0:
            raise ValueError("Stop loss must be below entry price")
        
        # Calculate shares based on risk
        risk_amount = portfolio_value * risk_per_trade
        shares_by_risk = int(risk_amount / risk_per_share)
        
        # Calculate shares based on max position size
        max_position_value = portfolio_value * max_position_pct
        shares_by_max = int(max_position_value / entry_price)
        
        # Use the smaller of the two
        shares = min(shares_by_risk, shares_by_max)
        
        return shares
    
    def execute_golden_cross_trade(
        self,
        symbol: str,
        entry_price: float,
        stop_loss_pct: float = 0.07,  # 7%
        take_profit_pct: float = 0.12  # 12%
    ) -> Dict:
        """
        Execute a golden cross trade with risk management
        
        Args:
            symbol: Stock symbol
            entry_price: Entry price
            stop_loss_pct: Stop loss percentage (0.07 = 7%)
            take_profit_pct: Take profit percentage (0.12 = 12%)
        
        Returns:
            Order details
        """
        # Calculate prices
        stop_loss = entry_price * (1 - stop_loss_pct)
        take_profit = entry_price * (1 + take_profit_pct)
        
        # Calculate position size
        shares = self.calculate_position_size(symbol, entry_price, stop_loss)
        
        if shares <= 0:
            raise ValueError("Calculated 0 shares - check portfolio value and risk parameters")
        
        print(f"\n📊 Executing Trade:")
        print(f"Symbol: {symbol}")
        print(f"Shares: {shares}")
        print(f"Entry: ${entry_price:.2f}")
        print(f"Stop Loss: ${stop_loss:.2f} (-{stop_loss_pct*100}%)")
        print(f"Take Profit: ${take_profit:.2f} (+{take_profit_pct*100}%)")
        print(f"Position Value: ${shares * entry_price:,.2f}")
        
        # Place bracket order
        order = self.place_order(
            symbol=symbol,
            qty=shares,
            side='buy',
            order_type='limit',
            limit_price=entry_price,
            stop_loss=stop_loss,
            take_profit=take_profit,
            time_in_force='gtc'  # Good til canceled
        )
        
        print(f"\n✅ Order placed: {order['id']}")
        print(f"Status: {order['status']}")
        
        return order


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

if __name__ == "__main__":
    """
    Example usage of Alpaca client
    
    Before running:
    1. Sign up at https://alpaca.markets
    2. Enable paper trading
    3. Set environment variables:
       export ALPACA_API_KEY="your_key"
       export ALPACA_SECRET_KEY="your_secret"
    """
    
    try:
        # Initialize client
        client = AlpacaClient(paper=True)
        
        # Get account info
        print("=" * 60)
        print("ACCOUNT INFORMATION")
        print("=" * 60)
        account = client.get_account()
        print(f"Portfolio Value: ${float(account['portfolio_value']):,.2f}")
        print(f"Cash: ${float(account['cash']):,.2f}")
        print(f"Buying Power: ${float(account['buying_power']):,.2f}")
        
        # Get positions
        print("\n" + "=" * 60)
        print("CURRENT POSITIONS")
        print("=" * 60)
        positions = client.get_positions()
        
        if positions:
            for pos in positions:
                pnl = float(pos['unrealized_pl'])
                pnl_pct = float(pos['unrealized_plpc']) * 100
                print(f"\n{pos['symbol']}:")
                print(f"  Shares: {pos['qty']}")
                print(f"  Entry: ${float(pos['avg_entry_price']):.2f}")
                print(f"  Current: ${float(pos['current_price']):.2f}")
                print(f"  P&L: ${pnl:,.2f} ({pnl_pct:+.2f}%)")
        else:
            print("No open positions")
        
        # Example: Check for golden cross
        print("\n" + "=" * 60)
        print("GOLDEN CROSS CHECK - AAPL")
        print("=" * 60)
        
        analysis = client.check_golden_cross('AAPL')
        print(f"Current Price: ${analysis['current_price']:.2f}")
        print(f"50-day MA: ${analysis['ma50']:.2f}")
        print(f"200-day MA: ${analysis['ma200']:.2f}")
        print(f"Golden Cross: {analysis['has_golden_cross']}")
        print(f"Distance to 50MA: {analysis['distance_to_ma50']:.2f}%")
        
        # Example: Scan multiple stocks
        print("\n" + "=" * 60)
        print("SCANNING FOR OPPORTUNITIES")
        print("=" * 60)
        
        watchlist = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META']
        results = client.scan_for_golden_cross(watchlist)
        
        if results:
            print(f"\nFound {len(results)} opportunities:")
            for stock in results:
                print(f"\n{stock['symbol']} - {stock['signal']}")
                print(f"  Price: ${stock['current_price']:.2f}")
                print(f"  50MA: ${stock['ma50']:.2f}")
                print(f"  200MA: ${stock['ma200']:.2f}")
        else:
            print("\nNo golden cross setups found")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure you have:")
        print("1. Signed up at https://alpaca.markets")
        print("2. Enabled paper trading")
        print("3. Set environment variables:")
        print("   export ALPACA_API_KEY='your_key'")
        print("   export ALPACA_SECRET_KEY='your_secret'")

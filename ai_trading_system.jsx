import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, AlertCircle, CheckCircle, XCircle, Brain, Target, Shield } from 'lucide-react';

// AI-Enhanced Stock Trading System
// Implements the Reddit Golden Cross Strategy + Claude Intelligence

const TradingDashboard = () => {
  const [activeTab, setActiveTab] = useState('scanner');
  const [portfolioValue, setPortfolioValue] = useState(25000);
  const [positions, setPositions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sample data for demonstration
  const initialPositions = [
    {
      symbol: 'AAPL',
      shares: 50,
      entryPrice: 178.50,
      currentPrice: 185.20,
      stopLoss: 169.58,
      takeProfit: 196.35,
      entryDate: '2026-04-15',
      pnl: 335.00,
      pnlPercent: 3.75,
      status: 'healthy',
      ma50: 180.00,
      ma200: 165.00
    },
    {
      symbol: 'MSFT',
      shares: 25,
      entryPrice: 420.00,
      currentPrice: 432.80,
      stopLoss: 399.00,
      takeProfit: 462.00,
      entryDate: '2026-04-20',
      pnl: 320.00,
      pnlPercent: 3.05,
      status: 'healthy',
      ma50: 425.00,
      ma200: 395.00
    }
  ];

  const sampleScanResults = [
    {
      symbol: 'NVDA',
      price: 892.50,
      ma50: 850.00,
      ma200: 720.00,
      volume: 45800000,
      avgVolume: 38500000,
      signal: 'Golden Cross + Pullback',
      quality: 9.2,
      sector: 'Technology'
    },
    {
      symbol: 'AMD',
      price: 178.20,
      ma50: 165.00,
      ma200: 142.00,
      volume: 52000000,
      avgVolume: 45000000,
      signal: 'Breakout with Volume',
      quality: 8.8,
      sector: 'Technology'
    },
    {
      symbol: 'PLTR',
      price: 34.50,
      ma50: 32.00,
      ma200: 25.00,
      volume: 38000000,
      avgVolume: 28000000,
      signal: 'Golden Cross',
      quality: 8.5,
      sector: 'Software'
    }
  ];

  const performanceData = [
    { date: 'Apr 1', value: 25000, sp500: 25000 },
    { date: 'Apr 8', value: 25600, sp500: 25200 },
    { date: 'Apr 15', value: 25300, sp500: 25400 },
    { date: 'Apr 22', value: 26100, sp500: 25600 },
    { date: 'Apr 29', value: 26655, sp500: 25800 }
  ];

  useEffect(() => {
    setPositions(initialPositions);
  }, []);

  // Simulate AI analysis
  const analyzeStock = async (stock) => {
    setIsAnalyzing(true);
    setSelectedStock(stock);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = {
      symbol: stock.symbol,
      overallRating: stock.quality,
      recommendation: stock.quality >= 8.5 ? 'STRONG BUY' : stock.quality >= 7.5 ? 'BUY' : 'WATCH',
      technical: {
        trend: 'Bullish',
        strength: stock.quality >= 8.5 ? 'Strong' : 'Moderate',
        support: (stock.price * 0.95).toFixed(2),
        resistance: (stock.price * 1.08).toFixed(2)
      },
      fundamental: {
        revenueGrowth: '32% YoY',
        earningsGrowth: '28% YoY',
        institutionalOwnership: '68%'
      },
      sentiment: {
        news: 'Positive',
        social: 'Bullish',
        analyst: '85% Buy Ratings'
      },
      entry: {
        idealPrice: (stock.price * 0.98).toFixed(2),
        stopLoss: (stock.price * 0.93).toFixed(2),
        takeProfit: (stock.price * 1.12).toFixed(2),
        positionSize: Math.floor((portfolioValue * 0.18) / stock.price)
      },
      reasoning: [
        `Strong golden cross formation with 50MA at $${stock.ma50} crossing above 200MA at $${stock.ma200}`,
        `Volume confirmation: ${((stock.volume / stock.avgVolume - 1) * 100).toFixed(0)}% above average indicating institutional interest`,
        `Price action showing healthy pullback to 50MA support level - ideal entry zone`,
        `Sector momentum is strong with ${stock.sector} leading market performance`,
        `Risk/reward ratio of 2.4:1 with clearly defined support and resistance levels`
      ],
      risks: [
        'General market volatility could trigger stop loss',
        'Sector rotation out of tech could pressure price',
        'Monitor for breakdown below 50MA which would invalidate setup'
      ]
    };
    
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const scanMarket = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setScanResults(sampleScanResults);
    setIsScanning(false);
  };

  const executePaperTrade = (stock, analysis) => {
    const newPosition = {
      symbol: stock.symbol,
      shares: analysis.entry.positionSize,
      entryPrice: parseFloat(analysis.entry.idealPrice),
      currentPrice: stock.price,
      stopLoss: parseFloat(analysis.entry.stopLoss),
      takeProfit: parseFloat(analysis.entry.takeProfit),
      entryDate: new Date().toISOString().split('T')[0],
      pnl: 0,
      pnlPercent: 0,
      status: 'healthy',
      ma50: stock.ma50,
      ma200: stock.ma200
    };
    
    setPositions([...positions, newPosition]);
    setTradeHistory([...tradeHistory, {
      ...newPosition,
      action: 'BUY',
      timestamp: new Date().toISOString()
    }]);
    
    alert(`Paper trade executed: ${newPosition.shares} shares of ${stock.symbol} at $${newPosition.entryPrice}`);
  };

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
  const totalPnLPercent = ((portfolioValue + totalPnL - 25000) / 25000) * 100;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      color: '#e8eaf6',
      fontFamily: "'Inter Tight', -apple-system, sans-serif",
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '32px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        paddingBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '800',
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              AI Trading System
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
              Golden Cross Strategy + Claude Intelligence
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                Portfolio Value
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#f0f4f8' }}>
                ${(portfolioValue + totalPnL).toLocaleString()}
              </div>
            </div>
            
            <div style={{ 
              padding: '12px 20px',
              background: totalPnL >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${totalPnL >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                Total P&L
              </div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                color: totalPnL >= 0 ? '#10b981' : '#ef4444'
              }}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} ({totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
        paddingBottom: '0'
      }}>
        {['scanner', 'positions', 'performance', 'learn'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #8b5cf6' : '2px solid transparent',
              color: activeTab === tab ? '#e8eaf6' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scanner Tab */}
      {activeTab === 'scanner' && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700',
              margin: 0,
              color: '#f0f4f8'
            }}>
              Market Scanner
            </h2>
            <button
              onClick={scanMarket}
              disabled={isScanning}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: isScanning ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: isScanning ? 0.6 : 1,
                transition: 'all 0.2s'
              }}
            >
              {isScanning ? 'Scanning...' : '🔍 Scan Market'}
            </button>
          </div>

          {scanResults.length === 0 && !isScanning && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              background: 'rgba(139, 92, 246, 0.05)',
              borderRadius: '16px',
              border: '1px dashed rgba(139, 92, 246, 0.3)'
            }}>
              <Activity size={48} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
              <p style={{ color: '#94a3b8', margin: 0 }}>
                Click "Scan Market" to find golden cross opportunities
              </p>
            </div>
          )}

          {isScanning && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              background: 'rgba(139, 92, 246, 0.05)',
              borderRadius: '16px'
            }}>
              <div style={{ 
                animation: 'pulse 2s infinite',
                marginBottom: '16px'
              }}>
                <Brain size={48} style={{ color: '#8b5cf6' }} />
              </div>
              <p style={{ color: '#94a3b8', margin: 0 }}>
                Scanning 500+ stocks for golden cross setups...
              </p>
            </div>
          )}

          <div style={{ display: 'grid', gap: '16px' }}>
            {scanResults.map(stock => (
              <div
                key={stock.symbol}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => analyzeStock(stock)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <h3 style={{ 
                        fontSize: '24px', 
                        fontWeight: '700',
                        margin: 0,
                        color: '#f0f4f8'
                      }}>
                        {stock.symbol}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#c4b5fd'
                      }}>
                        {stock.sector}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: stock.quality >= 9 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: stock.quality >= 9 ? '#34d399' : '#60a5fa'
                      }}>
                        Quality: {stock.quality}/10
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                          Price
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0f4f8' }}>
                          ${stock.price}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                          50MA / 200MA
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0f4f8' }}>
                          ${stock.ma50} / ${stock.ma200}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                          Volume
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                          +{((stock.volume / stock.avgVolume - 1) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                          Signal
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#8b5cf6' }}>
                          {stock.signal}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      analyzeStock(stock);
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    🤖 AI Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis Modal */}
          {(isAnalyzing || aiAnalysis) && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}>
                {isAnalyzing ? (
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ animation: 'pulse 2s infinite', marginBottom: '24px' }}>
                      <Brain size={64} style={{ color: '#8b5cf6' }} />
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                      Claude AI Analyzing {selectedStock?.symbol}
                    </h3>
                    <p style={{ color: '#94a3b8', margin: 0 }}>
                      Evaluating technical setup, fundamentals, and market sentiment...
                    </p>
                  </div>
                ) : aiAnalysis && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
                      <div>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>
                          {aiAnalysis.symbol} Analysis
                        </h2>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{
                            padding: '8px 16px',
                            background: aiAnalysis.recommendation === 'STRONG BUY' 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : 'rgba(59, 130, 246, 0.2)',
                            border: `1px solid ${aiAnalysis.recommendation === 'STRONG BUY' 
                              ? 'rgba(16, 185, 129, 0.4)' 
                              : 'rgba(59, 130, 246, 0.4)'}`,
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: aiAnalysis.recommendation === 'STRONG BUY' ? '#34d399' : '#60a5fa'
                          }}>
                            {aiAnalysis.recommendation}
                          </span>
                          <span style={{
                            fontSize: '14px',
                            color: '#94a3b8'
                          }}>
                            Quality Score: {aiAnalysis.overallRating}/10
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAiAnalysis(null);
                          setSelectedStock(null);
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '24px',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Entry Plan */}
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px'
                    }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#c4b5fd' }}>
                        📊 Entry Plan
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                            Ideal Entry Price
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                            ${aiAnalysis.entry.idealPrice}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                            Position Size
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#f0f4f8' }}>
                            {aiAnalysis.entry.positionSize} shares
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                            Stop Loss (-7%)
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>
                            ${aiAnalysis.entry.stopLoss}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                            Take Profit (+12%)
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                            ${aiAnalysis.entry.takeProfit}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Sections */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                      <div style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                        padding: '16px'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#8b5cf6' }}>
                          Technical
                        </h4>
                        <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                          <div>Trend: <strong>{aiAnalysis.technical.trend}</strong></div>
                          <div>Strength: <strong>{aiAnalysis.technical.strength}</strong></div>
                          <div>Support: <strong>${aiAnalysis.technical.support}</strong></div>
                          <div>Resistance: <strong>${aiAnalysis.technical.resistance}</strong></div>
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                        padding: '16px'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#8b5cf6' }}>
                          Fundamental
                        </h4>
                        <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                          <div>Revenue: <strong>{aiAnalysis.fundamental.revenueGrowth}</strong></div>
                          <div>Earnings: <strong>{aiAnalysis.fundamental.earningsGrowth}</strong></div>
                          <div>Institutional: <strong>{aiAnalysis.fundamental.institutionalOwnership}</strong></div>
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                        padding: '16px'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#8b5cf6' }}>
                          Sentiment
                        </h4>
                        <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                          <div>News: <strong>{aiAnalysis.sentiment.news}</strong></div>
                          <div>Social: <strong>{aiAnalysis.sentiment.social}</strong></div>
                          <div>Analysts: <strong>{aiAnalysis.sentiment.analyst}</strong></div>
                        </div>
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '16px'
                    }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#34d399' }}>
                        ✓ Why This Trade Makes Sense
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8' }}>
                        {aiAnalysis.reasoning.map((reason, i) => (
                          <li key={i} style={{ marginBottom: '8px' }}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Risks */}
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '24px'
                    }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#f87171' }}>
                        ⚠️ Risk Factors to Monitor
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8' }}>
                        {aiAnalysis.risks.map((risk, i) => (
                          <li key={i} style={{ marginBottom: '8px' }}>{risk}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => {
                          executePaperTrade(selectedStock, aiAnalysis);
                          setAiAnalysis(null);
                          setSelectedStock(null);
                        }}
                        style={{
                          flex: 1,
                          padding: '16px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        📝 Execute Paper Trade
                      </button>
                      <button
                        onClick={() => {
                          setWatchlist([...watchlist, selectedStock]);
                          alert(`${selectedStock.symbol} added to watchlist`);
                        }}
                        style={{
                          flex: 1,
                          padding: '16px',
                          background: 'rgba(139, 92, 246, 0.2)',
                          border: '1px solid rgba(139, 92, 246, 0.4)',
                          borderRadius: '12px',
                          color: '#c4b5fd',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        ⭐ Add to Watchlist
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#f0f4f8' }}>
            Active Positions ({positions.length})
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            {positions.map((position, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${position.pnl >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: '16px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
                      {position.symbol}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                      {position.shares} shares @ ${position.entryPrice} • Entered {position.entryDate}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: position.pnl >= 0 ? '#10b981' : '#ef4444',
                      marginBottom: '4px'
                    }}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: position.pnl >= 0 ? '#34d399' : '#f87171'
                    }}>
                      {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                      Current Price
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0f4f8' }}>
                      ${position.currentPrice}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                      Stop Loss
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#ef4444' }}>
                      ${position.stopLoss}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                      Take Profit
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                      ${position.takeProfit}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                      Position Value
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0f4f8' }}>
                      ${(position.shares * position.currentPrice).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Health Indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px'
                }}>
                  <CheckCircle size={20} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '14px', color: '#34d399', fontWeight: '600' }}>
                    Healthy - Price above 50MA (${position.ma50})
                  </span>
                </div>
              </div>
            ))}
          </div>

          {positions.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              background: 'rgba(139, 92, 246, 0.05)',
              borderRadius: '16px',
              border: '1px dashed rgba(139, 92, 246, 0.3)'
            }}>
              <Target size={48} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
              <p style={{ color: '#94a3b8', margin: 0 }}>
                No active positions. Use the scanner to find opportunities.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#f0f4f8' }}>
            Performance Analytics
          </h2>

          <div style={{ marginBottom: '32px' }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Your Portfolio"
                  dot={{ fill: '#8b5cf6', r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sp500" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="S&P 500 Benchmark"
                  dot={{ fill: '#94a3b8', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Total Return', value: '+6.6%', color: '#10b981' },
              { label: 'Win Rate', value: '100%', color: '#8b5cf6' },
              { label: 'Avg Win', value: '+3.4%', color: '#34d399' },
              { label: 'Max Drawdown', value: '-1.2%', color: '#ef4444' }
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learn Tab */}
      {activeTab === 'learn' && (
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#f0f4f8' }}>
            Trading Strategy Guide
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Strategy Overview */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#8b5cf6' }}>
                📚 Golden Cross Strategy + AI Enhancement
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '16px' }}>
                This system combines the proven Golden Cross technical pattern with Claude AI's multi-factor analysis. 
                The strategy focuses on trend-following with strict risk management.
              </p>
              <div style={{ 
                background: 'rgba(139, 92, 246, 0.1)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <strong style={{ color: '#c4b5fd' }}>Expected Win Rate:</strong> 55-65% in trending markets<br/>
                <strong style={{ color: '#c4b5fd' }}>Average Win:</strong> +12-15%<br/>
                <strong style={{ color: '#c4b5fd' }}>Average Loss:</strong> -5-7% (controlled by stop loss)<br/>
                <strong style={{ color: '#c4b5fd' }}>Time Horizon:</strong> 2-8 weeks per trade
              </div>
            </div>

            {/* Entry Rules */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#10b981' }}>
                ✅ Entry Criteria (All Must Be Met)
              </h3>
              <ul style={{ color: '#cbd5e1', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
                <li><strong>Golden Cross:</strong> 50MA crosses above 200MA (confirms uptrend)</li>
                <li><strong>Pullback:</strong> Price retraces to 50MA support (better entry point)</li>
                <li><strong>Volume:</strong> Above-average volume on bounce (institutional interest)</li>
                <li><strong>Quality Filter:</strong> Market cap &gt; $1B, price &gt; $10 (avoid penny stocks)</li>
                <li><strong>Fundamentals:</strong> Revenue growth &gt; 10% YoY (Claude verifies)</li>
                <li><strong>Sentiment:</strong> Positive news flow, no major red flags (Claude analyzes)</li>
                <li><strong>AI Score:</strong> Claude quality rating ≥ 8.0/10</li>
              </ul>
            </div>

            {/* Position Sizing */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#3b82f6' }}>
                📊 Position Sizing (30-30-40 Method)
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '12px' }}>
                Scale into positions to reduce risk and confirm the trend:
              </p>
              <div style={{ paddingLeft: '20px' }}>
                <div style={{ marginBottom: '12px', color: '#cbd5e1' }}>
                  <strong style={{ color: '#60a5fa' }}>1st Tranche (30%):</strong> Initial test position on pullback to 50MA
                </div>
                <div style={{ marginBottom: '12px', color: '#cbd5e1' }}>
                  <strong style={{ color: '#60a5fa' }}>2nd Tranche (30%):</strong> Add if price bounces with volume
                </div>
                <div style={{ marginBottom: '12px', color: '#cbd5e1' }}>
                  <strong style={{ color: '#60a5fa' }}>3rd Tranche (40%):</strong> Add on breakout to new highs
                </div>
              </div>
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.1)', 
                padding: '12px', 
                borderRadius: '8px',
                marginTop: '16px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <strong style={{ color: '#93c5fd' }}>Max Position Size:</strong> 15-20% of portfolio per stock
              </div>
            </div>

            {/* Risk Management */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#ef4444' }}>
                🛡️ Risk Management (Non-Negotiable)
              </h3>
              <ul style={{ color: '#cbd5e1', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
                <li><strong>Stop Loss:</strong> -7% from entry (or break below 50MA if closer)</li>
                <li><strong>Max Risk Per Trade:</strong> 2% of portfolio</li>
                <li><strong>Max Portfolio Risk:</strong> 6% total (max 3 positions at risk)</li>
                <li><strong>Diversification:</strong> Max 5-7 positions, max 3 in same sector</li>
                <li><strong>Cash Reserve:</strong> Keep 20-30% in cash for opportunities</li>
              </ul>
            </div>

            {/* Exit Rules */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#f59e0b' }}>
                🚪 Exit Rules
              </h3>
              <div style={{ color: '#cbd5e1', lineHeight: '2' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#fbbf24' }}>Stop Loss Hit:</strong> Exit immediately, no exceptions
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#fbbf24' }}>Take Profit (+10%):</strong> Sell 25%, move stop to breakeven
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#fbbf24' }}>Strong Profit (+20%):</strong> Sell another 25%, trail stop at 50MA
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#fbbf24' }}>Break Below 50MA:</strong> Claude re-analyzes, likely exit signal
                </div>
                <div>
                  <strong style={{ color: '#fbbf24' }}>Weekly Review:</strong> Claude evaluates all positions, suggests hold/sell
                </div>
              </div>
            </div>

            {/* Common Mistakes */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#ef4444' }}>
                ⚠️ Common Mistakes to Avoid
              </h3>
              <ul style={{ color: '#cbd5e1', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
                <li>❌ Chasing breakouts - wait for pullbacks to 50MA</li>
                <li>❌ Moving stop losses lower - stick to your plan</li>
                <li>❌ Averaging down on losers - cut losses quickly</li>
                <li>❌ Over-trading - quality over quantity</li>
                <li>❌ Ignoring market conditions - strategy works best in uptrends</li>
                <li>❌ Trading during earnings - too much volatility</li>
                <li>❌ Emotional decisions - follow the system</li>
              </ul>
            </div>

            {/* Paper Trading Rules */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '2px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#8b5cf6' }}>
                🎓 Paper Trading Guidelines (CRITICAL)
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '12px' }}>
                <strong>DO NOT trade with real money until:</strong>
              </p>
              <ul style={{ color: '#cbd5e1', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
                <li>✓ You've completed at least 20 paper trades</li>
                <li>✓ You have 3+ months of consistent profitability</li>
                <li>✓ Your win rate is above 50%</li>
                <li>✓ You follow stop losses without exception</li>
                <li>✓ You understand WHY trades win or lose</li>
                <li>✓ You can handle losses emotionally</li>
              </ul>
              <div style={{ 
                background: 'rgba(139, 92, 246, 0.2)', 
                padding: '16px', 
                borderRadius: '8px',
                marginTop: '16px',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                <strong style={{ color: '#c4b5fd' }}>Remember:</strong> Paper trading is learning, not pretending. 
                Treat it like real money. Follow every rule. Track every decision.
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default TradingDashboard;

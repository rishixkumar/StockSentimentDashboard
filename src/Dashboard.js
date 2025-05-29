import React, { useEffect, useState } from 'react';
import { SentimentTrendChart, SentimentDistribution } from './SentimentChart';

export default function Dashboard() {
  const [ticker, setTicker] = useState('AAPL');
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNews = async (symbol) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/news?ticker=${symbol}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setNewsData(null);
      } else {
        setNewsData(data);
      }
    } catch (err) {
      setError('Failed to fetch news.');
      setNewsData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews(ticker);
  }, [ticker]);

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return 'var(--deep-aqua)';
    if (sentiment < -0.1) return 'var(--muted-red)';
    return 'var(--dark-cocoa)';
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.1) return 'Positive';
    if (sentiment < -0.1) return 'Negative';
    return 'Neutral';
  };

  const getSentimentClass = (sentiment) => {
    if (sentiment > 0.1) return 'sentiment-positive';
    if (sentiment < -0.1) return 'sentiment-negative';
    return 'sentiment-neutral';
  };

  return (
    <div className="dashboard-content">
      {/* Loading and Error States */}

      {loading && (
        <div className="card">
          <p style={{ fontSize: '1.1rem', color: 'var(--deep-aqua)' }}>Loading news...</p>
        </div>
      )}
      
      {error && (
        <div className="card" style={{ borderLeft: '4px solid var(--muted-red)' }}>
          <p style={{ color: 'var(--muted-red)', fontSize: '1.1rem' }}>{error}</p>
        </div>
      )}

    {newsData && (
        <>
        {/* Top Row: Stock Ticker and Overall Sentiment side by side */}
        <div
        style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem',
            alignItems: 'stretch' // Ensures both cards stretch to the same height
        }}
        >
        {/* Stock Ticker Card */}
        <div
            className="card"
            style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%', // Fills the grid cell
            boxSizing: 'border-box'
            }}
        >
            <label
            style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--dark-cocoa)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '1rem',
                textAlign: 'center'
            }}
            >
            Stock Ticker:
            </label>
            <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                width: '100%',
                justifyContent: 'center'
            }}
            >
            <input
                className="ticker-input"
                value={ticker}
                onChange={e => setTicker(e.target.value.toUpperCase())}
                placeholder="e.g., AAPL"
                style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: '700',
                textAlign: 'center',
                width: 100
                }}
            />
            <button className="btn-primary" onClick={() => fetchNews(ticker)}>
                Fetch News
            </button>
            </div>
        </div>
        {/* Overall Sentiment Card */}
        <div
            className="card"
            style={{
            borderLeft: `6px solid ${getSentimentColor(newsData.average_sentiment)}`,
            background: 'linear-gradient(135deg, var(--soft-ivory) 0%, #f5f0e8 100%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%', // Fills the grid cell
            boxSizing: 'border-box'
            }}
        >
            <h2
            className="card-title"
            style={{
                marginBottom: '1rem',
                fontSize: '2rem'
            }}
            >
            Overall Sentiment for {newsData.ticker}
            </h2>
            <span
            style={{
                fontSize: '2.4rem',
                fontWeight: '700',
                color: getSentimentColor(newsData.average_sentiment),
                fontFamily: 'var(--font-heading)',
                lineHeight: '1.2'
            }}
            >
            {newsData.sentiment_summary}
            </span>
            <span
            style={{
                fontSize: '1.6rem',
                color: 'var(--dark-cocoa)',
                backgroundColor: 'var(--peach-cream)',
                padding: '0.75rem 1.5rem',
                borderRadius: '24px',
                fontFamily: 'var(--font-heading)',
                marginTop: '0.5rem'
            }}
            >
            Score: {newsData.average_sentiment}
            </span>
        </div>
        </div>



        {/* Middle Row: Sentiment Distribution full width */}
        <div className="card" style={{ marginBottom: '2rem' }}>
        <SentimentDistribution headlines={newsData.headlines} />
        </div>

        {/* Bottom Row: Sentiment Trend Chart full width */}
        <div className="card" style={{ marginBottom: '2rem' }}>
        <SentimentTrendChart headlines={newsData.headlines} />
        </div>

        {/* Headlines Section */}
        <div className="card headlines-container">
        <h3 className="card-title">Headlines with Sentiment Analysis</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {newsData.headlines.map((item, idx) => (
            <div
                key={idx}
                className={`headline-card ${getSentimentClass(item.sentiment)}`}
                style={{
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e0d7c6',
                borderLeft: `4px solid ${getSentimentColor(item.sentiment)}`,
                background: 'white'
                }}
            >
                <p style={{
                margin: '0 0 1rem 0',
                fontSize: '1.1rem',
                lineHeight: '1.5',
                color: 'var(--dark-cocoa)',
                fontFamily: "var(--font-body)"
                }}>
                {item.headline}
                </p>
                <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
                }}>
                <span style={{
                    backgroundColor: 'var(--peach-cream)',
                    color: getSentimentColor(item.sentiment),
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    border: `1.5px solid ${getSentimentColor(item.sentiment)}`,
                    fontFamily: "var(--font-heading)"
                }}>
                    {getSentimentLabel(item.sentiment)} ({item.sentiment.toFixed(3)})
                </span>
                <div style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <span>Pos: {(item.positive * 100).toFixed(1)}%</span>
                    <span>Neg: {(item.negative * 100).toFixed(1)}%</span>
                    <span>Neu: {(item.neutral * 100).toFixed(1)}%</span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    </>
    )}

    </div>
);
}
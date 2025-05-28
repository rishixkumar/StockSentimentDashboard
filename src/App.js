import React, { useEffect, useState } from 'react';
import { SentimentTrendChart, SentimentDistribution } from './SentimentChart';


function App() {
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
    if (sentiment > 0.1) return '#28a745'; // Green for positive
    if (sentiment < -0.1) return '#dc3545'; // Red for negative
    return '#6c757d'; // Gray for neutral
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.1) return 'Positive';
    if (sentiment < -0.1) return 'Negative';
    return 'Neutral';
  };

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif' }}>
      <h1>📈 Stock Sentiment Dashboard</h1>
      
      <div style={{ marginBottom: 20 }}>
        <label>
          Enter Stock Ticker:&nbsp;
          <input
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            style={{ width: 100, padding: 8, marginRight: 10 }}
          />
        </label>
        <button 
          onClick={() => fetchNews(ticker)} 
          style={{ padding: 8, backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}
        >
          Fetch News
        </button>
      </div>

      {loading && <p>Loading news...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {newsData && (
        <div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: 20, 
            borderRadius: 8, 
            marginBottom: 20,
            border: `3px solid ${getSentimentColor(newsData.average_sentiment)}`
          }}>
            <h2>Overall Sentiment for {newsData.ticker}</h2>
            <p style={{ fontSize: 18, margin: 0 }}>
              <strong style={{ color: getSentimentColor(newsData.average_sentiment) }}>
                {newsData.sentiment_summary}
              </strong>
              {' '}(Score: {newsData.average_sentiment})
            </p>
          </div>

          <h3>Headlines with Sentiment Analysis</h3>
          <div>
            {newsData.headlines.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  marginBottom: 15, 
                  padding: 15, 
                  border: '1px solid #dee2e6', 
                  borderRadius: 5,
                  borderLeft: `4px solid ${getSentimentColor(item.sentiment)}`
                }}
              >
                <p style={{ margin: '0 0 8px 0', fontSize: 16 }}>{item.headline}</p>
                <div style={{ fontSize: 14, color: '#666' }}>
                  <span style={{ 
                    backgroundColor: getSentimentColor(item.sentiment), 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: 12,
                    marginRight: 10
                  }}>
                    {getSentimentLabel(item.sentiment)} ({item.sentiment.toFixed(3)})
                  </span>
                  <span>Pos: {(item.positive * 100).toFixed(1)}% | </span>
                  <span>Neg: {(item.negative * 100).toFixed(1)}% | </span>
                  <span>Neu: {(item.neutral * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30 }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: 20, borderRadius: 8 }}>
              <SentimentTrendChart headlines={newsData.headlines} />
            </div>
            <div style={{ backgroundColor: '#f8f9fa', padding: 20, borderRadius: 8 }}>
              <SentimentDistribution headlines={newsData.headlines} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function SentimentTrendChart({ headlines }) {
  const data = {
    labels: headlines.map((_, idx) => `News ${idx + 1}`),
    datasets: [
      {
        label: 'Sentiment Score',
        data: headlines.map(h => h.sentiment),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: headlines.map(h => 
          h.sentiment > 0.1 ? 'rgba(40, 167, 69, 0.2)' :
          h.sentiment < -0.1 ? 'rgba(220, 53, 69, 0.2)' :
          'rgba(108, 117, 125, 0.2)'
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sentiment Analysis by Headline' },
    },
    scales: {
      y: { beginAtZero: true, min: -1, max: 1 },
    },
  };

  return <Line data={data} options={options} />;
}

export function SentimentDistribution({ headlines }) {
  const positive = headlines.filter(h => h.sentiment > 0.1).length;
  const negative = headlines.filter(h => h.sentiment < -0.1).length;
  const neutral = headlines.filter(h => h.sentiment >= -0.1 && h.sentiment <= 0.1).length;

  const data = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Number of Headlines',
        data: [positive, negative, neutral],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(108, 117, 125, 0.8)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(108, 117, 125, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sentiment Distribution' },
    },
  };

  return <Bar data={data} options={options} />;
}

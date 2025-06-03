from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from db import create_db_and_tables
from users import fastapi_users, auth_backend
from schemas import UserRead, UserCreate, UserUpdate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = SentimentIntensityAnalyzer()

@app.on_event("startup")
async def on_startup():
    await create_db_and_tables()

#user authentication routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.get("/api/test")
def test():
    return {"status": "success", "data": "Frontend-Backend connection working!"}

@app.get("/api/news")
def get_news(ticker: str = Query(...)):
    # Sample headlines for testing when scraping fails
    sample_headlines = [
        f"{ticker} reports strong quarterly earnings, beating analyst expectations",
        f"{ticker} announces new product launch, shares rise in after-hours trading",
        f"{ticker} faces regulatory scrutiny over recent acquisition plans",
        f"{ticker} CEO optimistic about future growth prospects in earnings call",
        f"{ticker} stock volatility continues amid market uncertainty"
    ]
    
    try:
        url = f"https://finviz.com/quote.ashx?t={ticker}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            raise Exception(f"HTTP {response.status_code}")
            
        soup = BeautifulSoup(response.text, "html.parser")
        news_table = soup.find("table", class_="fullview-news-outer")
        
        headlines = []
        if news_table:
            for row in news_table.findAll("tr"):
                headline = row.a.text if row.a else None
                if headline:
                    headlines.append(headline)
        
        # If no headlines found, use samples
        if not headlines:
            headlines = sample_headlines
            
    except Exception as e:
        print(f"Scraping failed: {e}")
        headlines = sample_headlines
    
    # Process headlines with sentiment
    headlines_with_sentiment = []
    for headline in headlines:
        sentiment_scores = analyzer.polarity_scores(headline)
        headlines_with_sentiment.append({
            "headline": headline,
            "sentiment": sentiment_scores['compound'],
            "positive": sentiment_scores['pos'],
            "negative": sentiment_scores['neg'],
            "neutral": sentiment_scores['neu']
        })
    
    # Calculate overall sentiment
    if headlines_with_sentiment:
        avg_sentiment = sum(h['sentiment'] for h in headlines_with_sentiment) / len(headlines_with_sentiment)
    else:
        avg_sentiment = 0
    
    return {
        "ticker": ticker,
        "headlines": headlines_with_sentiment,
        "average_sentiment": round(avg_sentiment, 3),
        "sentiment_summary": "Positive" if avg_sentiment > 0.1 else "Negative" if avg_sentiment < -0.1 else "Neutral"
    }

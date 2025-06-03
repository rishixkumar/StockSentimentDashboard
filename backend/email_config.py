import aiosmtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Email configuration from environment variables
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Your logo SVG as a string (for embedding)
LOGO_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#278783" style="width: 48px; height: 48px;">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
</svg>'''

def create_html_email(reset_token: str) -> str:
    """Create beautiful HTML email template"""
    
    reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
    
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Stock Sentiment Dashboard</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Old+Standard+TT:wght@400;700&display=swap');
        
        body {{
            margin: 0;
            padding: 0;
            background-color: #2a2a2a;
            font-family: 'Old Standard TT', serif;
            line-height: 1.6;
        }}
        
        .container {{
            max-width: 600px;
            margin: 40px auto;
            background-color: #ECE5D8;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(44, 36, 32, 0.1);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #ECE5D8 0%, #f5f0e8 100%);
            text-align: center;
            padding: 40px 20px;
            border-bottom: 3px solid #278783;
        }}
        
        .logo {{
            margin-bottom: 20px;
        }}
        
        .title {{
            font-family: 'Bebas Neue', Arial, sans-serif;
            font-size: 28px;
            color: #321B15;
            margin: 0;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }}
        
        .content {{
            padding: 40px 30px;
            background-color: #ECE5D8;
        }}
        
        .message {{
            color: #321B15;
            font-size: 18px;
            margin-bottom: 30px;
            text-align: center;
        }}
        
        .reset-button {{
            display: block;
            width: 200px;
            margin: 30px auto;
            padding: 15px 30px;
            background-color: #278783;
            color: #ECE5D8;
            text-decoration: none;
            border-radius: 8px;
            font-family: 'Bebas Neue', Arial, sans-serif;
            font-size: 18px;
            text-align: center;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            transition: background-color 0.3s ease;
        }}
        
        .reset-button:hover {{
            background-color: #1f6b67;
        }}
        
        .footer {{
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
            background-color: #f5f0e8;
            border-top: 1px solid #d4c5b0;
        }}
        
        .warning {{
            margin-top: 20px;
            padding: 15px;
            background-color: #FFEBD0;
            border-left: 4px solid #278783;
            border-radius: 4px;
            font-size: 14px;
            color: #321B15;
        }}
        
        .expires {{
            color: #C0392B;
            font-weight: 700;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                {LOGO_SVG}
            </div>
            <h1 class="title">Stock Sentiment Dashboard</h1>
        </div>
        
        <div class="content">
            <div class="message">
                <strong>Password Reset Request</strong><br>
                We received a request to reset your password for your Stock Sentiment Dashboard account.
            </div>
            
            <a href="{reset_url}" class="reset-button">Reset Password</a>
            
            <div class="warning">
                <strong>Security Notice:</strong><br>
                • This link will <span class="expires">expire in 1 hour</span><br>
                • If you didn't request this reset, please ignore this email<br>
                • Never share this link with anyone
            </div>
        </div>
        
        <div class="footer">
            <p>
                <strong>Stock Sentiment Dashboard Team</strong><br>
                Professional Financial Analysis Platform
            </p>
            <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    return html_content

async def send_reset_email(to_email: str, reset_token: str):
    """Send professional HTML password reset email"""
    
    # Create multipart message
    message = MIMEMultipart('alternative')
    message["From"] = SMTP_USERNAME
    message["To"] = to_email
    message["Subject"] = "🔐 Password Reset - Stock Sentiment Dashboard"
    
    # Create HTML content
    html_content = create_html_email(reset_token)
    
    # Create plain text fallback
    text_content = f"""
    Stock Sentiment Dashboard - Password Reset
    
    Hello,
    
    You requested a password reset for your Stock Sentiment Dashboard account.
    
    Reset your password: http://localhost:3000/reset-password?token={reset_token}
    
    This link will expire in 1 hour.
    
    If you didn't request this reset, please ignore this email.
    
    Best regards,
    Stock Sentiment Dashboard Team
    """
    
    # Attach parts
    text_part = MIMEText(text_content, 'plain')
    html_part = MIMEText(html_content, 'html')
    
    message.attach(text_part)
    message.attach(html_part)
    
    # Send the email
    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            start_tls=True,
            username=SMTP_USERNAME,
            password=SMTP_PASSWORD,
        )
        print(f"Professional password reset email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False

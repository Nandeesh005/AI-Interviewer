import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'interviewiq-secret-2024')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-2024')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///interviewiq.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

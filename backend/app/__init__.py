import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.interview import interview_bp
    from app.routes.resume import resume_bp
    from app.routes.feedback import feedback_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(interview_bp, url_prefix='/api/interview')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    with app.app_context():
        db.create_all()

    return app

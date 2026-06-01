from app import db
from datetime import datetime


class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(30), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20), default='Medium')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'role': self.role,
            'question_text': self.question_text,
            'difficulty': self.difficulty
        }

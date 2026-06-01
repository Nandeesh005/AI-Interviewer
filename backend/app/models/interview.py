from app import db
from datetime import datetime
import json


class Interview(db.Model):
    __tablename__ = 'interviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    interview_type = db.Column(db.String(30), default='Mixed')
    questions_data = db.Column(db.Text, default='[]')
    overall_score = db.Column(db.Float, default=0)
    technical_score = db.Column(db.Float, default=0)
    communication_score = db.Column(db.Float, default=0)
    confidence_score = db.Column(db.Float, default=0)
    emotion_data = db.Column(db.Text, default='{}')
    voice_data = db.Column(db.Text, default='{}')
    eye_contact_score = db.Column(db.Float, default=0)
    feedback_data = db.Column(db.Text, default='{}')
    duration = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_questions(self):
        return json.loads(self.questions_data) if self.questions_data else []

    def set_questions(self, data):
        self.questions_data = json.dumps(data)

    def get_emotions(self):
        return json.loads(self.emotion_data) if self.emotion_data else {}

    def set_emotions(self, data):
        self.emotion_data = json.dumps(data)

    def get_voice(self):
        return json.loads(self.voice_data) if self.voice_data else {}

    def set_voice(self, data):
        self.voice_data = json.dumps(data)

    def get_feedback(self):
        return json.loads(self.feedback_data) if self.feedback_data else {}

    def set_feedback(self, data):
        self.feedback_data = json.dumps(data)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'role': self.role,
            'interview_type': self.interview_type,
            'questions': self.get_questions(),
            'overall_score': self.overall_score,
            'technical_score': self.technical_score,
            'communication_score': self.communication_score,
            'confidence_score': self.confidence_score,
            'emotion_data': self.get_emotions(),
            'voice_data': self.get_voice(),
            'eye_contact_score': self.eye_contact_score,
            'feedback': self.get_feedback(),
            'duration': self.duration,
            'created_at': self.created_at.isoformat()
        }

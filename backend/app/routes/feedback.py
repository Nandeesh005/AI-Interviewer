from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.ai_service import generate_feedback

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate():
    data = request.get_json()
    questions = data.get('questions', [])
    emotion_data = data.get('emotion_data', {})
    voice_data = data.get('voice_data', {})
    eye_contact_score = data.get('eye_contact_score', 0)
    role = data.get('role', 'Software Engineer')

    feedback = generate_feedback(questions, emotion_data, voice_data, eye_contact_score, role)
    return jsonify({'feedback': feedback})

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.interview import Interview
from app.models.question import Question
import random

interview_bp = Blueprint('interview', __name__)


@interview_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_questions():
    role = request.args.get('role', 'Software Engineer')
    category = request.args.get('category', 'Mixed')
    count = int(request.args.get('count', 8))

    if category == 'Mixed':
        hr_qs = Question.query.filter_by(role=role, category='HR').all()
        tech_qs = Question.query.filter_by(role=role, category='Technical').all()
        apt_qs = Question.query.filter_by(role=role, category='Aptitude').all()
        questions = random.sample(hr_qs, min(3, len(hr_qs))) + \
                    random.sample(tech_qs, min(3, len(tech_qs))) + \
                    random.sample(apt_qs, min(2, len(apt_qs)))
    else:
        all_qs = Question.query.filter_by(role=role, category=category).all()
        questions = random.sample(all_qs, min(count, len(all_qs)))

    random.shuffle(questions)
    return jsonify({'questions': [q.to_dict() for q in questions]})


@interview_bp.route('/save', methods=['POST'])
@jwt_required()
def save_interview():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    interview = Interview(
        user_id=user_id,
        role=data.get('role', 'Software Engineer'),
        interview_type=data.get('interview_type', 'Mixed'),
        overall_score=data.get('overall_score', 0),
        technical_score=data.get('technical_score', 0),
        communication_score=data.get('communication_score', 0),
        confidence_score=data.get('confidence_score', 0),
        eye_contact_score=data.get('eye_contact_score', 0),
        duration=data.get('duration', 0)
    )
    interview.set_questions(data.get('questions', []))
    interview.set_emotions(data.get('emotion_data', {}))
    interview.set_voice(data.get('voice_data', {}))
    interview.set_feedback(data.get('feedback', {}))

    db.session.add(interview)
    db.session.commit()

    return jsonify({'interview': interview.to_dict()}), 201


@interview_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    interviews = Interview.query.filter_by(user_id=user_id)\
        .order_by(Interview.created_at.desc()).all()
    return jsonify({'interviews': [i.to_dict() for i in interviews]})


@interview_bp.route('/<int:interview_id>', methods=['GET'])
@jwt_required()
def get_interview(interview_id):
    user_id = int(get_jwt_identity())
    interview = Interview.query.filter_by(id=interview_id, user_id=user_id).first()
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
    return jsonify({'interview': interview.to_dict()})


@interview_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    interviews = Interview.query.filter_by(user_id=user_id).all()

    if not interviews:
        return jsonify({
            'total_interviews': 0,
            'avg_score': 0,
            'avg_confidence': 0,
            'avg_communication': 0,
            'avg_technical': 0,
            'avg_eye_contact': 0
        })

    total = len(interviews)
    return jsonify({
        'total_interviews': total,
        'avg_score': round(sum(i.overall_score for i in interviews) / total, 1),
        'avg_confidence': round(sum(i.confidence_score for i in interviews) / total, 1),
        'avg_communication': round(sum(i.communication_score for i in interviews) / total, 1),
        'avg_technical': round(sum(i.technical_score for i in interviews) / total, 1),
        'avg_eye_contact': round(sum(i.eye_contact_score for i in interviews) / total, 1)
    })

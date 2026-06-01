from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.interview import Interview
from app.models.question import Question

admin_bp = Blueprint('admin', __name__)


def check_admin():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    return user and user.role == 'admin'


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    if not check_admin():
        return jsonify({'error': 'Admin access required'}), 403
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({'users': [u.to_dict() for u in users]})


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    if not check_admin():
        return jsonify({'error': 'Admin access required'}), 403
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user.role == 'admin':
        return jsonify({'error': 'Cannot delete admin'}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})


@admin_bp.route('/interviews', methods=['GET'])
@jwt_required()
def get_all_interviews():
    if not check_admin():
        return jsonify({'error': 'Admin access required'}), 403
    interviews = Interview.query.order_by(Interview.created_at.desc()).all()
    result = []
    for i in interviews:
        data = i.to_dict()
        user = User.query.get(i.user_id)
        data['user_name'] = user.name if user else 'Unknown'
        result.append(data)
    return jsonify({'interviews': result})


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    if not check_admin():
        return jsonify({'error': 'Admin access required'}), 403
    total_users = User.query.count()
    total_interviews = Interview.query.count()
    total_questions = Question.query.count()
    interviews = Interview.query.all()
    avg_score = round(sum(i.overall_score for i in interviews) / max(len(interviews), 1), 1)
    return jsonify({
        'total_users': total_users,
        'total_interviews': total_interviews,
        'total_questions': total_questions,
        'avg_score': avg_score
    })


@admin_bp.route('/questions', methods=['POST'])
@jwt_required()
def add_question():
    if not check_admin():
        return jsonify({'error': 'Admin access required'}), 403
    data = request.get_json()
    q = Question(
        category=data.get('category', 'HR'),
        role=data.get('role', 'Software Engineer'),
        question_text=data.get('question_text', ''),
        difficulty=data.get('difficulty', 'Medium')
    )
    db.session.add(q)
    db.session.commit()
    return jsonify({'question': q.to_dict()}), 201


@admin_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_all_questions():
    if not check_admin():
        return jsonify({'error': 'Admin access required'}), 403
    questions = Question.query.order_by(Question.category).all()
    return jsonify({'questions': [q.to_dict() for q in questions]})


@admin_bp.route('/questions/<int:question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    if not check_admin():
        return jsonify({'error': 'Admin access required'}), 403
    q = Question.query.get(question_id)
    if not q:
        return jsonify({'error': 'Question not found'}), 404
    db.session.delete(q)
    db.session.commit()
    return jsonify({'message': 'Question deleted'})

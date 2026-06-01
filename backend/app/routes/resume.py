import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from app.services.resume_service import parse_resume, generate_resume_questions

resume_bp = Blueprint('resume', __name__)


@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '' or not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Please upload a PDF file'}), 400

    upload_folder = current_app.config['UPLOAD_FOLDER']
    filepath = os.path.join(upload_folder, file.filename)
    file.save(filepath)

    try:
        resume_data = parse_resume(filepath)
        questions = generate_resume_questions(resume_data['skills'])
        return jsonify({
            'resume_data': resume_data,
            'questions': questions
        })
    except Exception as e:
        return jsonify({'error': f'Failed to parse resume: {str(e)}'}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

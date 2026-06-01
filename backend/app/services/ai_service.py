import os
import random

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False


def generate_feedback(questions, emotion_data, voice_data, eye_contact_score, role):
    """Generate AI feedback for interview performance."""
    gemini_key = os.getenv('GEMINI_API_KEY', '')

    if HAS_GEMINI and gemini_key:
        try:
            return _gemini_feedback(questions, emotion_data, voice_data, eye_contact_score, role, gemini_key)
        except Exception:
            pass

    return _algorithmic_feedback(questions, emotion_data, voice_data, eye_contact_score, role)


def _gemini_feedback(questions, emotion_data, voice_data, eye_contact_score, role, api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')

    qa_text = ""
    for i, q in enumerate(questions, 1):
        qa_text += f"Q{i}: {q.get('question', '')}\nAnswer: {q.get('answer', 'No answer')}\n\n"

    prompt = f"""You are an expert interview coach. Analyze this {role} interview and provide detailed feedback.

Questions and Answers:
{qa_text}

Emotion Data: {emotion_data}
Eye Contact Score: {eye_contact_score}%
Voice Data: {voice_data}

Respond in this exact JSON format:
{{
  "overall_score": <0-100>,
  "technical_score": <0-100>,
  "communication_score": <0-100>,
  "confidence_score": <0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "summary": "A 2-3 sentence professional summary of the interview performance.",
  "emotion_summary": "Brief analysis of emotional state during interview."
}}"""

    response = model.generate_content(prompt)
    import json
    text = response.text.strip()
    if text.startswith('```'):
        text = text.split('\n', 1)[1].rsplit('```', 1)[0]
    return json.loads(text)


def _algorithmic_feedback(questions, emotion_data, voice_data, eye_contact_score, role):
    """Fallback algorithmic feedback when Gemini is unavailable."""
    answered = sum(1 for q in questions if q.get('answer', '').strip())
    total = max(len(questions), 1)
    answer_rate = answered / total

    avg_word_count = 0
    if questions:
        word_counts = [len(q.get('answer', '').split()) for q in questions]
        avg_word_count = sum(word_counts) / total

    tech_score = min(95, max(30, answer_rate * 60 + min(avg_word_count / 2, 35)))
    comm_score = min(95, max(30, 50 + min(avg_word_count / 3, 30) - voice_data.get('filler_count', 0) * 2))
    conf_score = min(95, max(30, eye_contact_score * 0.4 + 40 + random.uniform(-5, 10)))
    overall = round((tech_score * 0.4 + comm_score * 0.3 + conf_score * 0.3), 1)

    strengths = []
    weaknesses = []
    suggestions = []

    if answer_rate > 0.7:
        strengths.append("Attempted most questions demonstrating good engagement")
    if avg_word_count > 30:
        strengths.append("Provided detailed and thorough responses")
    if eye_contact_score > 60:
        strengths.append("Maintained good eye contact showing confidence")
    if voice_data.get('filler_count', 5) < 5:
        strengths.append("Spoke fluently with minimal filler words")

    if not strengths:
        strengths = ["Showed willingness to attempt the interview", "Demonstrated basic understanding of concepts"]

    if answer_rate < 0.5:
        weaknesses.append("Several questions were left unanswered")
    if avg_word_count < 15:
        weaknesses.append("Responses were too brief — elaborate more on your answers")
    if eye_contact_score < 40:
        weaknesses.append("Eye contact was inconsistent — practice looking at the camera")
    if voice_data.get('filler_count', 0) > 8:
        weaknesses.append("Excessive use of filler words (umm, ahh, like)")

    if not weaknesses:
        weaknesses = ["Could improve response depth in some areas"]

    suggestions = [
        f"Practice more {role} specific technical questions daily",
        "Use the STAR method (Situation, Task, Action, Result) for behavioral questions",
        "Record yourself answering questions and review for improvement",
        "Research common interview questions for your target role",
        "Practice speaking clearly and at a moderate pace"
    ]

    return {
        'overall_score': round(overall),
        'technical_score': round(tech_score),
        'communication_score': round(comm_score),
        'confidence_score': round(conf_score),
        'strengths': strengths[:4],
        'weaknesses': weaknesses[:3],
        'suggestions': suggestions[:4],
        'summary': f"The candidate demonstrated {'solid' if overall > 65 else 'developing'} interview skills for the {role} position. {'Strong technical responses and good communication.' if overall > 65 else 'There is room for improvement in technical depth and communication clarity.'}",
        'emotion_summary': f"The candidate appeared {'mostly confident and engaged' if conf_score > 60 else 'somewhat nervous but showed effort'} throughout the interview."
    }

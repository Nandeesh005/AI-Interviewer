import re

try:
    from PyPDF2 import PdfReader
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False

SKILL_KEYWORDS = {
    'Python': ['python'],
    'JavaScript': ['javascript', 'js', 'es6'],
    'React': ['react', 'reactjs', 'react.js'],
    'Node.js': ['node', 'nodejs', 'node.js'],
    'Flask': ['flask'],
    'Django': ['django'],
    'Java': ['java'],
    'C++': ['c++', 'cpp'],
    'SQL': ['sql', 'mysql', 'postgresql', 'postgres'],
    'MongoDB': ['mongodb', 'mongo'],
    'HTML/CSS': ['html', 'css'],
    'Machine Learning': ['machine learning', 'ml'],
    'Deep Learning': ['deep learning', 'neural network', 'cnn', 'rnn'],
    'NLP': ['nlp', 'natural language processing'],
    'Data Science': ['data science', 'data analysis'],
    'TensorFlow': ['tensorflow'],
    'PyTorch': ['pytorch'],
    'AWS': ['aws', 'amazon web services'],
    'Docker': ['docker'],
    'Git': ['git', 'github'],
    'REST API': ['rest', 'api', 'restful'],
    'TypeScript': ['typescript', 'ts'],
    'Angular': ['angular'],
    'Vue.js': ['vue', 'vuejs'],
    'Express.js': ['express', 'expressjs'],
    'FastAPI': ['fastapi'],
    'Pandas': ['pandas'],
    'NumPy': ['numpy'],
    'OpenCV': ['opencv', 'cv2'],
    'Scikit-learn': ['scikit-learn', 'sklearn'],
}

SKILL_QUESTIONS = {
    'Python': [
        "Explain the difference between list and tuple in Python.",
        "What are Python decorators and how do you use them?",
        "How does memory management work in Python?"
    ],
    'React': [
        "Explain the virtual DOM in React.",
        "What are React hooks? Explain useState and useEffect.",
        "How do you manage state in a large React application?"
    ],
    'Flask': [
        "Explain Flask routing and how blueprints work.",
        "How do you handle authentication in Flask?",
        "What is the Flask application context?"
    ],
    'JavaScript': [
        "Explain closures in JavaScript.",
        "What is the event loop in JavaScript?",
        "Explain the difference between var, let, and const."
    ],
    'SQL': [
        "Explain the difference between INNER JOIN and LEFT JOIN.",
        "What are database indexes and when should you use them?",
        "Explain database normalization and its forms."
    ],
    'Machine Learning': [
        "Explain the bias-variance tradeoff.",
        "What is overfitting and how do you prevent it?",
        "Explain the difference between supervised and unsupervised learning."
    ],
    'Deep Learning': [
        "Explain backpropagation in neural networks.",
        "What is the vanishing gradient problem?",
        "Compare CNNs and RNNs and their use cases."
    ],
    'Docker': [
        "What is containerization and how does Docker work?",
        "Explain Docker Compose and its use cases.",
        "What is the difference between a Docker image and container?"
    ],
    'Node.js': [
        "Explain the event-driven architecture of Node.js.",
        "What is middleware in Express.js?",
        "How does Node.js handle concurrent requests?"
    ],
    'MongoDB': [
        "Explain the difference between SQL and NoSQL databases.",
        "How does indexing work in MongoDB?",
        "What are aggregation pipelines in MongoDB?"
    ],
}


def parse_resume(filepath):
    """Extract text and skills from a PDF resume."""
    if not HAS_PYPDF2:
        return {'text': '', 'skills': [], 'projects': []}

    reader = PdfReader(filepath)
    text = ''
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + '\n'

    text_lower = text.lower()
    found_skills = []
    for skill, keywords in SKILL_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                found_skills.append(skill)
                break

    projects = []
    project_patterns = [
        r'(?:project[s]?\s*[:\-–]?\s*)(.*?)(?:\n\n|\n[A-Z])',
        r'(?:PROJECT\s*[:\-–]?\s*)(.*?)(?:\n\n|\n[A-Z])',
    ]
    for pattern in project_patterns:
        matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
        for match in matches:
            lines = [l.strip() for l in match.strip().split('\n') if l.strip()]
            projects.extend(lines[:5])

    return {
        'text': text[:2000],
        'skills': found_skills,
        'projects': projects[:5]
    }


def generate_resume_questions(skills):
    """Generate personalized interview questions based on resume skills."""
    questions = []
    for skill in skills:
        if skill in SKILL_QUESTIONS:
            questions.extend([
                {'skill': skill, 'question': q}
                for q in SKILL_QUESTIONS[skill][:2]
            ])

    if not questions:
        questions = [
            {'skill': 'General', 'question': 'Tell me about a challenging project you worked on.'},
            {'skill': 'General', 'question': 'How do you stay updated with new technologies?'},
            {'skill': 'General', 'question': 'Describe your approach to debugging complex issues.'},
        ]

    return questions[:10]

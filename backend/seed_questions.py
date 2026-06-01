"""Seed the database with interview questions and an admin user."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User
from app.models.question import Question

QUESTIONS = [
    # Software Engineer - HR
    ("HR", "Software Engineer", "Tell me about yourself and your background.", "Easy"),
    ("HR", "Software Engineer", "Why do you want to work as a Software Engineer?", "Easy"),
    ("HR", "Software Engineer", "What are your greatest strengths and weaknesses?", "Easy"),
    ("HR", "Software Engineer", "Where do you see yourself in 5 years?", "Easy"),
    ("HR", "Software Engineer", "Describe a challenging situation at work and how you handled it.", "Medium"),
    ("HR", "Software Engineer", "How do you handle tight deadlines and pressure?", "Medium"),
    # Software Engineer - Technical
    ("Technical", "Software Engineer", "Explain the difference between stack and queue data structures.", "Easy"),
    ("Technical", "Software Engineer", "What is the time complexity of binary search?", "Easy"),
    ("Technical", "Software Engineer", "Explain Object-Oriented Programming principles.", "Medium"),
    ("Technical", "Software Engineer", "What is the difference between SQL and NoSQL databases?", "Medium"),
    ("Technical", "Software Engineer", "Explain RESTful API design principles.", "Medium"),
    ("Technical", "Software Engineer", "What are design patterns? Explain the Singleton pattern.", "Hard"),
    ("Technical", "Software Engineer", "Explain microservices architecture vs monolithic.", "Hard"),
    ("Technical", "Software Engineer", "How does garbage collection work in modern languages?", "Hard"),
    # Software Engineer - Aptitude
    ("Aptitude", "Software Engineer", "If a process takes 5 machines 5 minutes to make 5 widgets, how long for 100 machines to make 100 widgets?", "Medium"),
    ("Aptitude", "Software Engineer", "Estimate the number of software developers in India.", "Medium"),
    ("Aptitude", "Software Engineer", "How would you design a URL shortening service?", "Hard"),

    # Data Analyst - HR
    ("HR", "Data Analyst", "Tell me about yourself and your interest in data analysis.", "Easy"),
    ("HR", "Data Analyst", "Why do you want to be a Data Analyst?", "Easy"),
    ("HR", "Data Analyst", "Describe a project where data analysis drove key decisions.", "Medium"),
    ("HR", "Data Analyst", "How do you handle ambiguous or incomplete data?", "Medium"),
    # Data Analyst - Technical
    ("Technical", "Data Analyst", "Explain the difference between INNER JOIN and LEFT JOIN in SQL.", "Easy"),
    ("Technical", "Data Analyst", "What is the difference between mean, median, and mode?", "Easy"),
    ("Technical", "Data Analyst", "Explain the concept of data normalization.", "Medium"),
    ("Technical", "Data Analyst", "What is A/B testing and when would you use it?", "Medium"),
    ("Technical", "Data Analyst", "Explain correlation vs causation with an example.", "Medium"),
    ("Technical", "Data Analyst", "How would you handle missing values in a dataset?", "Medium"),
    ("Technical", "Data Analyst", "What visualization would you use to show trends over time?", "Easy"),
    # Data Analyst - Aptitude
    ("Aptitude", "Data Analyst", "A dataset has values: 2, 4, 4, 4, 5, 5, 7, 9. What is the standard deviation?", "Hard"),
    ("Aptitude", "Data Analyst", "If sales increased by 20% then decreased by 20%, what is the net change?", "Medium"),

    # AIML Engineer - HR
    ("HR", "AIML Engineer", "What inspired you to pursue AI/ML engineering?", "Easy"),
    ("HR", "AIML Engineer", "Tell me about an ML project you are most proud of.", "Medium"),
    ("HR", "AIML Engineer", "How do you stay updated with the latest AI research?", "Easy"),
    # AIML Engineer - Technical
    ("Technical", "AIML Engineer", "Explain the bias-variance tradeoff in machine learning.", "Medium"),
    ("Technical", "AIML Engineer", "What is the difference between supervised and unsupervised learning?", "Easy"),
    ("Technical", "AIML Engineer", "Explain backpropagation in neural networks.", "Hard"),
    ("Technical", "AIML Engineer", "What is transfer learning and when would you use it?", "Medium"),
    ("Technical", "AIML Engineer", "Explain precision, recall, and F1-score.", "Medium"),
    ("Technical", "AIML Engineer", "What is regularization and why is it important?", "Medium"),
    ("Technical", "AIML Engineer", "Compare CNN and RNN architectures.", "Hard"),
    ("Technical", "AIML Engineer", "What are GANs and how do they work?", "Hard"),
    # AIML Engineer - Aptitude
    ("Aptitude", "AIML Engineer", "If a model has 95% accuracy on training data but 60% on test data, what went wrong?", "Medium"),
    ("Aptitude", "AIML Engineer", "How would you approach building a recommendation system?", "Hard"),

    # Web Developer - HR
    ("HR", "Web Developer", "Tell me about your web development experience.", "Easy"),
    ("HR", "Web Developer", "What is your preferred tech stack and why?", "Easy"),
    ("HR", "Web Developer", "Describe a complex web application you built.", "Medium"),
    ("HR", "Web Developer", "How do you ensure code quality in your projects?", "Medium"),
    # Web Developer - Technical
    ("Technical", "Web Developer", "Explain the difference between CSS Flexbox and Grid.", "Easy"),
    ("Technical", "Web Developer", "What is the virtual DOM in React?", "Medium"),
    ("Technical", "Web Developer", "Explain how CORS works and why it exists.", "Medium"),
    ("Technical", "Web Developer", "What is the difference between authentication and authorization?", "Medium"),
    ("Technical", "Web Developer", "Explain responsive design and mobile-first approach.", "Easy"),
    ("Technical", "Web Developer", "What are Web Workers and when would you use them?", "Hard"),
    ("Technical", "Web Developer", "Explain the concept of server-side rendering vs client-side rendering.", "Medium"),
    # Web Developer - Aptitude
    ("Aptitude", "Web Developer", "How would you optimize a website that loads slowly?", "Medium"),
    ("Aptitude", "Web Developer", "Design the database schema for a social media platform.", "Hard"),
]


def seed():
    app = create_app()
    with app.app_context():
        # Create admin user
        admin = User.query.filter_by(email='admin@interviewiq.com').first()
        if not admin:
            admin = User(name='Admin', email='admin@interviewiq.com', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            print("Created admin user: admin@interviewiq.com / admin123")

        # Create demo user
        demo = User.query.filter_by(email='demo@interviewiq.com').first()
        if not demo:
            demo = User(name='Demo User', email='demo@interviewiq.com', role='user')
            demo.set_password('demo123')
            db.session.add(demo)
            print("Created demo user: demo@interviewiq.com / demo123")

        # Seed questions
        if Question.query.count() == 0:
            for cat, role, text, diff in QUESTIONS:
                q = Question(category=cat, role=role, question_text=text, difficulty=diff)
                db.session.add(q)
            print(f"Seeded {len(QUESTIONS)} questions")
        else:
            print(f"Questions already seeded ({Question.query.count()} found)")

        db.session.commit()
        print("Database seeding complete!")


if __name__ == '__main__':
    seed()

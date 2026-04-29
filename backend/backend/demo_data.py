from .models import Job
from django.contrib.auth.models import User

user, _ = User.objects.get_or_create(
    username="daniel",
    defaults={"email": "daniel@example.com"},
)
user.set_password("password123")
user.save()

jobs = [
    {
        "title": "Frontend Engineer",
        "description": "Build the Responsive website and manage the protocals and various of application of the System",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "6-10 LPA",
    },
    {
        "title": "Backend Developer",
        "description": "Create REST APIs, database models, and business logic using Django.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "8-12 LPA",
    },
    {
        "title": "Full Stack Developer",
        "description": "Work on React js and frontend framework and modern Tailwindcss and The most of the Web Ui is 3D animations and attractivre UI design and it is Accumulate to modern Webpages.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "10-15 LPA",
    },
    {
        "title": "DevOps Engineer",
        "description": "DevOps is one of the most important role in every Company and the behavioural Ascepts of the Testing, Development, and Deployment and the most Effecient way to organize the System of the all MNC(Multi-National Companies).",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "12-16 LPA",
    },
    {
        "title": "Mobile App Developer",
        "description": "Develop cross-platform apps using Flutter and Dart.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "7-11 LPA",
    },
    {
        "title": "Data Scientist",
        "description": "Work on ML models, data pipelines, and analytics dashboards.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "15-20 LPA",
    },
    {
        "title": "UI/UX Designer",
        "description": "Design intuitive interfaces and improve user experience.",
        "company": "Codevantage Inc",
        "location": "Coimbatore Inc",
        "salary_range": "5-8 LPA",
    },
    {
        "title": "Cybersecurity Analyst",
        "description": "Monitor systems, detect threats, and implement security protocols.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "10-14 LPA",
    },
    {
        "title": "QA Automation Engineer",
        "description": "Build automated test suites with Selenium, Playwright, and API testing tools.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "6-9 LPA",
    },
    {
        "title": "Python Developer",
        "description": "Develop backend services, scripts, and integrations using Python.",
        "company": "Codevanatage Inc",
        "location": "Coimbatore",
        "salary_range": "7-13 LPA",
    },
    {
        "title": "Java Developer",
        "description": "Build enterprise applications using Java, Spring Boot, and SQL databases.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "8-14 LPA",
    },
    {
        "title": "React Developer",
        "description": "Create reusable components and modern frontend workflows in React.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "5-9 LPA",
    },
    {
        "title": "Cloud Engineer",
        "description": "Deploy and maintain scalable infrastructure on AWS and Azure.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "11-18 LPA",
    },
    {
        "title": "Business Analyst",
        "description": "Gather requirements, document workflows, and coordinate with product teams.",
        "company": "Codevantage Inc",
        "location": "Bangalore",
        "salary_range": "6-10 LPA",
    },
    {
        "title": "Technical Support Engineer",
        "description": "Resolve customer issues, debug application problems, and write support docs.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "3-6 LPA",
    },
    {
        "title": "Database Administrator",
        "description": "Manage PostgreSQL databases, backups, tuning, and access controls.",
        "company": "Codevantage Inc",
        "location": "Coimbatore",
        "salary_range": "9-15 LPA",
    },
]

created_count = 0

for job in jobs:
    _, created = Job.objects.get_or_create(
        title=job["title"],
        company=job["company"],
        defaults={
            "description": job["description"],
            "location": job["location"],
            "salary_range": job["salary_range"],
            "created_by": user,
        },
    )
    if created:
        created_count += 1

print(f"Demo data ready. Created {created_count} new jobs.")

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.core.mail import EmailMultiAlternatives
from django.db import IntegrityError
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Application, Job
from .serializers import ApplicationSerializer, JobsSerializer, RegisterSerializer

@api_view(['GET'])
def hello_api(request):
    return Response({"message":"Hello from Django API"})

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)   
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"User Registered Successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def basic_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'message':"Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "message": "Login successful",
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def job_list(request):
    jobs = Job.objects.order_by("-id")
    serializer = JobsSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def job_detail(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"message": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobsSerializer(job)
    return Response(serializer.data)

@api_view(['POST'])
def apply_job(request):
    serializer = ApplicationSerializer(data=request.data)
    job_id = request.data.get("job")
    applicant_id = request.data.get("applicant")

    if Application.objects.filter(job_id=job_id, applicant_id=applicant_id).exists():
        return Response({"message":"You already have applied!"}, status=status.HTTP_400_BAD_REQUEST)
    if serializer.is_valid():
        try:
            application = serializer.save()
        except IntegrityError:
            return Response({"message":"You already have applied!"}, status=status.HTTP_400_BAD_REQUEST)
        email_sent = True
        response_message = "Application submitted successfully."

        try:
            email_context = {
                "candidate_name": application.full_name,
                "job_title": application.job.title,
                "company_name": application.job.company,
                "location": application.job.location,
                "experience": application.years_experience,
                "current_company": application.current_company,
                "application_id": application.id,
            }
            html_body = render_to_string(
                "emails/application_confirmation.html",
                email_context,
            )
            text_body = strip_tags(html_body)
            message = EmailMultiAlternatives(
                subject=f"Application received for {application.job.title}",
                body=text_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[application.email],
            )
            message.attach_alternative(html_body, "text/html")
            message.send(fail_silently=False)
        except Exception:
            email_sent = False
            response_message = (
                "Application submitted successfully, but the confirmation email could not be sent. "
                "Please verify your SMTP settings."
            )

        if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
            email_sent = False
            response_message = (
                "Application submitted successfully, but email is still using console mode. "
                "Restart Django after updating backend/.env to send real emails."
            )

        return Response(
            {
                "message": response_message,
                "email_sent": email_sent,
                "application_id": application.id,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

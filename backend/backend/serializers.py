from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Application, Job

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 6},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class JobsSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()
    
    class Meta:
        model=Job
        fields="__all__"

class ApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.username', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ['status', 'applied_on']

    def validate_years_experience(self, value):
        if value < 0 or value > 60:
            raise serializers.ValidationError("Experience must be between 0 and 60 years.")
        return value

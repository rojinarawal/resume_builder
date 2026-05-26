from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    """
    Serializer does two things:
    1. Converts a Resume model instance → JSON (for GET responses)
    2. Validates and converts JSON → Resume model instance (for POST/PUT)
    
    ModelSerializer automatically creates fields from the model.
    We just tell it which fields to expose.
    """
    class Meta:
        model = Resume
        fields = ['id', 'first_name', 'last_name', 'job_title', 'email', 'phone', 'location', 'linkedin', 'github',
                'summary', 'experience', 'education', 'skills', 'projects', 'created_at', 'updated_at']
        
        # These fields come from the DB, frontend never sends them
        read_only_fields = ['id', 'created_at', 'updated_at']
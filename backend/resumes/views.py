from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from django.http import HttpResponse
from django.template.loader import render_to_string
import pdfkit
import os

@api_view(['GET'])
def export_pdf(request, pk):
    try:
        resume = Resume.objects.get(pk=pk)
    except Resume.DoesNotExist:
        return Response({'error': 'Resume not found'}, status=404)

    html_string = render_to_string('resumes/resume_pdf.html', {
        'resume': resume,
        'active_sections': resume.active_sections or [],
    })

    options = {
        'page-size': 'A4',
        'margin-top': '18mm',
        'margin-right': '16mm',
        'margin-bottom': '18mm',
        'margin-left': '16mm',
        'encoding': 'UTF-8',
        'no-outline': None,
    }

    # Tell pdfkit exactly where wkhtmltopdf is installed on Windows
    config = pdfkit.configuration(
        wkhtmltopdf=r'D:\ProgramFiles\wkhtmltopdf\bin\wkhtmltopdf.exe'
    )

    pdf_file = pdfkit.from_string(html_string, False, options=options, configuration=config)

    filename = f"{resume.full_name.replace(' ', '_') or 'resume'}_resume.pdf"
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response

@api_view(['GET', 'POST'])
def resume_list(request):
    if request.method == 'GET':
        resumes = Resume.objects.all()
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        # request.data is the JSON body sent from React
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # 201 Created — not 200, because we made a new resource
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 400 Bad Request if the data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def resume_detail(request, pk):
    """
    GET    /api/resumes/1/  → return one resume
    PUT    /api/resumes/1/  → update a resume
    DELETE /api/resumes/1/  → delete a resume
    
    pk = primary key = the id of the resume in the database
    """
    # Try to find the resume by id (pk). If it doesn't exist, return 404 Not Found.
    try:
        resume = Resume.objects.get(pk=pk)
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer =  ResumeSerializer(resume)
        return Response(serializer.data)
    
    if request.method == 'PUT':
        # instance=resume tells the serializer "update this existing resume, don't make a new one"
        serializer = ResumeSerializer(instance=resume, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        resume.delete()
        # 204 No Content means "successfully deleted, no response body"
        return Response(status=status.HTTP_204_NO_CONTENT)
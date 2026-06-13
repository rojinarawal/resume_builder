from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
import pdfplumber
from google import genai
import json
import pdfkit

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
    


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def import_pdf(request):
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file uploaded'},
            status=status.HTTP_400_BAD_REQUEST
        )

    pdf_file = request.FILES['file']

    if not pdf_file.name.endswith('.pdf'):
        return Response(
            {'error': 'File must be a PDF'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ── Step 1: Extract text from PDF ────────────────────────────────
    try:
        with pdfplumber.open(pdf_file) as pdf:
            text = ''
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'

        if not text.strip():
            return Response(
                {'error': 'Could not extract text. Make sure PDF is not a scanned image.'},
                status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        return Response(
            {'error': f'Failed to read PDF: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ── Step 2: Send to Gemini API ────────────────────────────────────
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        prompt = f"""You are a resume parser. Extract structured data from the resume text below and return ONLY a valid JSON object. No explanation, no markdown, no code blocks — just raw JSON.

Return exactly this structure:
{{
  "basics": {{
    "fullName": "full name here",
    "email": "email here",
    "phone": "phone here",
    "location": "city, country here",
    "linkedin": "linkedin url or empty string",
    "github": "github url or website or empty string"
  }},
  "experience": [
    {{
      "id": 1,
      "role": "job title",
      "company": "company name",
      "start": "start date e.g. Jan 2022",
      "end": "end date e.g. Present or Dec 2023",
      "bullets": "bullet 1\\nbullet 2\\nbullet 3"
    }}
  ],
  "education": [
    {{
      "id": 1,
      "degree": "degree and major",
      "school": "university name",
      "year": "graduation year",
      "gpa": "gpa or empty string"
    }}
  ],
  "skills": [
    {{
      "id": 1,
      "category": "category name e.g. Languages",
      "items": ["skill1", "skill2"]
    }}
  ],
  "projects": [
    {{
      "id": 1,
      "name": "project name",
      "tech": "tech stack",
      "url": "url or empty string",
      "desc": "description"
    }}
  ],
  "certifications": [
    {{
      "id": 1,
      "name": "certification name",
      "issuer": "issuing org",
      "date": "date obtained",
      "url": "url or empty string"
    }}
  ]
}}

Rules:
- If a section has no data return empty array []
- Join multiple bullet points with \\n
- Group skills by category if possible
- Return ONLY the JSON — nothing else

Resume text:
{text}"""

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        response_text = response.text.strip()

        # Clean markdown code blocks if Gemini wraps the response
        if '```' in response_text:
            parts = response_text.split('```')
            for part in parts:
                part = part.strip()
                if part.startswith('json'):
                    part = part[4:].strip()
                try:
                    parsed_data = json.loads(part)
                    break
                except Exception:
                    continue
        else:
            parsed_data = json.loads(response_text)

    except json.JSONDecodeError:
        return Response(
            {'error': 'Failed to parse resume structure. Try a different PDF.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {'error': f'AI parsing failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response({
        'success': True,
        'data': parsed_data,
        'message': 'Resume parsed successfully. Review and edit before saving.'
    })
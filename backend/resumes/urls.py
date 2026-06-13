from django.urls import path
from .import views

urlpatterns = [
    path('resumes/',    views.resume_list, name='resume_list'),
    path('resumes/import/', views.import_pdf, name='resume-import'),
    path('resumes/<int:pk>/', views.resume_detail, name='resume_detail'),
    path('resumes/<int:pk>/export/', views.export_pdf, name='resume-export'),
]
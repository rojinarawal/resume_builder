from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),

    # All resume API endpoints will live under /api/
    # So the full URL is /api/resumes/ and /api/resumes/<int:pk>/

    path('api/', include('resumes.urls')),
]

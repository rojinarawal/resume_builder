from django.db import models


class Resume(models.Model):
    """
    The main resume record.
    One resume holds all sections as JSON fields.
    
    Why JSON fields instead of separate tables for each section?
    Because for an MVP, storing the whole resume structure as JSON
    is simpler and fast enough. We can normalize it later.
    This is a deliberate MVP tradeoff.
    """
    # Basic identity fields stored as plain text
    full_name = models.CharField(max_length=200, blank=True)
    email      = models.EmailField(blank=True)
    phone      = models.CharField(max_length=30, blank=True)
    location   = models.CharField(max_length=200, blank=True)
    linkedin   = models.CharField(max_length=300, blank=True)
    github     = models.CharField(max_length=300, blank=True)

    # Sections stored as JSON — flexible, no schema changes needed
    # when you add a new field to the form
    experience = models.JSONField(default=list)  # list of experience objects
    education  = models.JSONField(default=list)  # list of education objects
    skills     = models.JSONField(default=list)  # list of skill category objects
    projects   = models.JSONField(default=list)  # list of project objects
    certifications = models.JSONField(default=list)  # list of certification objects
    active_sections = models.JSONField(default=list, blank=True, help_text='Ordered list of active section ids')  # e.g. ["experience", "education"] to control which sections are shown in preview
    # Timestamps — always add these, you'll always want them
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} — {self.email}"

    class Meta:
        ordering = ['-updated_at']  # most recently updated first
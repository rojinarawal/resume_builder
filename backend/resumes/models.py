from django.db import models

class Resume(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    skills = models.TextField()
    experience = models.TextField()
    education = models.TextField()

    def __str__(self):
        return self.full_name
from django.db import models

class Form(models.Model):
    """
    Is attached to a Template and is responsible for the form
    """
    
    name = models.CharField(max_length=100)
    js_file = models.FileField(upload_to='js_files')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Form"
        verbose_name_plural = "Forms"

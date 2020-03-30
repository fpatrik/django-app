from django.db import models
from django.contrib.auth.models import User

class Feedback(models.Model):
    """
    A feedback item
    """
    #Optional User
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    
    #Feedback type
    type = models.CharField(max_length=100, choices = (('anregung', 'Anregung'), ('fehler', 'Fehler gefunden!'), ('feedback', 'Feedback Allgemein')))
    
    #Title
    title = models.CharField(max_length=200, null=True)
    
    #Text
    text = models.CharField(max_length=5000)
    
    #auto_now_add makes an automatic timestamp when an instance is created
    created = models.DateTimeField(auto_now_add = True)
    
    #Class method for creating new Feedback
    @classmethod
    def create(cls, user, type, title, text):
        
        if text != '' or title != '':
            new_feedback = cls(user = user, type = type, title = title, text = text)
        
        new_feedback.save()
        return new_feedback

from django.db import models
    

class Kanzlei(models.Model):
    """
    Extending the default Django user model
    """
    #Name of the kanzlei
    name = models.CharField(max_length=100)
    
    #Deadline when the kanzlei expires
    deadline = models.DateTimeField(default=None, blank=True, null = True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Kanzlei"
        verbose_name_plural = "Kanzleien"

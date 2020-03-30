from django.db import models
from kanzlei.models import Kanzlei

class Team(models.Model):
    """
    A Team of a Kanzlei
    """
    #Name of the kanzlei
    name = models.CharField(max_length=100)
    
    #Description of the team
    description = models.TextField(max_length=3000)
    
    #Kanzlei of the Team
    kanzlei = models.ForeignKey(Kanzlei, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.kanzlei.name + ' - ' + self.name
    
    class Meta:
        verbose_name = "Team"
        verbose_name_plural = "Teams"
        
    @classmethod
    def create(cls, name, description, kanzlei):
        
        #Create Team
        new_team = cls(name = name, description = description, kanzlei = kanzlei)
        
        new_team.save()
        
        #Return team for further use
        return new_team
    
    
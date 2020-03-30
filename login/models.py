from django.db import models
from django.contrib.auth.models import User
from kanzlei.models import Kanzlei
from team.models import Team
    

class ConventecUser(models.Model):
    """
    Extending the default Django user model
    """
    #Link to Django User
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    #Kanzlei of the User
    kanzlei = models.ForeignKey(Kanzlei, on_delete=models.CASCADE)
    
    #Teams of the User
    teams = models.ManyToManyField(Team, blank=True)
    
    #Position of the User
    position = models.CharField(max_length=100, null=True)
    
    #Role of the User
    role = models.CharField(max_length=100, choices = (('admin', 'Kanzlei Admin'), ('manager', 'Projektmanager'), ('mitarbeiter', 'Projektmitarbeiter')))
    
    #Has accepted terms of use
    accepted_tou = models.BooleanField(default=False)
    
    #If the user can view feedback
    view_feedback = models.BooleanField(default=False)
    
    @classmethod
    def create(cls, vorname, nachname, email, position, role, password, kanzlei):
        
        #Create new Django user
        user = User.objects.create_user(username=email, first_name = vorname, last_name = nachname, email = email, password = password)
        user.save()
        
        #Create conventecuser
        new_conventec_user = cls(user = user, kanzlei = kanzlei, position = position, role = role)
        new_conventec_user.save()
        
        #Return user for further use
        return new_conventec_user
    

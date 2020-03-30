from django.db import models
from team.models import Team
from project_folder.models import ProjectFolder

class Projekt(models.Model):
    """
    A project of teams
    """
    #Name of the project
    name = models.CharField(max_length=100)
    
    #Description of the project
    description = models.TextField(max_length=3000)
    
    #Folder of the project
    project_folder = models.OneToOneField(ProjectFolder, on_delete=models.CASCADE)
    
    #Teams of the Project
    teams = models.ManyToManyField(Team)
    
    #Lead of the Project
    lead = models.ForeignKey(Team, related_name='project_lead', null = True, on_delete=models.SET_NULL)
    
    #auto_now_add makes an automatic timestamp when an instance is created
    created = models.DateTimeField(auto_now_add = True)
    
    #If the project is completed
    completed = models.BooleanField(default = False)
    
    #Completed at
    completed_at = models.DateTimeField(auto_now_add = False, null = True, blank = True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Projekt"
        verbose_name_plural = "Projekte"
        
    def str_created(self):
        from utils.utils import format_time
        return format_time(self.created)
    
    def str_completed_at(self):
        from utils.utils import format_time
        return format_time(self.completed_at)
    
    def list_all_folders(self):
        folders = []
        todo = [self.project_folder]
        while len(todo) > 0:
            new_todo = []
            for folder in todo:
                folders.append(folder)
                new_todo += folder.parent_folder_set.all()
            todo = new_todo
        
        return folders
                
        
    
    #Class method for creating new Projekt
    @classmethod
    def create(cls, name, description, team = False):
        #Create ProjectFolder
        project_folder = ProjectFolder.create(name = name)
        
        #Create Projekt
        new_projekt = cls(name = name, description = description, completed = False, project_folder = project_folder)
        new_projekt.save()
        
        lead_team = Team.objects.get(id = team)
        new_projekt.teams.add(lead_team)
        new_projekt.lead = lead_team
        new_projekt.save()
        
        #Return item for further use
        return new_projekt
from django.db import models
from django.contrib.postgres.fields import JSONField
from utils.utils import format_time

class Geschaft(models.Model):
    """
    A Geschaft within a Projekt Folder
    """
    #Name of the Geschaft
    name = models.CharField(max_length=100)
    
    #auto_now_add makes an automatic timestamp when an instance is created
    created = models.DateTimeField(auto_now_add = True)
    #auto_now makes an automatic timestamp every time the instance is modified
    last_edited = models.DateTimeField(auto_now = True)
    
    #The template
    template = models.ForeignKey("template.Template", on_delete=models.PROTECT)
    
    #The project folder
    project_folder = models.ForeignKey("project_folder.ProjectFolder", on_delete=models.CASCADE)
    
    #The variables
    variables = JSONField(default="{}")
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Geschäft"
        verbose_name_plural = "Geschäfte"
        
    def str_created(self):
        return format_time(self.created)
    
    def str_last_edited(self):
        return format_time(self.last_edited)
    
    def get_project(self):
        return self.project_folder.get_project()
    
    def download_all(self):
        return self.template.download_all(self.id)
    
    #Class method for creating new Geschaft
    @classmethod
    def create(cls, template_id, project_folder_id, geschaft_name = None):
        from template.models import Template
        from project_folder.models import ProjectFolder
        
        template = Template.objects.get(id = template_id)
        project_folder = ProjectFolder.objects.get(id = project_folder_id)
        
        if geschaft_name is None:
            geschaft_name = template.name
        
        #Create Geschaft
        new_geschaft = cls(name = geschaft_name, template = template, project_folder = project_folder)
        
        new_geschaft.save()
        
        #Return item for further use
        return new_geschaft

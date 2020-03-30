from django.db import models
from geschaft.models import Geschaft
from utils.utils import format_time

class ProjectFolder(models.Model):
    """
    A folder containing projects
    """
    #Name of the Folder
    name = models.CharField(max_length=100)

    parent_folder = models.ForeignKey("self", blank = True, null=True, related_name='parent_folder_set', on_delete=models.CASCADE)
    
    #auto_now_add makes an automatic timestamp when an instance is created
    created = models.DateTimeField(auto_now_add = True)
    #auto_now makes an automatic timestamp every time the instance is modified
    last_edited = models.DateTimeField(auto_now = True)
    
    def __str__(self):
        return self.name
    
    def list_parent_folders(self):
        folder_list = [self]
        folder = self
        while folder.parent_folder is not None:
            folder = folder.parent_folder
            folder_list.append(folder)
        return reversed(folder_list)
    
    
    def get_project(self):
        folder = self
        while folder.parent_folder is not None:
            folder = folder.parent_folder
        if folder.projekt is not None:
            return folder.projekt
        else:
            return None
    
    def str_created(self):
        return format_time(self.created)
    
    def str_last_edited(self):
        return format_time(self.last_edited)

    #Class method for creating new ProjektFolder
    @classmethod
    def create(cls, name, parent_folder = None):
        #Create ProjectFolder
        new_folder = cls(name = name, parent_folder = parent_folder)
        new_folder.save()
        
        #Return item for further use
        return new_folder
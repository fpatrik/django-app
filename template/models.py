from django.db import models
from django.db.models import Q
from projekt.models import Projekt
from document.models import Document
from form.models import Form
from kanzlei.models import Kanzlei
from zipfile import ZipFile
from io import BytesIO
from django.http import HttpResponse
from wsgiref.util import FileWrapper

class Template(models.Model):
    """
    Template for Geschafte
    """
    #Name of the Geschaft
    name = models.CharField(max_length=100)
    
    #Description of the project
    description = models.TextField(max_length=3000)
    
    #The kanzleien that have access to the container
    kanzleien = models.ManyToManyField(Kanzlei, blank = True)
    
    #The documents belonging to the geschaft
    documents = models.ManyToManyField(Document, blank = True)
    
    #The form of the geschaft
    form = models.ForeignKey(Form, on_delete = models.PROTECT)
    
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Template"
        verbose_name_plural = "Templates"
    
    def download_all(self, geschaft_id):
        replace = {'/' : '_',' ' : '_', 'ä' : 'ae', 'ö' : 'oe', 'ü' : 'ue', 'Ä' : 'Ae', 'Ö' : 'Oe', 'Ü' : 'Ue'}
        
        file_in_memory = BytesIO()
        with ZipFile(file_in_memory, 'w') as zipped_file:
            for document in self.documents.all():
                if document.type == 'XML':
                    name = document.name + '.docx'
                else:
                    name = document.name + '.pdf'
                
                for key, value in replace.items():
                    name = name.replace(key, value)
                    
                zipped_file.writestr(name, document.get_doc(geschaft_id).getvalue())

            zipped_file.close()
            
        file_in_memory.seek(0)
        response = HttpResponse(FileWrapper(file_in_memory), content_type='application/x-zip-compressed')
        
        file_name = self.name
        for key, value in replace.items():
            file_name = file_name.replace(key, value)
            
        response['Content-Disposition'] = 'attachment; filename=' + file_name + '.zip'
        return response
        
        
class Container(models.Model):
    """
    Container for organising Templates
    """
    #Name of the Container
    name = models.CharField(max_length=100)
    
    #Description of the container
    description = models.TextField(max_length=3000)
    
    #The kanzleien that have access to the container
    kanzleien = models.ManyToManyField(Kanzlei, blank = True, null=True, related_name="kanzlei_templates") 
    
    #Type of the container
    type = models.CharField(max_length=100, choices = (('container', 'Enthält nur Container'), ('geschafte', 'Enthält nur Geschäfte')))
    
    #Containers contained in the container
    parent_container = models.ForeignKey("self", blank = True, null=True, on_delete=models.SET_NULL)
    
    #Templates contained in the container
    templates = models.ManyToManyField(Template, blank = True, null=True)
    
    def __str__(self):
        return self.name
    
    def list_parent_containers(self):
        container_list = [self]
        container = self
        while container.parent_container is not None:
            container = container.parent_container
            container_list.append(container)
            
        return reversed(container_list)

    @classmethod 
    def get_top_containers(cls, user):
        return sorted(cls.objects.filter(Q(parent_container=None) & (Q(kanzleien=None) | Q(kanzleien__id__exact = user.conventecuser.kanzlei.id))).all(), key=lambda x: x.name)
    
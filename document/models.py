from django.db import models
from utils.utils import custom_redirect
from create_docx.docxcreator import DocxCreator
from pdf_writer.PdfWriter import PdfWriter
import json
from django.http import HttpResponse
from django.shortcuts import redirect
from wsgiref.util import FileWrapper
from geschaft.models import Geschaft
from django.core.files.storage import DefaultStorage


class Document(models.Model):
    """
    Is attached to a Template and is responsible for the document creation
    """
    
    name = models.CharField(max_length=100)
    unique_name = models.CharField(max_length=100)
    type = models.CharField(max_length=100, choices = (('XML', 'XML'), ('PDF', 'PDF')))
    xml_file = models.FileField(upload_to='xml_files')
    pdf_file = models.FileField(upload_to='pdf_files', blank=True, null=True)
    
    display_condition = models.CharField(max_length=3000, blank=True, null=True)
    
    def __str__(self):
        return self.unique_name
    
    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"
    
    
    def download(self, geschaft_id): 
        geschaft = Geschaft.objects.get(id = geschaft_id)
        
        if self.type == 'XML':
            template = self.xml_file.read().decode("utf-8")
            context = geschaft.variables
            
            #Replace special chars
            replacements = {'&' : '&amp;', '<' : '&lt;', '>' : '&gt;'}
            for key, value in replacements.items():
                context = context.replace(key, value)
                
            data = DocxCreator().create_docx(template, [json.loads(context)])
                
            response = HttpResponse(FileWrapper(data), content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            response['Content-Disposition'] = 'attachment; filename=' + self.name.replace(' ', '_') + '.docx'
            return response
            
        elif self.type == 'PDF':
            storage = DefaultStorage()
            template = self.xml_file.read().decode("utf-8")
            self.pdf_file.open()
            pdf = PdfWriter(file = storage.open(self.pdf_file.name))
            pdf.render(template, json.loads(geschaft.variables))
            data = pdf.save()
            self.pdf_file.close()
                
            response = HttpResponse(FileWrapper(data), content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename=' + self.name.replace(' ', '_') + '.pdf'
            return response
        
    def get_doc(self, geschaft_id):
        geschaft = Geschaft.objects.get(id = geschaft_id)
        
        if self.type == 'XML':
            template = self.xml_file.read().decode("utf-8")
            context = geschaft.variables
            
            #Replace special chars
            replacements = {'&' : '&amp;', '<' : '&lt;', '>' : '&gt;'}
            for key, value in replacements.items():
                context = context.replace(key, value)
                
            data = DocxCreator().create_docx(template, [json.loads(context)])
                
            return data
            
        elif self.type == 'PDF':
            storage = DefaultStorage()
            template = self.xml_file.read().decode("utf-8")
            self.pdf_file.open()
            pdf = PdfWriter(file = storage.open(self.pdf_file.name))
            pdf.render(template, json.loads(geschaft.variables))
            data = pdf.save()
            self.pdf_file.close()
                
            return data
        
        
        
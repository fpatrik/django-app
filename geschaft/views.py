from django.shortcuts import render, redirect
from .models import Geschaft
from document.models import Document
from project_folder.models import ProjectFolder
from utils.utils import custom_redirect
from django.utils.timezone import utc
import datetime
from django.conf import settings

def geschaft_view(request, geschaft_id):
    """
    Redirects user to index if not authenticated, otherwise shows a geschaft
    """
     
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    geschaft = Geschaft.objects.get(id = geschaft_id)
    
    #Check if user hase access
    has_access = False
    for team in request.user.conventecuser.teams.all():
        for project in team.projekt_set.all():
            if geschaft.project_folder.get_project() == project:
                has_access = True
                
    try:
        if request.user.conventecuser.role == 'admin' and geschaft.project_folder.get_project().teams.first().kanzlei == request.user.conventecuser.kanzlei:
            has_access = True
    except:
        pass
            
    if not has_access:
        return redirect('index:index')
    
    if request.method == 'GET':
        #Get sorted and reverse
        sorted_by = request.GET.get('sort', 'name')
        reverse = (request.GET.get('reverse', '') == 'true')
        
        #Get active tab
        active = request.GET.get('active', 'formular')

        #Get success
        success = request.GET.get('success', 'false')
        
        #Get error
        error = request.GET.get('e', 'false')
        
        #Provide context
        context = {
            'error' : error,
            'user' : request.user,
            'geschaft'    : geschaft,
            'projekt' : geschaft.get_project(),
            'parent_folders' : geschaft.project_folder.list_parent_folders(),
            'documents' : list_all_documents(geschaft, sorted_by, reverse),
            'active' : {'nav' : 'projekte', 'tabs' : active},
            'success' : success
                }
        
        return render(request, 'geschaft.html', context)
    
    elif request.method == 'POST':
        
        #Get POST data
        #Get active tab
        active = request.POST.get('active', 'dokumente')
        
        name = request.POST.get('name', False)
        loschen = request.POST.get('loschen', False)
        
        document_id = request.POST.get('document_id', False)
        all = request.POST.get('all', False)
        
        variables = request.POST.get('variables', False)
        
        folder = request.POST.get('folder', False)
        
        if name:
            geschaft.name = name
            geschaft.save()
        
        if loschen:
            project_folder_id = geschaft.project_folder.get_project().id
            geschaft.delete()
            return redirect('project_folder:project_folder', project_folder_id = project_folder_id)
        
        if geschaft_id and document_id:
            document = Document.objects.get(id = document_id)
            
            if settings.DEBUG:
                download = document.download(geschaft_id)
                
                if download:
                    return download
                else:
                    return custom_redirect('geschaft:geschaft', geschaft_id, e = 'true', active = 'dokumente')
            
            else:
                try:
                    download = document.download(geschaft_id)
                
                    if download:
                        return download
                    else:
                        return custom_redirect('geschaft:geschaft', geschaft_id, e = 'true', active = 'dokumente')
                except:
                    return custom_redirect('geschaft:geschaft', geschaft_id, e = 'true', active = 'dokumente')
            
        if geschaft_id and all:
            if settings.DEBUG:
                return geschaft.download_all()
            else:
                try:
                    return geschaft.download_all()
                except:
                    return custom_redirect('geschaft:geschaft', geschaft_id, e = 'true', active = 'dokumente')
            
        if variables:
            geschaft.variables = variables
            geschaft.save()
            return custom_redirect('geschaft:geschaft', geschaft_id, active = 'ubersicht')
        
        if folder:
            geschaft.project_folder = ProjectFolder.objects.get(id = int(folder))
            geschaft.save()
            
        
        #Provide context
        context = {
            'user' : request.user,
            'geschaft' : geschaft,
            'projekt' : geschaft.get_project(),
            'active' : {'nav' : 'projekte', 'tabs' : active},
            'success' : 'true'
                }
        
        return render(request, 'geschaft.html', context)
    
def list_all_documents(geschaft, sorted_by, reverse):
    """
    Lists all documents of a given template (if they are required).
    List can be sorted by: name.
    """
    from jinja2 import Template
    import json
    
    documents = geschaft.template.documents.all()
    displayed_documents = []
    
    for document in documents:
        if document.display_condition is not None:
            template = Template(document.display_condition)

            try:
                if template.render(json.loads(geschaft.variables)) == 'true':
                    displayed_documents.append(document)
            except:
                pass
        else:
            displayed_documents.append(document)
    
    #Return sorted list
    if sorted_by == 'name':
        return sorted(displayed_documents, key=lambda x: x.name, reverse=reverse)
    else:
        return displayed_documents

from django.shortcuts import render
from django.shortcuts import redirect
from projekt.models import Projekt
from .models import ProjectFolder
from geschaft.models import Geschaft
from template.models import Template, Container
from django.utils.timezone import utc
from utils.utils import custom_redirect
import datetime

def project_folder_detail_view(request, project_folder_id, container_id = False):
    """
    Redirects user to index if not authenticated, otherwise shows a project
    """
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    project_folder = ProjectFolder.objects.get(id = project_folder_id)
    projekt = project_folder.get_project()
    
    #Check if user hase access
    has_access = False
    for team in request.user.conventecuser.teams.all():
        if team in projekt.teams.all():
            has_access = True
    
    try:
        if request.user.conventecuser.role == 'admin' and project_folder.get_project().teams.first().kanzlei == request.user.conventecuser.kanzlei:
            has_access = True
    except:
        pass
            
    if not has_access:
        return redirect('index:index')
    
    if request.method == 'GET':
        #Get sorted and reverse
        sorted_by = request.GET.get('sort', 'name')
        reverse = (request.GET.get('reverse', '') == 'true')
        
        container_id = request.GET.get('container', False)
        if container_id:
            container = Container.objects.get(id = int(container_id))
            parent_containers = container.list_parent_containers()
            
            if container.type == 'container':
                final_containers = sorted(container.container_set.all(), key=lambda x: x.name)
                final_templates = False
            else:
                final_containers = False
                final_templates = sorted(container.templates.all(), key=lambda x: x.name)
        else:
            
            container = False
            parent_containers = False
            final_containers = False
            final_templates = False
        
        if container and container.kanzleien.count() != 0 and not container.kanzleien.filter(id = request.user.conventecuser.kanzlei.id).exists():
            return redirect('index:index')
        
        
        #Provide context
        context = {
            'user' : request.user,
            'projekt' : projekt,
            'project_folder' : project_folder,
            'parent_folders' : project_folder.list_parent_folders(),
            'folders' : list_all_folders(project_folder, sorted_by, reverse),
            'geschafts' : list_all_geschafts(project_folder, sorted_by, reverse),
            'top_containers' : Container.get_top_containers(request.user),
            'container' : container,
            'final_containers' : final_containers,
            'final_templates' : final_templates,
            'parent_containers' : parent_containers,
            'active' : {'nav' : 'projekte', 'tabs' : 'ubersicht'}
                }
        
        return render(request, 'project_folder_view.html', context)
    
    elif request.method == 'POST':
        delete_folder = request.POST.get('delete_folder', False)
        delete_geschaft = request.POST.get('delete_geschaft', False)
        add_folder = request.POST.get('add_folder', False)
        
        add_geschaft = request.POST.get('add_geschaft', False)
        geschaft_name = request.POST.get('geschaft_name', None)
        
        if delete_folder:
            folder = ProjectFolder.objects.get(id = int(delete_folder))
            folder.delete()
            
        if delete_geschaft:
            geschaft = Geschaft.objects.get(id = int(delete_geschaft))
            geschaft.delete()
            
        if add_folder:
            ProjectFolder.create(add_folder, project_folder)
            
        if add_geschaft:
            template_temp = Template.objects.get(id = int(add_geschaft))
            if template_temp.kanzleien.count() == 0 or template_temp.kanzleien.filter(id = request.user.conventecuser.kanzlei.id).exists():
                Geschaft.create(int(add_geschaft), project_folder.id, geschaft_name)
            
        
        return redirect('project_folder:project_folder', project_folder.id)

def list_all_folders(project_folder, sorted_by, reverse):
    folders = project_folder.parent_folder_set.all()
    
    #Return sorted list
    if sorted_by == 'name':
        return sorted(folders, key=lambda x: x.name, reverse=reverse)
    elif sorted_by == 'created':
        return sorted(folders, key=lambda x: x.created, reverse=reverse)
    elif sorted_by == 'edited':
        return sorted(folders, key=lambda x: x.last_edited, reverse=reverse)
    else:
        return folders
    
def list_all_geschafts(project_folder, sorted_by, reverse):
    """
    Lists all geschafts of a given project_folder.
    """
    
    geschafts = project_folder.geschaft_set.all()
    
    #Return sorted list
    if sorted_by == 'name':
        return sorted(geschafts, key=lambda x: x.name, reverse=reverse)
    elif sorted_by == 'created':
        return sorted(geschafts, key=lambda x: x.created, reverse=reverse)
    elif sorted_by == 'edited':
        return sorted(geschafts, key=lambda x: x.last_edited, reverse=reverse)
    elif sorted_by == 'type':
        return sorted(geschafts, key=lambda x: x.template.name, reverse=reverse)
    else:
        return geschafts
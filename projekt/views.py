from django.shortcuts import render, redirect
from utils.utils import custom_redirect
from django.utils.timezone import utc
import datetime
import pytz

from .models import Projekt
from team.models import Team
from template.models import Template
from geschaft.models import Geschaft

def projekt_overview_view(request):
    """
    Redirects user to if not authenticated, otherwise shows all projects
    """
     
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    if request.method == 'GET':
        #Get sorting method from GET, set default to 'name' and False
        sorted_by = request.GET.get('sort', 'name')
        reverse = (request.GET.get('reverse', '') == 'true') 
        
        #Get active tab
        active = request.GET.get('active', 'aktuelle')

        #Get success
        success = request.GET.get('success', 'false')
        if success != 'false':
            success = Projekt.objects.get(id = int(success))
        
        #Provide context
        context = {
            'user' : request.user,
            'projects'    : list_all_projects(request.user, sorted_by, reverse, active),
            'active' : {'nav' : 'projekte', 'tabs' : active},
            'success' : success
                }
        
        return render(request, 'projekt_overview.html', context)
    
    elif request.method == 'POST':
        #Get POST data
        name = request.POST.get('name', False)
        description = request.POST.get('description', False)
        team = request.POST.get('team', False)
        
        
        if name and description and team and (request.user.conventecuser.role == 'manager' or request.user.conventecuser.role == 'admin'):
            projekt = Projekt.create(name, description, int(team))
            return custom_redirect('projekt:projekt_detail', projekt.id , active = 'teams')
        
        
        return redirect('projekt:projekt')
        
        


def list_all_projects(user, sorted_by, reverse, active):
    """
    Lists all projects a given user has access to.
    List can be sorted by: name, created, completed.
    """
    
    #Set completed to True/False
    if active == 'aktuelle':
        completed = False
    else:
        completed = True
    
    
    #Take all projects of a user
    if user.conventecuser.role == 'admin':
        teams = user.conventecuser.kanzlei.team_set.all()
    else:
        teams = user.conventecuser.teams.all()
        
    projects = Projekt.objects.none()
    for team in teams:
        projects = projects | team.projekt_set.filter(completed = completed)

    projects = projects.distinct()
        
    
    #Return sorted list
    if sorted_by == 'name':
        return sorted(projects, key=lambda x: x.name, reverse=reverse)
    elif sorted_by == 'created':
        return sorted(projects, key=lambda x: x.created, reverse=reverse)
    elif sorted_by == 'completed_at':
        return sorted(projects, key=lambda x: x.completed_at, reverse=reverse)
    else:
        return projects
    
def projekt_detail_view(request, projekt_id):
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
    
    projekt = Projekt.objects.get(id = projekt_id)
    
    #Check if user hase access
    has_access = False
    for team in request.user.conventecuser.teams.all():
        if team in projekt.teams.all():
            has_access = True
            
    try:
        if request.user.conventecuser.role == 'admin' and projekt.project_folder.get_project().teams.first().kanzlei == request.user.conventecuser.kanzlei:
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
        active = request.GET.get('active', 'ubersicht')

        #Get success
        success = request.GET.get('success', 'false')
        
        #Provide context
        context = {
            'user' : request.user,
            'projekt'    : projekt,
            'project_folder' : projekt.project_folder,
            'teams_active' : list_all_teams(request, projekt, active = True),
            'teams_passive' : list_all_teams(request, projekt, active = False),
            'templates' : list_all_templates(sorted_by, reverse),
            'active' : {'nav' : 'projekte', 'tabs' : active},
            'success' : success
                }
        
        return render(request, 'projekt_detail.html', context)
    
    elif request.method == 'POST':
        
        #Get POST data
        #Get active tab
        active = request.POST.get('active', 'ubersicht')
        
        name = request.POST.get('name', False)
        description = request.POST.get('description', False)
        abschliessen = request.POST.get('abschliessen', False)
        loschen = request.POST.get('loschen', False)
        
        add_geschaft_id = request.POST.get('add_geschaft_id', False)
        projekt_id = request.POST.get('projekt_id', False)
        
        add_team = request.POST.get('add_team', False)
        remove_team = request.POST.get('remove_team', False)
        change_lead = request.POST.get('change_lead', False)
        
        if name:
            projekt.name = name
            projekt.save()
        
        if description:
            projekt.description = description
            projekt.save()
            
        if add_team and change_lead:
            projekt.teams.add(Team.objects.get(id=int(add_team)))
            projekt.lead = Team.objects.get(id=int(change_lead))
            projekt.save()
            return custom_redirect('projekt:projekt_detail', projekt.id , active = 'teams')
            
        if add_team:
            projekt.teams.add(Team.objects.get(id=int(add_team)))
            projekt.save()
            return custom_redirect('projekt:projekt_detail', projekt.id , active = 'teams')
        
        if remove_team:
            projekt.teams.remove(Team.objects.get(id=int(remove_team)))
            projekt.save()
            return custom_redirect('projekt:projekt_detail', projekt.id , active = 'teams')
        
        if change_lead:
            projekt.lead = Team.objects.get(id=int(change_lead))
            projekt.save()
            return custom_redirect('projekt:projekt_detail', projekt.id , active = 'teams')
            
        if abschliessen:
            if abschliessen == 'true':
                projekt.completed = True
                projekt.completed_at = datetime.datetime.now(pytz.timezone('Europe/Zurich'))
            else:
                projekt.completed = False
            projekt.save()
            
        if loschen:
            projekt.delete()
            return redirect('projekt:projekt')
        
        if add_geschaft_id and projekt_id:
            geschaft = Geschaft.create(add_geschaft_id, projekt_id)
            geschaft.save()
            
        
        
        #Provide context
        context = {
            'user' : request.user,
            'projekt' : projekt,
            'project_folder' : projekt.project_folder,
            'templates' : list_all_templates(None, None),
            'active' : {'nav' : 'projekte', 'tabs' : active},
            'success' : 'true'
                }
        
        return render(request, 'projekt_detail.html', context)
    
def list_all_templates(sorted_by, reverse):
    """
    Lists all geschafts of a given project.
    """
    
    templates = Template.objects.all()
    
    #Return sorted list
    if sorted_by == 'name':
        return sorted(templates, key=lambda x: x.name, reverse=reverse)
    else:
        return templates

def list_all_teams(request, projekt, active = True):
    if active:
        return projekt.teams.all()
    else:
        exclude_teams = projekt.teams.all()
        return request.user.conventecuser.kanzlei.team_set.exclude(pk__in=exclude_teams)
from django.shortcuts import render
from django.shortcuts import redirect
from django.utils.timezone import utc
from utils.utils import custom_redirect
import datetime

from .models import Team
from login.models import ConventecUser

def team_view(request):
    """
    Redirects user to if not authenticated, otherwise shows team view
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
        #Get active tab
        active = request.GET.get('active', 'ubersicht')
        
        #Provide name of user and items the user has access to
        context = {
            'user' : request.user,
            'active' : {'nav':'teams', 'tabs' : active}
                }
        
        return render(request, 'team_overview.html', context)
    
    elif request.method == 'POST':
        
        if not request.user.conventecuser.role == 'admin':
            return redirect('index:index')
        
        name = request.POST.get('name', False)
        description = request.POST.get('description', False)
        
        if name and description:
            try:
                team = Team.objects.filter(kanzlei = request.user.conventecuser.kanzlei).get(name = name)
                return custom_redirect('team:team_detail', team.id)
            except Team.DoesNotExist:
                pass
            
            new_team = Team.create(name, description, request.user.conventecuser.kanzlei)
            request.user.conventecuser.teams.add(new_team)
            new_team.save()
            return redirect('team:team_detail', new_team.id )
        else:
            redirect('team:team')
    
def team_detail_view(request, team_id):
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
    
    team = Team.objects.get(id = team_id)
    
    #Check if user has access
    has_access = False
    if team.kanzlei.id == request.user.conventecuser.kanzlei.id:
            has_access = True
            
    if not has_access:
        return redirect('index:index')
    
    if request.method == 'GET':
        #Get sorted and reverse
        sorted_by1 = request.GET.get('sort1', 'f_name')
        reverse1 = (request.GET.get('reverse1', '') == 'true')
        sorted_by2 = request.GET.get('sort2', 'f_name')
        reverse2 = (request.GET.get('reverse2', '') == 'true')

        
        #Provide context
        context = {
            'user' : request.user,
            'team'    : team,
            'n_members' : list_all_n_members(team,sorted_by1, reverse1),
            'members' : list_all_members(team, sorted_by2, reverse2),
            'active' : {'nav' : 'teams'}
                }
        
        return render(request, 'team_detail.html', context)
    
    elif request.method == 'POST':
        if not request.user.conventecuser.role == 'admin':
            return redirect('index:index')
        
        name = request.POST.get('name', False)
        description = request.POST.get('description', False)
        add = request.POST.get('add', False)
        remove = request.POST.get('remove', False)
        loschen = request.POST.get('loschen', False)
        
        if name:
            team.name = name
            team.save()
        
        if description:
            team.description = description
            team.save()
            
        if add:
            c_user = ConventecUser.objects.get(user_id = int(add))
            if c_user.kanzlei.id == request.user.conventecuser.kanzlei.id:
                c_user.teams.add(team)
            
            c_user.save()
        
        if remove:
            c_user = ConventecUser.objects.get(user_id = int(remove))
            if c_user.kanzlei.id == request.user.conventecuser.kanzlei.id:
                c_user.teams.remove(team)
                
            c_user.save()
            
        if loschen:
            team.delete()
            return redirect('team:team')
            
        #Provide context
        context = {
            'user' : request.user,
            'team'    : team,
            'n_members' : list_all_n_members(team,'f_name', False),
            'members' : list_all_members(team, 'f_name', False),
            'active' : {'nav' : 'teams'}
                }
        
        return render(request, 'team_detail.html', context)
    
def list_all_members(team, sorted_by, reverse):
    """
    Lists all users of a team.
    List can be sorted by: name, role, position.
    """

    users = team.conventecuser_set.all()
    
    #Return sorted list
    if sorted_by == 'f_name':
        return sorted(users, key=lambda x: x.user.first_name, reverse=reverse)
    elif sorted_by == 'l_name':
        return sorted(users, key=lambda x: x.user.last_name, reverse=reverse)
    elif sorted_by == 'position':
        return sorted(users, key=lambda x: x.position, reverse=reverse)
    elif sorted_by == 'role':
        return sorted(users, key=lambda x: x.role, reverse=reverse)
    else:
        return users
    
def list_all_n_members(team, sorted_by, reverse):
    """
    Lists all users of a kanzlei which are not in a team.
    List can be sorted by: name, role, position.
    """
    members = team.conventecuser_set.all()
    users = team.kanzlei.conventecuser_set.all().exclude(pk__in=members)
    
    #Return sorted list
    if sorted_by == 'f_name':
        return sorted(users, key=lambda x: x.user.first_name, reverse=reverse)
    elif sorted_by == 'l_name':
        return sorted(users, key=lambda x: x.user.last_name, reverse=reverse)
    elif sorted_by == 'position':
        return sorted(users, key=lambda x: x.position, reverse=reverse)
    elif sorted_by == 'role':
        return sorted(users, key=lambda x: x.role, reverse=reverse)
    else:
        return users
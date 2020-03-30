from django.shortcuts import render
from django.shortcuts import redirect
from django.utils.timezone import utc
from utils.utils import custom_redirect
import datetime

from .models import Kanzlei
from login.models import ConventecUser

from django.contrib.auth.models import User

def kanzlei_view(request, kanzlei_id):
    """
    Redirects user to if not authenticated, otherwise shows kanzlei view
    """
     
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    #Check if user is admin
    if not request.user.conventecuser.role == 'admin':
            return redirect('index:index')
    
    #Get Kanzlei
    kanzlei = Kanzlei.objects.get(id = int(kanzlei_id))
    
    #Redirect if user not in kanzlei
    if request.user.conventecuser.kanzlei.id != kanzlei.id:
        return redirect('index:index')

    
    #Provide name of user and items the user has access to
    context = {
        'user' : request.user,
        'active' : {'nav' : 'kanzlei'}
            }
    
    return render(request, 'kanzlei.html', context)

def kanzlei_user(request, kanzlei_id):
    """
    Redirects user to if not authenticated, otherwise shows users of kanzlei
    """
     
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    #Get Kanzlei
    kanzlei = Kanzlei.objects.get(id = kanzlei_id)
    
    #Redirect if user not in kanzlei
    if request.user.conventecuser.kanzlei.id != kanzlei.id:
        return redirect('index:index')
    
    if request.method == 'GET':
        #Get sorted and reverse
        sorted_by = request.GET.get('sort', 'l_name')
        reverse = (request.GET.get('reverse', '') == 'true')
        
        vorname = request.GET.get('vorname', '')
        nachname = request.GET.get('nachname', '')
        email = request.GET.get('email', '')
        position = request.GET.get('position', '')
        role = request.GET.get('role', '')
        
        e = request.GET.get('e', False)

    
        #Provide name of user and items the user has access to
        context = {
            'user' : request.user,
            'kanzlei' : request.user.conventecuser.kanzlei,
            'members' : list_all_members(request, sorted_by, reverse),
            'active' : {'nav' : 'kanzlei'},
            'vorname' : vorname,
            'nachname' : nachname,
            'email' : email,
            'position' :position,
            'role' : role,
            'e' : e
                }
        
        return render(request, 'kanzlei_user.html', context)
    
    elif request.method == 'POST':
        if not request.user.conventecuser.role == 'admin':
            return redirect('index:index')
        
        vorname = request.POST.get('vorname', False)
        nachname = request.POST.get('nachname', False)
        email = request.POST.get('email', False)
        position = request.POST.get('position', False)
        role = request.POST.get('role', False)
        pw1 = request.POST.get('pw1', False)
        pw2 = request.POST.get('pw2', False)
        
        remove = request.POST.get('remove', False)
        
        if vorname and nachname and email and position and role and pw1 and pw2 and pw1 == pw2:
            # Check if email is already taken

            try:
                user = User.objects.get(email = email)
                return custom_redirect('kanzlei:kanzlei_user', kanzlei.id, e = 'email', vorname = vorname, nachname = nachname, position = position, role = role, scroll_to = 'erstellen')
            except User.DoesNotExist:
                pass
            
            new_user = ConventecUser.create(vorname, nachname, email, position, role, pw1, kanzlei)
        
        if remove:
            user = User.objects.get(id = int(remove))
            if user.conventecuser.kanzlei.id == kanzlei.id:
                user.delete()
                
        return redirect('kanzlei:kanzlei_user', kanzlei.id)
    
def kanzlei_user_detail(request, kanzlei_id, user_id):
    """
    Redirects user to if not authenticated, otherwise shows users of kanzlei
    """
     
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    #Get Kanzlei
    kanzlei = Kanzlei.objects.get(id = int(kanzlei_id))
    
    #Get User
    user = User.objects.get(id = int(user_id))
    
    #Redirect if user not in kanzlei
    if request.user.conventecuser.kanzlei.id != kanzlei.id or user.conventecuser.kanzlei.id != kanzlei.id:
        return redirect('index:index')
    
    if request.method == 'GET':
        
        s = request.GET.get('s', False)

        #Provide name of user and items the user has access to
        context = {
            'user' : user,
            'kanzlei' : request.user.conventecuser.kanzlei,
            'active' : {'nav' : 'kanzlei'},
            's' : s
                }
        
        return render(request, 'kanzlei_user_detail.html', context)
    
    elif request.method == 'POST':
        
        vorname = request.POST.get('vorname', False)
        nachname = request.POST.get('nachname', False)
        email = request.POST.get('email', False)
        position = request.POST.get('position', False)
        role = request.POST.get('role', False)
        pw1 = request.POST.get('pw1', False)
        pw2 = request.POST.get('pw2', False)
        
        if vorname:
            user.first_name = vorname
            user.save()
            
        if nachname:
            user.last_name = nachname
            user.save()
            
        if email:
            if email != user.email:
                try:
                    user = User.objects.get(email = email)
                    return custom_redirect('kanzlei:kanzlei_user_detail', kanzlei.id, user.id, s = 'fail', scroll_to = 'bearbeiten')
                except User.DoesNotExist:
                    pass
            user.email = email
            user.save()
            
        if pw1 and pw2 and pw1 == pw2:
            user.set_password(pw1)
            user.save()
            
        if position:
            user.conventecuser.position = position
            user.conventecuser.save()
            
        if role:
            user.conventecuser.role = role
            user.conventecuser.save()
        
                
        return custom_redirect('kanzlei:kanzlei_user_detail', kanzlei.id, user.id, s = 'success', scroll_to = 'bearbeiten')

def list_all_members(request, sorted_by, reverse):
    """
    Lists all users of a kanzlei.
    List can be sorted by: name, role, position.
    """
    users = request.user.conventecuser.kanzlei.conventecuser_set.all()
    
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

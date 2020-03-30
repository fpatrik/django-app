from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.utils.timezone import utc
from utils.utils import custom_redirect
import datetime
from django.views.decorators.debug import sensitive_post_parameters
# Create your views here.

@sensitive_post_parameters('pw_old', 'pw_new_1', 'pw_new_2')
def settings_view(request):
    """
    Redirects logged-in users to their home panel.
    Otherwise renders a login page in case of a get request. In case of a post request it processes the login,
    redirects in case of success and displays an error in case of failure.
    """
    from django.shortcuts import render
    from django.shortcuts import redirect
    
    
    #Redirect not logged-in user
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    #GET-request
    if request.method == 'GET':
        #Show settings page
        return render_settings_view(request)
    
    #POST-request means change of data
    else:
        pw_old = request.POST['pw_old']
        pw_new_1 = request.POST['pw_new_1']
        pw_new_2 = request.POST['pw_new_2']
        
        if request.user.check_password(pw_old) and pw_new_1 == pw_new_2:
            username = request.user.username
            request.user.set_password(pw_new_1)
            request.user.save()
            user = authenticate(request, username=username, password=pw_new_1)
            login(request, user)
            return render_settings_view(request, error=False, message="Passwort geändert")
        else:
            #Show login page with error message
            return render_settings_view(request, error=True, message="Altes Passwort ist falsch oder neue Passwörter nicht identisch")
            
        


def render_settings_view(request, error = False, message = None):
    """
    Renders the settings page with optional error message.
    """
    from django.shortcuts import render
    context = {
            'user' : request.user,
            'error' : error,
            'message' : message,
            'active' : {'nav':'einstellungen'}
            }
    
    return render(request, 'settings.html', context)
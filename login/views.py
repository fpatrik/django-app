from django.shortcuts import render
from django.views.decorators.debug import sensitive_variables, sensitive_post_parameters
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from utils.utils import custom_redirect
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
import logging

logger = logging.getLogger(__name__)

# Create your views here.
@sensitive_variables()
def login_view(request):
    """
    Redirects logged-in users to their home panel.
    Otherwise renders a login page in case of a get request. In case of a post request it processes the login,
    redirects in case of success and displays an error in case of failure.
    """
    from django.shortcuts import render
    from django.shortcuts import redirect
    
    #Redirect logged-in user
    if request.user.is_authenticated:
        return redirect('projekt:projekt')
    
    #GET-request means no login attempt yet
    if request.method == 'GET':
        #Show login page without error message
        return render_login_view(request)
    
    #POST-request means login attempt occurred
    else:
        if authenticate_user(request):
            if request.user.conventecuser.accepted_tou:
                return redirect('projekt:projekt')
            else:
                return redirect('terms:terms')
        else:
            #Show login page with error message
            return render_login_view(request, "Falsche E-Mail Adresse oder Passwort.")
            
        


def render_login_view(request, error = None):
    """
    Renders the login page with optional error message.
    """
    from django.shortcuts import render
    context = {
            'error' : error,
            }
    
    return render(request, 'login.html', context)

@sensitive_variables()
def authenticate_user(request):
    """
    Authenticates and logges the user in. Returns True in case of success, False otherwise.
    """
    from django.contrib.auth import authenticate, login
    
    #Get email and password from POST
    email = request.POST['email']
    
    try:
        username = User.objects.get(email = email).username
    except User.DoesNotExist:
        return False
    
    password = request.POST['password']

    #Authenticate user
    user = authenticate(request, username=username, password=password)
    
    #Return True if user is authenticated and logged in and False otherwise
    if user is not None:
        login(request, user)
        return True
    else:
        return False
    
def login_error_view(request):
    """
    Renders an error for the case where no jsavascript/cookies are enabled
    """
    from django.shortcuts import render
    
    e = request.GET.get('e', False)
    
    context = {
            'e' : e,
            }
    
    return render(request, 'login_error.html', context)

@sensitive_variables()
def login_reset_view(request):
    """
    Allows resetting the password
    """
    
    if request.method == 'GET':
        token = request.GET.get('token', False)
        email = request.GET.get('email', False)
        s = request.GET.get('s', False)
        init = request.GET.get('init', False)
        
        
        context = {
            'token' : token,
            'email' : email,
            'success' : s,
            'init' : init
            }
    
        return render(request, 'login_reset.html', context)
        
    elif request.method == 'POST':
        email = request.POST.get('email', False)
        token = request.POST.get('token', False)
        pw1 = request.POST.get('pw1', False)
        pw2 = request.POST.get('pw2', False)
        
        #Get the user or throw error
        try:
            user = User.objects.get(email = email)
             
        except User.DoesNotExist:
            return custom_redirect('login:reset', s = 'ne')
            
        if token:
            if not pw1 or not pw2 or pw1 != pw2:
                return custom_redirect('login:reset', s = 'ms', email=email, token=token)
            
            else:
                if default_token_generator.check_token(user, token):
                    user.set_password(pw1)
                    user.save()
                    return custom_redirect('login:reset', s = 's')
                else:
                    return custom_redirect('login:reset', s = 'it', email=email)
        
        else:
            generated_token = default_token_generator.make_token(user)
            num_sent = send_mail('Conventec Support', 'Guten Tag ' + user.get_full_name() + '\n\nSie können Ihr Passwort mit diesem Link setzen:\nhttps://app.conventec.ch/login/reset?email=' + user.email + '&token=' + generated_token + '\n\nIhr Conventec Team', 'support@conventec.ch', [user.email])
            logger.info('Sent ' + str(num_sent) + ' pw reset mails to: ' + user.email)
            
            return custom_redirect('login:reset', s = 'ms')
            
            
        
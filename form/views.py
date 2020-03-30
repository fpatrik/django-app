from django.shortcuts import render
from django.shortcuts import redirect
from geschaft.models import Geschaft
from django.middleware import csrf
from django.utils.timezone import utc
from utils.utils import custom_redirect
import datetime

def form_view(request):
    """
    Shows the form of a Geschaeft
    """
    
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    geschaft_id = request.POST.get('geschaft_id', False)
    geschaft = Geschaft.objects.get(id = geschaft_id)
    
    form = geschaft.template.form
    
    context = {
        'geschaft' : geschaft,
        'form' : form.js_file.read().decode("utf-8"),
        'csrf' : csrf.get_token(request)
            }
    
    return render(request, 'form.html', context)
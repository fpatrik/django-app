from django.shortcuts import render, redirect
from django.utils.timezone import utc
from utils.utils import custom_redirect
import datetime

def terms_view(request):
    
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    if request.method == 'GET':
        #REMOVE FOR PRODUCTION
        reset = request.GET.get('reset', False)
        if reset:
            request.user.conventecuser.accepted_tou = False
            request.user.conventecuser.save()
        
        #language
        lang = request.GET.get('lang', False)
        
        #Provide context
        context = {
            'user' : request.user,
            'lang' : lang
        }
            
        return render(request, 'terms.html', context)
    
    elif request.method == 'POST':
        cb1 = request.POST.get('cb1', False)
        cb2 = request.POST.get('cb2', False)
        
        if cb1 == 'on' and cb2 == 'on':
            request.user.conventecuser.accepted_tou = True
            request.user.conventecuser.save()
            return redirect('projekt:projekt')
        else:
            return redirect('terms:terms')
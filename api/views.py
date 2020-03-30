from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils.timezone import utc
from utils.utils import custom_redirect
import datetime

from conventec_api.conventec_api import ConventecApi

def api_dispatcher(request):
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    #Get the type of the request
    t = request.GET.get('t', None)
    if t is None:
        return JsonResponse({'status' : 'fail', 'message' : 'No request type specified.'})

    #Handle search firm request
    if t == 'search':
        q = request.GET.get('q', None)
        if q is None:
            return JsonResponse({'status' : 'fail', 'message' : 'No query string given.'})
            
        api = ConventecApi()
        return JsonResponse(api.list_by_name(q))
    
    #Handle full info by uid request
    elif t == 'uid':
        q = request.GET.get('q', None)
        if q is None:
            return JsonResponse({'status' : 'fail', 'message' : 'No query string given.'})
            
        api = ConventecApi()
        return JsonResponse(api.get_by_uid_full(q))
    #Grundbuch addres search
    elif t == 'address':
        q = request.GET.get('q', None)
        if q is None:
            return JsonResponse({'status' : 'fail', 'message' : 'No query string given.'})
            
        api = ConventecApi()
        return JsonResponse(api.get_coords_by_address(q), safe = False)
    #Grundbuch addres search
    elif t == 'coords':
        q = request.GET.get('q', None)
        if q is None:
            return JsonResponse({'status' : 'fail', 'message' : 'No query string given.'})
            
        api = ConventecApi()
        return JsonResponse(api.get_auszug_by_coords(q), safe = False)
    else:
        return JsonResponse({'status' : 'fail', 'message' : 'Unknown request type.'})
    
    
        

# Create your views here.
def zefix_view(request):
    from conventec_zefix import zefix_request
    
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    q = request.GET.get('q', None)
    
    if q is not None:
        result = zefix_request.get_by_name_full(q)
        return JsonResponse(result)
    else:
        return JsonResponse({'ERROR' : 'bad query'}, status=500)
        
def hreg_view(request):
    from conventec_handelsregister.handelsregister_api_2 import handelsregisterAPI
    
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    q = request.GET.get('q', None)
    c = request.GET.get('c', 'zh')
    
    if q is not None:
        api = handelsregisterAPI(c)
        result = api.get_by_chid(q)
        if result is not None:
            return JsonResponse(result)
        else:
            return JsonResponse({'ERROR' : 'connection to hreg failed'}, status=500)
    else:
        return JsonResponse({'ERROR' : 'bad query'}, status=500)


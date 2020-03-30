from django.contrib.auth import logout
from django.shortcuts import redirect

def logout_view(request):
    """
    Logs user out and redirects to index.
    """
    logout(request)
    return redirect('index:index')

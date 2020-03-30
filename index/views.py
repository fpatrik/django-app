from django.shortcuts import render

# Create your views here.
def index_view(request, error = None):
    """
    Renders the index of the page
    """
    from django.shortcuts import render
    return render(request, 'index.html')

from django.conf.urls import url
from . import views

app_name = 'terms'

urlpatterns = [
    url(r'', views.terms_view, name='terms'),
]
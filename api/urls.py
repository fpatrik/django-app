from django.conf.urls import url
from . import views

app_name = 'api'

urlpatterns = [
    url(r'', views.api_dispatcher, name='api_dispatcher'),
]
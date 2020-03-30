from django.conf.urls import url
from . import views

app_name = 'form'

urlpatterns = [
    url(r'', views.form_view, name='form'),
]
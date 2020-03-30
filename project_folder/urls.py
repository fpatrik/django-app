from django.conf.urls import url
from . import views

app_name = 'project_folder'

urlpatterns = [
    url(r'/(?P<project_folder_id>.+)$', views.project_folder_detail_view, name='project_folder')
]
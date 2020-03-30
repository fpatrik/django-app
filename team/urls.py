from django.conf.urls import url
from . import views

app_name = 'team'

urlpatterns = [
    url(r'detail/(?P<team_id>.+)$', views.team_detail_view, name='team_detail'),
    url(r'', views.team_view, name='team'),
]
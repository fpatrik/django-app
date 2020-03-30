from django.conf.urls import url
from . import views

app_name = 'geschaft'

urlpatterns = [
    url(r'(?P<geschaft_id>.+)$', views.geschaft_view, name='geschaft'),
]
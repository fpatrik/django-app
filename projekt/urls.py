from django.conf.urls import url
from . import views

app_name = 'projekt'

urlpatterns = [
    url(r'detail/(?P<projekt_id>.+)$', views.projekt_detail_view, name='projekt_detail'),
    url(r'', views.projekt_overview_view, name='projekt'),
]
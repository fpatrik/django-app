from django.conf.urls import url
from . import views

app_name = 'kanzlei'

urlpatterns = [
    url(r'(?P<kanzlei_id>.+)/user/(?P<user_id>.+)$', views.kanzlei_user_detail, name='kanzlei_user_detail'),
    url(r'(?P<kanzlei_id>.+)/user$', views.kanzlei_user, name='kanzlei_user'),
    url(r'(?P<kanzlei_id>.+)$', views.kanzlei_view, name='kanzlei')
]
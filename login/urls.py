from django.conf.urls import url
from . import views

app_name = 'login'

urlpatterns = [
    url(r'^$', views.login_view, name='login'),
    url(r'error$', views.login_error_view, name='error'),
    url(r'reset$', views.login_reset_view, name='reset'),
]
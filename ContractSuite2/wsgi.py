"""
WSGI config for ContractSuite2 project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""
import site
site.addsitedir('/var/www/Conventec/conventec_backend/ContractSuite2/cvtenv/lib/python3.5/site-packages')
import os
import sys
sys.path.append('/var/www/Conventec/conventec_backend/ContractSuite2')
sys.path.append('/var/www/Conventec')
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ContractSuite2.settings")

application = get_wsgi_application()

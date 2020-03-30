from django.contrib import admin
from .models import Projekt

class ProjektAdmin(admin.ModelAdmin):
    pass

admin.site.register(Projekt, ProjektAdmin)
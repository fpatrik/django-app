from django.contrib import admin
from .models import Geschaft

class GeschaftAdmin(admin.ModelAdmin):
    pass

admin.site.register(Geschaft, GeschaftAdmin)
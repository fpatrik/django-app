from django.contrib import admin
from .models import Kanzlei

class KanzleiAdmin(admin.ModelAdmin):
    pass

admin.site.register(Kanzlei, KanzleiAdmin)

from django.contrib import admin
from .models import Form

class FormAdmin(admin.ModelAdmin):
    pass

admin.site.register(Form, FormAdmin)

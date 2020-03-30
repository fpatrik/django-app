from django.contrib import admin
from .models import Template, Container

class TemplateAdmin(admin.ModelAdmin):
    pass

admin.site.register(Template, TemplateAdmin)
admin.site.register(Container, TemplateAdmin)

from django.contrib import admin

# Register your models here.
from .models import ProjectFolder

class ProjectFolderAdmin(admin.ModelAdmin):
    pass

admin.site.register(ProjectFolder, ProjectFolderAdmin)
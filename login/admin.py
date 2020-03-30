from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import ConventecUser

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class ConventecInline(admin.StackedInline):
    model = ConventecUser
    can_delete = False

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (ConventecInline, )
    

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

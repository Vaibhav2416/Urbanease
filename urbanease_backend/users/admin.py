from django.contrib import admin
from .models import AppUser,ProviderProfile

class AppUserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "name", "phone", "role", "is_active", "is_staff")
    search_fields = ("email", "name")
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display=('id','user')


admin.site.register(ProviderProfile,ProviderProfileAdmin)

admin.site.register(AppUser, AppUserAdmin)

from django.contrib import admin
from .models import ServiceCategory, Service

class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']
    search_fields = ['name']
    ordering = ['id']

class ServiceAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'category', 'base_price',
        'duration_in_minutes', 'is_active'
    ]
    list_filter = ['is_active', 'category']
    search_fields = ['name', 'description']
    ordering = ['-id']

admin.site.register(ServiceCategory, ServiceCategoryAdmin)
admin.site.register(Service, ServiceAdmin)

from django.contrib import admin
from .models import Booking

class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'service', 'customer', 'scheduled_at',
        'status', 'created_at'
    ]
    list_filter = ['status', 'scheduled_at']
    search_fields = [
        'service__name', 'customer__email', 'address'
    ]
    ordering = ['-created_at']
    readonly_fields = ['created_at']

admin.site.register(Booking, BookingAdmin)

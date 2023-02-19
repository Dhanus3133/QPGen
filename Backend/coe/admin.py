from django.contrib import admin
from .models import *


@admin.register(COE)
class COEModelAdmin(admin.ModelAdmin):
    list_filter = ("active",)
    list_display = (
        "coe",
        "active",
    )
    search_fields = (
        "coe",
        "active",
    )
    raw_id_fields = ('coe',)

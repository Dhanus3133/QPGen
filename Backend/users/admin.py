from django.contrib import admin
from .models import NewUser, User
from django.contrib.auth.admin import UserAdmin as UserAdmin_
from django.utils.translation import gettext_lazy as _


class CustomUserAdmin(UserAdmin_):
    list_display = ("email", "first_name", "last_name", "is_staff")
    search_fields = ("first_name", "last_name", "email")
    ordering = ("email",)
    add_fieldsets = (
        (
            "Personal Info",
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )


admin.site.register(User, CustomUserAdmin)


@admin.register(NewUser)
class NewUserModelAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "email",
        "email_verified",
        "approved",
    )
    search_fields = (
        "email",
        "first_name",
        "last_name",
    )
    list_filter = ("email_verified",)
    readonly_fields = (
        "email",
        "password",
        "email_verified",
        "email_secret",
    )
    list_editable = ("approved",)

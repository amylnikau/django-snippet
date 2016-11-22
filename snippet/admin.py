from django.contrib import admin
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import User, Group
from guardian.admin import GuardedModelAdmin

from csds.utils import admin_site
from snippet.models import Snippet


@admin.register(Snippet, site=admin_site)
class SnippetAdmin(GuardedModelAdmin):
    pass


admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)

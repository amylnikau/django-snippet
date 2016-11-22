from django.http import Http404
from rest_framework import permissions
from rest_framework.compat import guardian
from rest_framework.compat import is_authenticated
from rest_framework.filters import BaseFilterBackend
from rest_framework.permissions import SAFE_METHODS

from authentication.utils import otp_verify


class DjangoObjectPermissionsFilter(BaseFilterBackend):
    """
    A filter backend that limits results to those where the requesting user
    has read object level permissions.
    """

    def __init__(self):
        assert guardian, 'Using DjangoObjectPermissionsFilter, but django-guardian is not installed'

    perms_format = ['%(app_label)s.view_%(model_name)s', '%(app_label)s.change_%(model_name)s']

    def filter_queryset(self, request, queryset, view):
        user = request.user
        model_cls = queryset.model
        kwargs = {
            'app_label': model_cls._meta.app_label,
            'model_name': model_cls._meta.model_name
        }
        perms = [perm_format % kwargs for perm_format in self.perms_format]
        extra = {'accept_global_perms': False,
                 'any_perm': True}

        return guardian.shortcuts.get_objects_for_user(user, perms, queryset, **extra)


class DjangoObjectPermissions(permissions.DjangoObjectPermissions):
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s', '%(app_label)s.change_%(model_name)s'],
        'OPTIONS': ['%(app_label)s.view_%(model_name)s', '%(app_label)s.change_%(model_name)s'],
        'HEAD': ['%(app_label)s.view_%(model_name)s', '%(app_label)s.change_%(model_name)s'],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }

    def has_object_permission(self, request, view, obj):
        if hasattr(view, 'get_queryset'):
            queryset = view.get_queryset()
        else:
            queryset = getattr(view, 'queryset', None)

        assert queryset is not None, (
            'Cannot apply DjangoObjectPermissions on a view that '
            'does not set `.queryset` or have a `.get_queryset()` method.'
        )

        model_cls = queryset.model
        user = request.user

        perms = self.get_required_object_permissions(request.method, model_cls)

        if not any(user.has_perm(perm, obj) for perm in perms):
            # If the user does not have permissions we need to determine if
            # they have read permissions to see 403, or not, and simply see
            # a 404 response.

            if request.method in SAFE_METHODS:
                # Read permissions already checked and failed, no need
                # to make another lookup.
                raise Http404

            # read_perms = self.get_required_object_permissions('GET', model_cls)
            # if not user.has_perms(read_perms, obj):
            #     raise Http404

            # Has read permissions.
            return False

        return True

    def has_permission(self, request, view):
        return True


class IsOTPAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        otp_code = request.data.pop('otp_code', 0)
        return (request.user and
                is_authenticated(request.user) and
                otp_verify(request.user, otp_code))


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (request.user and
                is_authenticated(request.user) and
                obj.owner == request.user)

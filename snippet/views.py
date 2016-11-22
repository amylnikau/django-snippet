from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from guardian.models import UserObjectPermission
from guardian.shortcuts import assign_perm, get_users_with_perms, get_perms, get_objects_for_user, get_perms_for_model
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import UserPermission
from snippet.models import Snippet
from snippet.permissions import DjangoObjectPermissions, DjangoObjectPermissionsFilter, IsOwner, IsOTPAuthenticated
from snippet.serializers import SnippetSerializer, SnippetShareSerializer, SnippetListSerializer


class SnippetCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SnippetSerializer

    def perform_create(self, serializer):
        user = self.request.user
        snippet = serializer.save(owner=user)
        assign_perm('change_snippet', user, snippet)


class SnippetView(RetrieveUpdateDestroyAPIView):
    serializer_class = SnippetSerializer
    queryset = Snippet.objects.all()

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return IsOwner(),
        else:
            return DjangoObjectPermissions(),

    def perform_destroy(self, instance):
        UserObjectPermission.objects.filter(object_pk=instance.pk).delete()
        super().perform_destroy(instance)


class SnippetListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SnippetListSerializer
    filter_backends = (DjangoObjectPermissionsFilter,)

    def get_queryset(self):
        return Snippet.objects.filter(owner=self.request.user)


class SharedSnippetListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SnippetListSerializer
    filter_backends = (DjangoObjectPermissionsFilter,)

    def get_queryset(self):
        user = self.request.user
        perms = [perm.codename for perm in get_perms_for_model(Snippet)]
        return get_objects_for_user(user, perms, Snippet, any_perm=True).exclude(owner=user)


class SnippetShareView(APIView):
    permission_classes = (IsOwner,)
    lookup_field = 'pk'
    serializer_class = SnippetShareSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return IsAuthenticated(),
        else:
            return IsOwner(), IsOTPAuthenticated(),

    def get_object(self):
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = get_object_or_404(Snippet, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self, request, *args, **kwargs):
        snippet = self.get_object()
        if snippet.owner != request.user:
            permission = get_perms(request.user, snippet)[0]
            return Response({'permission': permission})
        else:
            users = get_users_with_perms(snippet).exclude(pk=request.user.pk)
            permissions = (get_perms(user, snippet)[0] for user in users)
            serializer = self.serializer_class((UserPermission(user, perm)
                                                for user, perm in zip(users, permissions)),
                                               many=True)
            return Response({'all_permissions': self.serializer_class.PERMISSIONS_LIST,
                             'user_permissions': serializer.data})

    def post(self, request, *args, **kwargs):
        snippet = self.get_object()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(snippet=snippet)
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors)

    def patch(self, request, *args, **kwargs):
        snippet = self.get_object()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(username=serializer.validated_data['user']['username'])
            permission = get_perms(user, snippet)[0]
            serializer.instance = UserPermission(user, permission)
            serializer.save(snippet=snippet)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class HomeView(TemplateView):
    template_name = 'snippet/app.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

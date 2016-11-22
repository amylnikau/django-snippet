from django.contrib.auth.models import User
from django.utils import six
from guardian.shortcuts import assign_perm, remove_perm
from rest_framework import serializers
from rest_framework.fields import ChoiceField

from authentication.models import UserPermission
from authentication.serializers import UserSerializer, UserReadOnlySerializer
from snippet.models import Snippet


class ChoiceDisplayField(ChoiceField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.choice_strings_to_display = {
            six.text_type(key): value for key, value in self.choices.items()
            }

    def to_representation(self, value):
        if value is None:
            return value
        return (
            self.choice_strings_to_values.get(six.text_type(value), value),
            self.choice_strings_to_display.get(six.text_type(value), value),
        )


class SnippetSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Snippet
        fields = '__all__'
        extra_kwargs = {'html_text': {'read_only': True}}


class SnippetListSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Snippet
        fields = ('id', 'owner', 'title', 'created_on')


class SnippetShareSerializer(serializers.Serializer):
    PERMISSIONS_LIST = [('view_snippet', 'Read'),
                        ('change_snippet', 'Edit')]
    user = UserReadOnlySerializer()
    permission = ChoiceDisplayField(PERMISSIONS_LIST)

    def create(self, validated_data):
        user = User.objects.get(username=validated_data['user']['username'])
        permission = validated_data['permission']
        snippet = validated_data['snippet']
        assign_perm(permission, user, snippet)
        return UserPermission(user, permission)

    def update(self, instance, validated_data):
        if instance.permission != validated_data['permission']:
            snippet = validated_data.pop('snippet')
            remove_perm(instance.permission, instance.user, snippet)
            assign_perm(validated_data['permission'], instance.user, snippet)
            return UserPermission(**validated_data)
        else:
            return instance

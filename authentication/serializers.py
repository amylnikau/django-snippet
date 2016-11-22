from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name',
                  'last_name', 'email', 'is_superuser')

        extra_kwargs = {'password': {'write_only': True},
                        'is_superuser': {'read_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class UserReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')
        extra_kwargs = {'username': {'validators': []}}

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            return attrs
        else:
            raise serializers.ValidationError("User doesn't exist")

    def create(self, validated_data):
        raise NotImplementedError

    def update(self, instance, validated_data):
        return instance

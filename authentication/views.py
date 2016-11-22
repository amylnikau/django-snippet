import pyotp
import qrcode
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views import View
from qrcode.image.svg import SvgPathImage
from rest_framework import permissions
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.forms import AuthenticationFormWithCaptcha
from authentication.models import SecretKey
from authentication.serializers import UserSerializer
from authentication.utils import otp_verify

MAX_AUTH_ATTEMPTS = 3


class AuthView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        auth_step = request.data.pop('auth_step', None)
        if auth_step == 0:
            attempt = request.session.get('AUTH_ATTEMPT', 0)
            if attempt < MAX_AUTH_ATTEMPTS:
                request.session['AUTH_ATTEMPT'] = attempt + 1
                form = AuthenticationForm(data=request.data)
            else:
                form = AuthenticationFormWithCaptcha(data=request.data)
            if form.is_valid():
                user = form.get_user()
                request.session['USER_ID'] = user.pk
                return Response({})
            else:
                return Response(form.errors, status=400)
        elif auth_step == 1:
            otp_code = request.data.pop('otp_code', None)
            user = User.objects.get(pk=request.session['USER_ID'])
            if otp_verify(user, otp_code):
                request.session.flush()
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                return Response(UserSerializer(user).data)
            else:
                return Response({'otp': 'OTP doesn\'t match'}, status=400)
        else:
            return Response({'error': 'Unknown auth_step %s' % auth_step}, status=400)

    def delete(self, request, *args, **kwargs):
        logout(request)
        return Response({})


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        register_step = request.data.pop('register_step', None)
        if register_step == 0:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                request.session['USER'] = request.data
                return Response({})
            else:
                return Response(serializer.errors, status=400)
        elif register_step == 1:
            otp_code = request.data.pop('otp_code', None)
            user_serializer = UserSerializer(data=request.session.get('USER'))
            key = request.session.get('OTP_KEY', 0)
            if pyotp.TOTP(key).verify(otp_code) and user_serializer.is_valid():
                user = user_serializer.save()
                SecretKey.objects.create(user=user, key=key)
                request.session.flush()
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                return Response(UserSerializer(user).data)
            else:
                return Response({'error': 'OTP doesn\'t match'}, status=400)
        else:
            return Response({'error': 'Unknown register_step %s' % register_step}, status=400)


class UserView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserSearchView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_queryset(self):
        search_term = self.request.query_params.get('searchTerm')
        if search_term:
            terms = search_term.split()
            if len(terms) == 1:
                return User.objects.filter(first_name__startswith=terms[0])
            elif len(terms) == 2:
                return User.objects.filter(first_name=terms[0], last_name__startswith=terms[1])

        return User.objects.none()


class TOTPQRCodeView(View):
    def get(self, request, *args, **kwargs):
        otp_key = request.session.get('OTP_KEY')
        username = request.session.get('USER', {'username': 'default'})['username']
        if not otp_key:
            otp_key = pyotp.random_base32()
            request.session['OTP_KEY'] = otp_key
        totp = pyotp.TOTP(otp_key)
        url = totp.provisioning_uri(
            '{}@example.com'.format(username),
            issuer_name='CSDS Demo')
        img = qrcode.make(url, image_factory=SvgPathImage)
        response = HttpResponse(content_type='image/svg+xml')
        img.save(response)
        return response

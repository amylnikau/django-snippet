from django.contrib.auth.forms import AuthenticationForm
from snowpenguin.django.recaptcha2.fields import ReCaptchaField


class AuthenticationFormWithCaptcha(AuthenticationForm):
    captcha = ReCaptchaField()

import pyotp

from authentication.models import SecretKey


def otp_verify(user, otp_code):
    key = SecretKey.objects.get(user=user).key
    return pyotp.TOTP(key).verify(otp_code)

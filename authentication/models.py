import pyotp
from collections import namedtuple
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext as _

UserPermission = namedtuple('UserPermission', ['user', 'permission'])


class SecretKey(models.Model):
    key = models.CharField(
        _('Key'),
        max_length=16,
        primary_key=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        verbose_name=_('User'),
        related_name='key',
        on_delete=models.CASCADE)
    created = models.DateTimeField(
        _('Created'),
        auto_now_add=True)

    class Meta:
        verbose_name = _('Key')
        verbose_name_plural = _('Keys')

    def __str__(self):
        return self.key

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = pyotp.random_base32()
        return super(SecretKey, self).save(*args, **kwargs)

from django.conf import settings
from django.conf.urls import url, include
from django.http import HttpResponseRedirect

from authentication.views import TOTPQRCodeView
from csds.utils import admin_site
from snippet.views import HomeView

urlpatterns = [
    url(r'^admin/', include(admin_site.urls)),
    url(r'^favicon\.ico$', lambda x: HttpResponseRedirect(settings.STATIC_URL + '/favicon.ico')),
    url(r'^api/v1/', include('authentication.urls')),
    url(r'^api/v1/', include('snippet.urls')),
    url(r'^totp_qrcode', TOTPQRCodeView.as_view()),
    url(r'^', HomeView.as_view()),
]

from django.conf.urls import url

from authentication.views import AuthView, UserView, RegisterView, UserSearchView

urlpatterns = [
    url(r'^auth$', AuthView.as_view(), name='authenticate'),
    url(r'^register$', RegisterView.as_view(), name='register'),
    url(r'^user', UserView.as_view(), name='user'),
    url(r'^search/user', UserSearchView.as_view(), name='user_search'),

]

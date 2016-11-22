from django.conf.urls import url

from snippet.views import SnippetView, SnippetCreateView, SnippetListView, SnippetShareView, \
    SharedSnippetListView

urlpatterns = [
    url(r'^snippet/(?P<pk>\d+)/share$', SnippetShareView.as_view(), name='share_snippet'),
    url(r'^snippet/(?P<pk>\d+)$', SnippetView.as_view(), name='snippet'),
    url(r'^list_snippets$', SnippetListView.as_view(), name='list_snippets'),
    url(r'^list_shared_snippets$', SharedSnippetListView.as_view(), name='list_shared_snippets'),
    url(r'^create_snippet$', SnippetCreateView.as_view(), name='create_snippet'),
]

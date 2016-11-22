from django.conf import settings
from django.db import models


class Snippet(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    text = models.TextField()
    html_text = models.TextField()
    language = models.CharField(max_length=30)
    title = models.CharField(max_length=50)
    created_on = models.DateField(auto_now_add=True)

    class Meta:
        permissions = (('view_snippet', 'Can view Snippet'),)

    def save(self, *args, **kwargs):
        """Htmlize text and save to html_text. Use Pygments"""

        self.html_text = htmlize(self.text, self.language)
        super(Snippet, self).save(*args, **kwargs)

    def __str__(self):
        return self.title


def htmlize(text, language):
    from pygments import highlight
    from pygments.formatters import HtmlFormatter as Formatter
    if language == 'Python':
        from pygments.lexers import PythonLexer as Lexer
    elif language == 'Perl':
        from pygments.lexers import PerlLexer as Lexer
    elif language == 'Ruby':
        from pygments.lexers import RubyLexer as Lexer
    elif language == 'PythonConsole':
        from pygments.lexers import PythonConsoleLexer as Lexer
    elif language == 'PythonTraceback':
        from pygments.lexers import PythonTracebackLexer as Lexer
    elif language == 'RubyConsole':
        from pygments.lexers import RubyConsoleLexer as Lexer
    elif language == 'HtmlDjango':
        from pygments.lexers import HtmlDjangoLexer as Lexer
    elif language == 'Html':
        from pygments.lexers import HtmlLexer as Lexer
    else:
        from pygments.lexers import TextLexer as Lexer
    """
    Todo: I cant get this to work.
    lang_lexer = str(language + 'Lexer')
    Lexer = __import__('pygments.lexers', globals(), locals(), [lang_lexer, ])
    Or
    from pygments.lexers import get_lexer_by_name
    Lexer = get_lexer_by_name(language.lower())
    """
    html = highlight(text, Lexer(), Formatter(linenos='table'))
    return html

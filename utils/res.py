from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _


class ResponseChoices(TextChoices):
    SUCCESS = 'success', _('success')
    FAILURE = 'failure', _('failure')
    LOGOUT = 'logout success', _('logout success')
    NOT_VALID_MODEL = 'Please give a valid model name', _('give a valid model')

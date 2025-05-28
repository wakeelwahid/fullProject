# stapp/apps.py
from django.apps import AppConfig

class StappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stapp'

    def ready(self):
        import stapp.signals  # 👈 This makes sure signals are registered

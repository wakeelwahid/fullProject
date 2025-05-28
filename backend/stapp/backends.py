# stapp/backends.py
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class MobileBackend(BaseBackend):
    def authenticate(self, request, mobile=None, password=None, **kwargs):
        try:
            user = User.objects.get(mobile=mobile)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

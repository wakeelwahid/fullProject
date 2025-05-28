from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class MobileBackend(ModelBackend):
    """
    Custom authentication using mobile instead of username.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        mobile = kwargs.get('mobile') or username
        try:
            user = UserModel.objects.get(mobile=mobile)
        except UserModel.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None

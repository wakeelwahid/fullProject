from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.crypto import get_random_string
from .models import User

def generate_referral_code():
    return get_random_string(length=8).upper()

@receiver(post_save, sender=User)
def set_referral_code(sender, instance, created, **kwargs):
    if created and not instance.referral_code:
        instance.referral_code = generate_referral_code()
        instance.save()

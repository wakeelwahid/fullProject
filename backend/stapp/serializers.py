from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model
from .models import Wallet, DepositRequest, Bet,WithdrawRequest,ReferralCommission
import random
import string

User = get_user_model()


from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Wallet
import random
import string

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'mobile', 'email', 'password', 'confirm_password', 'referral_code']

    def validate(self, data):
        if not data.get('username'):
            raise serializers.ValidationError({"username": "Username is required."})
        if not data.get('mobile'):
            raise serializers.ValidationError({"mobile": "Mobile number is required."})
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def generate_referral_code(self, username):
        base = username[:3].upper()
        while True:
            code = base + ''.join(random.choices(string.digits, k=4))
            if not User.objects.filter(referral_code=code).exists():
                return code

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        referral_code_input = validated_data.pop('referral_code', None)

        referred_by = None
        if referral_code_input:
            if User.objects.filter(referral_code=referral_code_input).exists():
                referred_by = referral_code_input

        user = User(
            **validated_data,
            referred_by=referred_by,
            referral_code=self.generate_referral_code(validated_data['username'])
        )
        user.set_password(password)
        user.save()

        Wallet.objects.create(user=user)
        return user


# ✅ Custom Login with Mobile (for normal users)
class MobileTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'mobile'




# ✅ Admin login serializer (login via username instead of mobile, only staff allowed)
class AdminTokenSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if not username or not password:
            raise serializers.ValidationError("Username and password are required.")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid username or password.")

        if not user.is_staff:
            raise serializers.ValidationError("Access denied. Admin privileges required.")

        # Set the user for the parent class
        refresh = self.get_token(user)
        data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username
        }
        return data



# ✅ Wallet Serializer
class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['balance', 'bonus', 'winnings']




# ✅ Bet Serializer
class BetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bet
        fields = ['id', 'user', 'game', 'bet_type', 'number', 'amount', 'is_win', 'payout', 'created_at']
        read_only_fields = ['user', 'is_win', 'payout', 'created_at']



class BetAdminSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # ya customize karke username ya mobile dikhao

    class Meta:
        model = Bet
        fields = ['id', 'user', 'game', 'bet_type', 'number', 'amount', 'is_win', 'payout', 'created_at']

from rest_framework import serializers
from .models import DepositRequest, WithdrawRequest, Wallet, User


class WithdrawRequestSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    status = serializers.SerializerMethodField()

    class Meta:
        model = WithdrawRequest
        fields = ['id', 'user', 'amount', 'is_approved', 'is_rejected', 'created_at', 'status']
        read_only_fields = ['is_approved', 'is_rejected', 'created_at']

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "mobile": obj.user.mobile
        }

    def get_status(self, obj):
        if obj.is_approved:
            return "approved"
        elif obj.is_rejected:
            return "rejected"
        return "pending"


from rest_framework import serializers
from .models import DepositRequest

class DepositRequestSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = DepositRequest
        fields = [
            'id', 
            'user_info', 
            'amount', 
            'utr_number', 
            'status', 
            'created_at'
        ]
        read_only_fields = ['status', 'created_at']

    def get_user_info(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'mobile': obj.user.mobile
        }

class DepositActionSerializer(serializers.Serializer):
    deposit_id = serializers.IntegerField(required=True)
    action = serializers.ChoiceField(choices=['approve', 'reject'], required=True)


# serializers.py
# serializers.py (continued)
from .models import ReferralCommission

class ReferralCommissionSerializer(serializers.ModelSerializer):
    referred_user = serializers.CharField(source='referred_user.username')
    bet_game = serializers.CharField(source='bet.game')
    date = serializers.DateTimeField(source='created_at', format="%Y-%m-%d %H:%M")

    class Meta:
        model = ReferralCommission
        fields = ['referred_user', 'bet_game', 'commission', 'date']

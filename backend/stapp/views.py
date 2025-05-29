from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import models
from django.db.models import Sum
from .models import *
import json
import random
import string
from decimal import Decimal
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, MobileTokenObtainPairSerializer, AdminTokenSerializer, WithdrawRequestSerializer, DepositRequestSerializer, DepositActionSerializer, ReferralCommissionSerializer
from django.utils import timezone
from datetime import timedelta


def generate_referral_code(username, mobile):
    """Generate a unique referral code based on username and mobile"""
    # Take first 3 chars of username and last 4 digits of mobile
    username_part = username[:3].upper() if username else "USR"
    mobile_part = mobile[-4:] if mobile and len(mobile) >= 4 else "0000"

    # Add 2 random characters for uniqueness
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=2))

    return f"{username_part}{mobile_part}{random_part}"

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            mobile = data.get('mobile')
            email = data.get('email')
            password = data.get('password')
            referral_code = data.get('referral_code', '')

            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)

            if User.objects.filter(mobile=mobile).exists():
                return JsonResponse({'error': 'Mobile number already exists'}, status=400)

            # Generate unique referral code for new user
            new_referral_code = generate_referral_code(username, mobile)

            # Ensure referral code is unique
            while User.objects.filter(referral_code=new_referral_code).exists():
                new_referral_code = generate_referral_code(username, mobile)

            # Create user
            user = User.objects.create(
                username=username,
                mobile=mobile,
                email=email,
                password=make_password(password),
                referral_code=new_referral_code
            )

            # Create wallet for user
            Wallet.objects.create(user=user)

            # Handle referral logic
            if referral_code:
                try:
                    referrer = User.objects.get(referral_code=referral_code)
                    # Add referral bonus to referrer's wallet (50 bonus)
                    referrer_wallet = Wallet.objects.get(user=referrer)
                    referrer_wallet.bonus += Decimal('50.00')
                    referrer_wallet.save()

                    # Create referral commission record
                    ReferralCommission.objects.create(
                        referrer=referrer,
                        referred_user=user,
                        amount=Decimal('50.00'),
                        commission_type='signup_bonus'
                    )
                except User.DoesNotExist:
                    pass  # Invalid referral code, ignore

            return JsonResponse({
                'message': 'User registered successfully',
                'referral_code': new_referral_code
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            mobile = data.get('mobile')
            password = data.get('password')

            if not mobile or not password:
                return JsonResponse({'error': 'Mobile and password are required'}, status=400)

            # Authenticate user using mobile number
            user = authenticate(request, username=mobile, password=password)

            if user is not None:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                return JsonResponse({
                    'message': 'Login successful',
                    'access': str(access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'mobile': user.mobile,
                        'email': user.email,
                        'referral_code': user.referral_code
                    }
                }, status=200)
            else:
                return JsonResponse({'error': 'Invalid mobile number or password'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        user = request.user
        # Generate referral code if it doesn't exist
        if not user.referral_code:
            user.referral_code = generate_referral_code(user.username, user.mobile)
            user.save()

        return Response({
            'id': user.id,
            'username': user.username,
            'mobile': user.mobile,
            'email': user.email,
            'referral_code': user.referral_code,
            'date_joined': user.date_joined
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wallet_balance(request):
    try:
        wallet = Wallet.objects.get(user=request.user)
        return Response({
            'balance': str(wallet.balance),
            'bonus': str(wallet.bonus),
            'winnings': str(wallet.winnings)
        })
    except Wallet.DoesNotExist:
        # Create wallet if doesn't exist
        wallet = Wallet.objects.create(user=request.user)
        return Response({
            'balance': '0.00',
            'bonus': '0.00', 
            'winnings': '0.00'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_bet(request):
    try:
        data = request.data
        game_name = data.get('game_name')
        number = data.get('number')
        amount = Decimal(str(data.get('amount', 0)))

        # Check if user has sufficient balance
        wallet = Wallet.objects.get(user=request.user)
        total_balance = wallet.balance + wallet.bonus

        if total_balance < amount:
            return Response({'error': 'Insufficient balance'}, status=400)

        # Deduct amount from wallet (prefer balance over bonus)
        if wallet.balance >= amount:
            wallet.balance -= amount
        else:
            remaining = amount - wallet.balance
            wallet.balance = Decimal('0.00')
            wallet.bonus -= remaining

        wallet.save()

        # Create bet record
        bet = Bet.objects.create(
            user=request.user,
            game_name=game_name,
            number=number,
            amount=amount
        )

        # Handle referral commission (1% for specific games)
        commission_games = ['faridabad', 'gali', 'disawar', 'ghaziabad']
        if game_name.lower() in commission_games:
            try:
                # Find referrer
                referrer_commission = ReferralCommission.objects.filter(
                    referred_user=request.user,
                    commission_type='signup_bonus'
                ).first()

                if referrer_commission:
                    referrer = referrer_commission.referrer
                    commission_amount = amount * Decimal('0.01')  # 1%

                    # Add commission to referrer's bonus
                    referrer_wallet = Wallet.objects.get(user=referrer)
                    referrer_wallet.bonus += commission_amount
                    referrer_wallet.save()

                    # Create commission record
                    ReferralCommission.objects.create(
                        referrer=referrer,
                        referred_user=request.user,
                        amount=commission_amount,
                        commission_type='bet_commission'
                    )
            except Exception as e:
                print(f"Referral commission error: {e}")

        return Response({
            'message': 'Bet placed successfully',
            'bet_id': bet.id,
            'remaining_balance': str(wallet.balance + wallet.bonus)
        })

    except Wallet.DoesNotExist:
        return Response({'error': 'Wallet not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def declare_result(request):
    try:
        data = request.data
        game_name = data.get('game_name')
        winning_number = data.get('winning_number')

        # Find all bets for this game
        bets = Bet.objects.filter(game_name=game_name, status='pending')

        for bet in bets:
            if bet.number == winning_number:
                # User won
                winning_amount = bet.amount * 10  # 10x multiplier
                wallet = Wallet.objects.get(user=bet.user)
                wallet.winnings += winning_amount
                wallet.save()
                bet.status = 'won'
            else:
                bet.status = 'lost'
            bet.save()

        return Response({'message': f'Results declared for {game_name}'})

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_referral_info(request):
    try:
        user = request.user

        # Get referral stats
        total_referrals = User.objects.filter(
            id__in=ReferralCommission.objects.filter(
                referrer=user,
                commission_type='signup_bonus'
            ).values_list('referred_user_id', flat=True)
        ).count()

        total_earnings = ReferralCommission.objects.filter(
            referrer=user
        ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')

        return Response({
            'referral_code': user.referral_code,
            'total_referrals': total_referrals,
            'total_earnings': str(total_earnings),
            'referral_url': f"https://yourapp.com/register?ref={user.referral_code}"
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Class-based views for better structure
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User registered successfully',
                'referral_code': user.referral_code
            }, status=201)
        return Response(serializer.errors, status=400)

class MobileLoginView(TokenObtainPairView):
    serializer_class = MobileTokenObtainPairSerializer

class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenSerializer

# API Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    return get_user_profile(request)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wallet_balance(request):
    return get_wallet_balance(request)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw_request(request):
    try:
        amount = Decimal(str(request.data.get('amount', 0)))
        wallet = Wallet.objects.get(user=request.user)

        if wallet.balance < amount:
            return Response({'error': 'Insufficient balance'}, status=400)

        # Create withdraw request
        withdraw_req = WithdrawRequest.objects.create(
            user=request.user,
            amount=amount
        )

        return Response({'message': 'Withdraw request submitted successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_history(request):
    try:
        transactions = Transaction.objects.filter(user=request.user).order_by('-created_at')
        data = []
        for txn in transactions:
            data.append({
                'id': txn.id,
                'type': txn.transaction_type,
                'amount': str(txn.amount),
                'status': txn.status,
                'created_at': txn.created_at
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_bets_24h(request):
    try:
        yesterday = timezone.now() - timedelta(hours=24)
        bets = Bet.objects.filter(user=request.user, created_at__gte=yesterday)
        data = []
        for bet in bets:
            data.append({
                'id': bet.id,
                'game': bet.game,
                'number': bet.number,
                'amount': str(bet.amount),
                'status': 'won' if bet.is_win else 'lost',
                'created_at': bet.created_at
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_bets_30d(request):
    try:
        thirty_days_ago = timezone.now() - timedelta(days=30)
        bets = Bet.objects.filter(user=request.user, created_at__gte=thirty_days_ago)
        data = []
        for bet in bets:
            data.append({
                'id': bet.id,
                'game': bet.game,
                'number': bet.number,
                'amount': str(bet.amount),
                'status': 'won' if bet.is_win else 'lost',
                'created_at': bet.created_at
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bet_history(request):
    try:
        bets = Bet.objects.filter(user=request.user).order_by('-created_at')
        data = []
        for bet in bets:
            data.append({
                'id': bet.id,
                'game': bet.game,
                'number': bet.number,
                'amount': str(bet.amount),
                'status': 'won' if bet.is_win else 'lost',
                'payout': str(bet.payout) if bet.payout else '0',
                'created_at': bet.created_at
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Admin Views
class AdminGroupedBetStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            bets = Bet.objects.all().order_by('-created_at')
            data = []
            for bet in bets:
                data.append({
                    'id': bet.id,
                    'user': bet.user.username,
                    'game': bet.game,
                    'number': bet.number,
                    'amount': str(bet.amount),
                    'is_win': bet.is_win,
                    'created_at': bet.created_at
                })
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_withdraw_requests(request):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)

        requests = WithdrawRequest.objects.all().order_by('-created_at')
        serializer = WithdrawRequestSerializer(requests, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_transactions(request):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)

        transactions = Transaction.objects.all().order_by('-created_at')
        data = []
        for txn in transactions:
            data.append({
                'id': txn.id,
                'user': txn.user.username,
                'type': txn.transaction_type,
                'amount': str(txn.amount),
                'status': txn.status,
                'created_at': txn.created_at
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_deposit_request(request):
    try:
        serializer = DepositRequestSerializer(data=request.data)
        if serializer.is_valid():
            deposit_request = serializer.save(user=request.user)
            return Response({
                'message': 'Deposit request submitted successfully',
                'request_id': deposit_request.id
            }, status=201)
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_list_deposit_requests(request):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)

        requests = DepositRequest.objects.all().order_by('-created_at')
        serializer = DepositRequestSerializer(requests, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_deposit_action(request):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)

        serializer = DepositActionSerializer(data=request.data)
        if serializer.is_valid():
            deposit_id = serializer.validated_data['deposit_id']
            action = serializer.validated_data['action']

            deposit_request = DepositRequest.objects.get(id=deposit_id)

            if action == 'approve':
                deposit_request.status = 'approved'
                # Add money to user wallet
                wallet = Wallet.objects.get(user=deposit_request.user)
                wallet.balance += deposit_request.amount
                wallet.save()
            else:
                deposit_request.status = 'rejected'

            deposit_request.save()
            return Response({'message': f'Deposit request {action}d successfully'})

        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def referral_earnings(request):
    try:
        commissions = ReferralCommission.objects.filter(referrer=request.user)
        serializer = ReferralCommissionSerializer(commissions, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_referral_summary(request):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)

        commissions = ReferralCommission.objects.all().order_by('-created_at')
        serializer = ReferralCommissionSerializer(commissions, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_referral_summary(request):
    return get_referral_info(request)

@api_view(['GET'])
def game_status(request):
    try:
        # Return current game status
        return Response({
            'games': [
                {'name': 'faridabad', 'status': 'active'},
                {'name': 'gali', 'status': 'active'},
                {'name': 'disawar', 'status': 'active'},
                {'name': 'ghaziabad', 'status': 'active'}
            ]
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_stats(request):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)

        users = User.objects.all()
        users_data = []
        
        for user in users:
            try:
                wallet = Wallet.objects.get(user=user)
            except Wallet.DoesNotExist:
                wallet = Wallet.objects.create(user=user)
            
            # Calculate total deposits
            total_deposits = DepositRequest.objects.filter(
                user=user, status='approved'
            ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
            
            # Calculate total withdrawals
            total_withdrawals = WithdrawRequest.objects.filter(
                user=user, is_approved=True
            ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
            
            # Calculate today's deposits
            today = timezone.now().date()
            today_deposits = DepositRequest.objects.filter(
                user=user, status='approved',
                created_at__date=today
            ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
            
            # Calculate today's withdrawals
            today_withdrawals = WithdrawRequest.objects.filter(
                user=user, is_approved=True,
                created_at__date=today
            ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
            
            # Calculate total referrals - count unique referred users
            total_referrals = ReferralCommission.objects.filter(
                referrer=user
            ).values('referred_user').distinct().count()
            
            # Calculate referral earnings
            referral_earnings = ReferralCommission.objects.filter(
                referrer=user
            ).aggregate(total=Sum('commission'))['total'] or Decimal('0.00')
            
            # Calculate total earnings (winnings + referral earnings)
            total_earnings = wallet.winnings + referral_earnings
            
            users_data.append({
                'id': user.id,
                'username': user.username,
                'mobile': user.mobile,
                'email': user.email or 'N/A',
                'balance': str(wallet.balance),
                'bonus': str(wallet.bonus),
                'winnings': str(wallet.winnings),
                'total_deposit': str(total_deposits),
                'total_withdraw': str(total_withdrawals),
                'total_earning': str(total_earnings),
                'today_deposit': str(today_deposits),
                'today_withdraw': str(today_withdrawals),
                'total_referrals': total_referrals,
                'referral_earnings': str(referral_earnings),
                'status': 'active' if user.is_active else 'blocked',
                'date_joined': user.date_joined
            })
        
        return Response(users_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
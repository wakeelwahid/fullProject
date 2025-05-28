
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
from .models import *
import json
import random
import string
from decimal import Decimal
from django.contrib.auth.hashers import make_password

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

            # Authenticate user
            user = authenticate(request, username=mobile, password=password)
            
            if user is not None:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                return JsonResponse({
                    'message': 'Login successful',
                    'access_token': str(access_token),
                    'refresh_token': str(refresh),
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'mobile': user.mobile,
                        'email': user.email,
                        'referral_code': user.referral_code
                    }
                }, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)

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

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from decimal import Decimal, InvalidOperation
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count


from .serializers import RegisterSerializer, MobileTokenObtainPairSerializer, AdminTokenSerializer, BetSerializer,DepositRequestSerializer,ReferralCommissionSerializer
from .models import DepositRequest, Wallet, WithdrawRequest, Bet, Transaction, ReferralCommission, User


# --- Auth Views ---
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class MobileLoginView(TokenObtainPairView):
    serializer_class = MobileTokenObtainPairSerializer


class AdminTokenView(TokenObtainPairView):
    serializer_class = AdminTokenSerializer

class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "mobile": user.mobile,
        "referral_code": user.referral_code,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wallet_balance(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    return Response({
        'balance': str(wallet.balance),
        'bonus': str(wallet.bonus),
        'winnings': str(wallet.winnings)
    })



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw_request(request):
    amount = request.data.get('amount')

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return Response({'error': 'Amount must be a valid number'}, status=400)

    try:
        wallet = Wallet.objects.get(user=request.user)
    except Wallet.DoesNotExist:
        return Response({'error': 'Wallet not found'}, status=400)

    if wallet.balance < amount:
        return Response({'error': 'Insufficient balance'}, status=400)

    WithdrawRequest.objects.create(user=request.user, amount=amount)
    return Response({'message': 'Withdrawal request submitted, pending admin approval'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_history(request):
    transactions = Transaction.objects.filter(user=request.user).order_by('-created_at')
    return Response([
        {
            'type': tx.transaction_type,
            'amount': str(tx.amount),
            'status': tx.status,
            'date': tx.created_at.isoformat(),
            'note': tx.note
        }
        for tx in transactions
    ])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_bet(request):
    user = request.user
    game = request.data.get('game')
    bet_type = request.data.get('bet_type')
    number = request.data.get('number')
    amount = request.data.get('amount')

    # Validate input
    try:
        number = int(number)
        amount = Decimal(amount)
    except (ValueError, TypeError, InvalidOperation):
        return Response({'error': 'Invalid number or amount'}, status=400)

    if bet_type == 'number' and not (1 <= number <= 100):
        return Response({'error': 'Number must be 1-100 for number bet'}, status=400)
    if bet_type in ['andar', 'bahar'] and not (0 <= number <= 9):
        return Response({'error': 'Number must be 0-9 for Andar/Bahar'}, status=400)

    try:
        wallet = Wallet.objects.get(user=user)
    except Wallet.DoesNotExist:
        return Response({'error': 'Wallet not found'}, status=400)

    if wallet.balance < amount:
        return Response({'error': 'Insufficient balance'}, status=400)

    wallet.balance -= amount
    wallet.save()

    bet = Bet.objects.create(
        user=user,
        game=game,
        bet_type=bet_type,
        number=number,
        amount=amount
    )

    return Response({'message': 'Bet placed successfully', 'bet_id': bet.id})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_bets_24h(request):
    since = timezone.now() - timedelta(hours=24)
    bets = Bet.objects.filter(user=request.user, created_at__gte=since).order_by('-created_at')
    serializer = BetSerializer(bets, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_bets_30d(request):
    since = timezone.now() - timedelta(days=30)
    bets = Bet.objects.filter(user=request.user, created_at__gte=since).order_by('-created_at')
    serializer = BetSerializer(bets, many=True)
    return Response(serializer.data)




# --- User Bet History ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bet_history(request):
    bets = Bet.objects.filter(user=request.user).order_by('-created_at')
    data = [
        {
            "game": b.game,
            "bet_type": b.bet_type,
            "number": b.number,
            "amount": str(b.amount),
            "is_win": b.is_win,
            "payout": str(b.payout),
            "date": b.created_at.isoformat()
        }
        for b in bets
    ]
    return Response(data)


# --- Referral Earnings ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def referral_earnings(request):
    commissions = ReferralCommission.objects.filter(referrer=request.user).order_by('-created_at')
    total_earned = commissions.aggregate(total=Sum('commission'))['total'] or Decimal('0')

    data = {
        "total_commission": str(total_earned),
        "records": [
            {
                "referred_user": rc.referred_user.username,
                "amount": str(rc.commission),
                "bet_game": rc.bet.game,
                "date": rc.created_at.isoformat()
            }
            for rc in commissions
        ]
    }
    return Response(data)


# --- Admin Game Stats ---
@api_view(['GET'])
@permission_classes([IsAdminUser])
def game_stats(request):
    today = timezone.now().date()
    stats = Bet.objects.filter(created_at__date=today).values('game', 'bet_type', 'number').annotate(
        total_amount=Sum('amount'),
        total_bets=Count('id')
    ).order_by('game', 'bet_type', 'number')

    # convert Decimal fields to string for JSON serialization
    result = []
    for stat in stats:
        result.append({
            'game': stat['game'],
            'bet_type': stat['bet_type'],
            'number': stat['number'],
            'total_amount': str(stat['total_amount']),
            'total_bets': stat['total_bets'],
        })

    return Response(result)


# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count
from .models import Bet


class AdminGroupedBetStatsAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        games = ['gali', 'faridabad', 'disawer', 'ghaziabad', 'jaipur king', 'diamond king']
        game_data = {}

        for game in games:
            game_bets = Bet.objects.filter(game__iexact=game)

            number_bets = (
                game_bets.filter(bet_type='number')
                .values('number')
                .annotate(count=Count('id'), amount=Sum('amount'))
                .order_by('number')
            )

            andar_bets = (
                game_bets.filter(bet_type='andar')
                .values('number')
                .annotate(count=Count('id'), amount=Sum('amount'))
                .order_by('number')
            )

            bahar_bets = (
                game_bets.filter(bet_type='bahar')
                .values('number')
                .annotate(count=Count('id'), amount=Sum('amount'))
                .order_by('number')
            )

            number_dict = {}
            for entry in number_bets:
                number_dict[entry['number']] = {
                    'count': entry['count'],
                    'amount': float(entry['amount']),
                    'andarNumber': None,
                    'andarAmount': 0,
                    'baharNumber': None,
                    'baharAmount': 0,
                }

            for entry in andar_bets:
                num = entry['number']
                if num not in number_dict:
                    number_dict[num] = {
                        'count': 0,
                        'amount': 0,
                        'andarNumber': num,
                        'andarAmount': float(entry['amount']),
                        'baharNumber': None,
                        'baharAmount': 0,
                    }
                else:
                    number_dict[num]['andarNumber'] = num
                    number_dict[num]['andarAmount'] = float(entry['amount'])

            for entry in bahar_bets:
                num = entry['number']
                if num not in number_dict:
                    number_dict[num] = {
                        'count': 0,
                        'amount': 0,
                        'andarNumber': None,
                        'andarAmount': 0,
                        'baharNumber': num,
                        'baharAmount': float(entry['amount']),
                    }
                else:
                    number_dict[num]['baharNumber'] = num
                    number_dict[num]['baharAmount'] = float(entry['amount'])

            # Total calculations
            total_number_amount = sum(item['amount'] for item in number_dict.values())
            total_andar_amount = sum(item['andarAmount'] for item in number_dict.values())
            total_bahar_amount = sum(item['baharAmount'] for item in number_dict.values())
            total_bets = game_bets.count()
            total_amount = total_number_amount + total_andar_amount + total_bahar_amount

            game_data[game.upper()] = {
                'numberWiseBets': number_dict,
                'totalBets': total_bets,
                'totalAmount': total_amount,
                'totalNumberAmount': total_number_amount,
                'totalAndarAmount': total_andar_amount,
                'totalBaharAmount': total_bahar_amount,
            }

        return Response(game_data)




# views.py
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_withdraw_requests(request):
    if request.method == 'GET':
        withdrawals = WithdrawRequest.objects.filter(
            is_approved=False, 
            is_rejected=False
        ).select_related('user').order_by('-created_at')
        
        data = []
        for withdraw in withdrawals:
            data.append({
                "id": withdraw.id,
                "user": {
                    "username": withdraw.user.username,
                    "mobile": withdraw.user.mobile
                },
                "amount": str(withdraw.amount),
                "created_at": withdraw.created_at.isoformat()
            })
        return Response(data)

    elif request.method == 'POST':
        withdraw_id = request.data.get("id")
        action = request.data.get("action")

        try:
            withdraw = WithdrawRequest.objects.get(
                id=withdraw_id,
                is_approved=False,
                is_rejected=False
            )
        except WithdrawRequest.DoesNotExist:
            return Response({"error": "Withdrawal not found or already processed"}, status=404)

        if action == "approve":
            wallet = Wallet.objects.get(user=withdraw.user)
            
            if wallet.balance < withdraw.amount:
                return Response({"error": "User has insufficient balance"}, status=400)

            # Deduct from wallet
            wallet.balance -= withdraw.amount
            wallet.save()

            # Update withdrawal status
            withdraw.is_approved = True
            withdraw.approved_at = timezone.now()
            withdraw.save()

            # Create transaction record
            Transaction.objects.create(
                user=withdraw.user,
                amount=withdraw.amount,
                transaction_type="withdraw",
                status="approved",
                note="Withdrawal approved by admin"
            )

            return Response({"message": "Withdrawal approved successfully"})

        elif action == "reject":
            withdraw.is_rejected = True
            withdraw.save()

            Transaction.objects.create(
                user=withdraw.user,
                amount=withdraw.amount,
                transaction_type="withdraw",
                status="rejected",
                note="Withdrawal rejected by admin"
            )

            return Response({"message": "Withdrawal rejected successfully"})

        return Response({"error": "Invalid action"}, status=400)



    # Get all transactions with user details
    transactions = Transaction.objects.select_related('user').order_by('-created_at')
    
    # Transform data for frontend
    data = []
    for tx in transactions:
        data.append({
            'id': tx.id,
            'user': {
                'username': tx.user.username,
                'mobile': tx.user.mobile,
            },
            'transaction_type': tx.transaction_type,
            'amount': str(tx.amount),
            'status': tx.status,
            'created_at': tx.created_at.isoformat(),
            'note': tx.note or ""
        })
    
    return Response(data)
    

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import DepositRequest, Wallet
from .serializers import DepositRequestSerializer, DepositActionSerializer

# USER: Deposit Request Create
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_deposit_request(request):
    amount = request.data.get('amount')
    utr = request.data.get('utr_number')

    if not amount or not utr:
        return Response({'error': 'Amount and UTR number are required'}, status=400)

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return Response({'error': 'Amount must be a valid number'}, status=400)

    if amount <= 0:
        return Response({'error': 'Amount must be greater than zero'}, status=400)

    if len(utr) < 8:
        return Response({'error': 'UTR number must be at least 8 characters'}, status=400)

    # Create deposit request
    deposit = DepositRequest.objects.create(
        user=request.user,
        amount=amount,
        utr_number=utr,
        status='pending'
    )

    serializer = DepositRequestSerializer(deposit)
    return Response({'message': 'Deposit request submitted', 'deposit': serializer.data})


# ADMIN: List all deposit requests
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_deposit_requests(request):
    deposits = DepositRequest.objects.all().order_by('-created_at')
    serializer = DepositRequestSerializer(deposits, many=True)
    return Response(serializer.data)


# ADMIN: Approve or Reject deposit request
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_deposit_action(request):
    serializer = DepositActionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    deposit_id = serializer.validated_data['deposit_id']
    action = serializer.validated_data['action']

    try:
        deposit = DepositRequest.objects.get(id=deposit_id)
    except DepositRequest.DoesNotExist:
        return Response({'error': 'Deposit request not found'}, status=404)

    if deposit.status != 'pending':
        return Response({'error': f'Deposit request already {deposit.status}'}, status=400)

    if action == 'approve':
        # Update wallet balance
        wallet = Wallet.objects.get(user=deposit.user)
        wallet.balance += deposit.amount
        wallet.save()

        deposit.status = 'approved'
        deposit.save()

        return Response({'message': 'Deposit request approved and wallet updated'})

    elif action == 'reject':
        deposit.status = 'rejected'
        deposit.save()
        return Response({'message': 'Deposit request rejected'})

    else:
        return Response({'error': 'Invalid action'}, status=400)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Transaction
from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_transactions(request):
    # Get all transactions with user details
    transactions = Transaction.objects.select_related('user').order_by('-created_at')
    
    # Transform data for frontend
    data = []
    for tx in transactions:
        data.append({
            'id': tx.id,
            'user': {
                'username': tx.user.username,
                'mobile': tx.user.mobile,
            },
            'transaction_type': tx.transaction_type,
            'amount': str(tx.amount),
            'status': tx.status,
            'created_at': tx.created_at.isoformat(),
            'note': tx.note or ""
        })
    
    return Response(data)


# views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from decimal import Decimal
from django.utils import timezone
from .models import Bet, Wallet, ReferralCommission, User


@api_view(['POST'])
@permission_classes([IsAdminUser])
def declare_result(request):
    game = request.data.get('game')
    winning_number = request.data.get('winning_number')

    if not game or winning_number is None:
        return Response({"error": "game and winning_number are required"}, status=400)

    try:
        winning_number = int(winning_number)
    except ValueError:
        return Response({"error": "winning_number must be an integer"}, status=400)

    today = timezone.now().date()
    bets = Bet.objects.filter(game__iexact=game, created_at__date=today)

    win_count = 0
    for bet in bets:
        if bet.number == winning_number:
            bet.is_win = True
            win_amount = Decimal(0)

            # 💰 Payout logic
            if game.lower() in ['jaipur king', 'diamond king']:
                # No commission games
                if bet.bet_type == 'number':
                    win_amount = bet.amount * Decimal('100')  # 100x payout
                else:
                    win_amount = bet.amount * Decimal('10')   # 10x for andar/bahar
            else:
                # Commission-allowed games
                if bet.bet_type == 'number':
                    win_amount = bet.amount * Decimal('0.91')  # 91% payout
                else:
                    win_amount = bet.amount * Decimal('9')     # 9x for andar/bahar

            bet.payout = win_amount.quantize(Decimal('0.01'))
            bet.save()

            # 💰 Add payout to user winnings
            wallet = Wallet.objects.get(user=bet.user)
            wallet.winnings += bet.payout
            wallet.save()

            # 🧾 Referral 1% Commission (only for allowed games and number bets)
            if (
                game.lower() in ['faridabad', 'disawer', 'ghaziabad', 'gali'] and
                bet.bet_type == 'number' and
                bet.user.referred_by
            ):
                try:
                    referrer = User.objects.get(referral_code=bet.user.referred_by)
                    commission = bet.payout * Decimal('0.01')
                    ref_wallet = Wallet.objects.get(user=referrer)
                    ref_wallet.bonus += commission
                    ref_wallet.save()

                    ReferralCommission.objects.create(
                        referred_user=bet.user,
                        referrer=referrer,
                        bet=bet,
                        commission=commission.quantize(Decimal('0.01'))
                    )
                except User.DoesNotExist:
                    pass  # skip if referrer doesn't exist

            win_count += 1
        else:
            # Losing bet
            bet.is_win = False
            bet.payout = Decimal(0)
            bet.save()

    return Response({"message": f"✅ Result declared for {game.upper()}. Winning bets: {win_count}"})


# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.db.models import Sum
from decimal import Decimal

from .models import ReferralCommission, User
from .serializers import ReferralCommissionSerializer

# 🎯 USER REFERRAL VIEW
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def referral_earnings(request):
    user = request.user
    commissions = ReferralCommission.objects.filter(referrer=user).order_by('-created_at')
    total_earned = commissions.aggregate(total=Sum('commission'))['total'] or Decimal('0')

    data = {
        "referral_code": user.referral_code,
        "total_commission": str(total_earned),
        "records": ReferralCommissionSerializer(commissions, many=True).data
    }
    return Response(data)


# 🎯 ADMIN REFERRAL SUMMARY
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_referral_summary(request):
    users = User.objects.all()
    data = []

    for user in users:
        commissions = ReferralCommission.objects.filter(referrer=user)
        total = commissions.aggregate(total=Sum('commission'))['total'] or 0
        data.append({
            "referrer": user.username,
            "mobile": user.mobile,
            "total_referrals": commissions.count(),
            "total_earned": str(total)
        })

    return Response(data)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum
from decimal import Decimal
from .models import User, ReferralCommission

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_referral_summary(request):
    user = request.user
    referral_code = user.referral_code
    referred_users = User.objects.filter(referred_by=referral_code)
    total_referrals = referred_users.count()

    direct_bonus = total_referrals * 50  # ₹50 per referral

    commission_total = ReferralCommission.objects.filter(referrer=user).aggregate(total=Sum('commission'))['total'] or Decimal('0')
    
    total_earned = Decimal(direct_bonus) + commission_total

    return Response({
        "referral_code": referral_code,
        "total_referrals": total_referrals,
        "direct_bonus": float(direct_bonus),
        "commission_earned": float(commission_total),
        "total_earned": float(total_earned),
    })

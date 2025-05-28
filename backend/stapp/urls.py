from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AdminTokenObtainPairView,AdminGroupedBetStatsAPIView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MobileLoginView.as_view(), name='login'),
    path('profile/', user_profile, name='user-profile'),
    path('balance/', wallet_balance, name='wallet-balance'),
    # path('deposit/', admin_deposit_requests, name='admin_deposit_requests'),
    path('withdraw/', withdraw_request, name='withdraw-request'),
    path('transactions/', transaction_history, name='transaction-history'),
    path('place-bet/', place_bet, name='place-bet'),
    path('view-bets-24h/', view_bets_24h, name='view-bets-24h'),
    path('view-bets-30d/', view_bets_30d, name='view-bets-30d'),
    path('my-bets/', user_bet_history, name='user-bet-history'),
    path('admin/token/', AdminTokenObtainPairView.as_view(), name='admin_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/bets/', AdminGroupedBetStatsAPIView.as_view(), name='admin-grouped-bets'),
    # path('admin/deposit-requests/', admin_deposit_requests, name='admin-deposit-requests'),
    path('admin/withdraw-requests/', admin_withdraw_requests, name='admin-withdraw-requests'),
    path('admin/transactions/', admin_transactions, name='admin_transactions'),  
    path('deposit-requests/', user_deposit_request, name='user_deposit_request'),  # user POST deposit request
    path('admin/deposit-requests/',admin_list_deposit_requests, name='admin_list_deposit_requests'),  # admin GET all requests
    path('admin/deposit-action/',admin_deposit_action, name='admin_deposit_action'),  # admin POST approve/reject

    # 🏁 Admin Result Declaration
    path('admin/declare-result/', declare_result, name='declare-result'),

    # 🧾 User Bet History

    path('user/referrals/', referral_earnings,name="referral_earnings"),
    path('admin/referral-summary/',admin_referral_summary,name="admin_referral_summary"),
    path('user/my-referrals/', user_referral_summary,name="user_referral_summary"),
    path('game-status/', game_status, name='game-status'),
]
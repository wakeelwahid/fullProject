from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('profile/', get_user_profile, name='user-profile'),
    path('balance/', get_wallet_balance, name='wallet-balance'),
    path('withdraw/', withdraw_request, name='withdraw-request'),
    path('transactions/', transaction_history, name='transaction-history'),
    path('place-bet/', place_bet, name='place-bet'),
    path('view-bets-24h/', view_bets_24h, name='view-bets-24h'),
    path('view-bets-30d/', view_bets_30d, name='view-bets-30d'),
    path('my-bets/', user_bet_history, name='user-bet-history'),
    path('admin/token/', AdminTokenObtainPairView.as_view(), name='admin_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/bets/', AdminGroupedBetStatsAPIView.as_view(), name='admin-grouped-bets'),
    path('admin/withdraw-requests/', admin_withdraw_requests, name='admin-withdraw-requests'),
    path('admin/transactions/', admin_transactions, name='admin_transactions'),  
    path('deposit-requests/', user_deposit_request, name='user_deposit_request'),
    path('admin/deposit-requests/', admin_list_deposit_requests, name='admin_list_deposit_requests'),
    path('admin/deposit-action/', admin_deposit_action, name='admin_deposit_action'),
    path('admin/declare-result/', declare_result, name='declare-result'),
    path('user/referrals/', referral_earnings, name="referral_earnings"),
    path('admin/referral-summary/', admin_referral_summary, name="admin_referral_summary"),
    path('user/my-referrals/', user_referral_summary, name='user_referral_summary'),
    path('admin/users-stats/', admin_users_stats, name='admin-users-stats'),
    path('game-status/', game_status, name='game-status'),
    path('admin/toggle-user-status/', admin_toggle_user_status, name='admin-toggle-user-status'),
    path('admin/delete-user/', admin_delete_user, name='admin-delete-user'),
]
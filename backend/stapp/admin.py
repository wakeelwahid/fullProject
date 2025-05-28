from django.contrib import admin, messages
from django.utils import timezone
from decimal import Decimal
from django import forms
from .models import *

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.admin.sites import AlreadyRegistered

# ✅ Only register once with CustomUserAdmin
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'mobile', 'email', 'is_staff', 'is_superuser')
    search_fields = ('username', 'mobile', 'email')

try:
    admin.site.register(User, CustomUserAdmin)
except AlreadyRegistered:
    pass


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'bonus', 'winnings')


@admin.register(DepositRequest)
class DepositRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'amount', 'is_approved', 'is_rejected', 'status', 'approved_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'utr_number']

@admin.register(WithdrawRequest)
class WithdrawRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'is_approved', 'is_rejected', 'created_at', 'approved_at')
    actions = ['approve_withdrawal', 'reject_withdrawal']

    def approve_withdrawal(self, request, queryset):
        count = 0
        for withdraw in queryset.filter(is_approved=False, is_rejected=False):
            wallet = Wallet.objects.get(user=withdraw.user)
            if wallet.balance >= withdraw.amount:
                wallet.balance -= Decimal(withdraw.amount)
                wallet.save()

                withdraw.is_approved = True
                withdraw.approved_at = timezone.now()
                withdraw.save()

                Transaction.objects.create(
                    user=withdraw.user,
                    transaction_type='withdraw',
                    amount=withdraw.amount,
                    status='success',
                    note="Withdrawal approved"
                )
                count += 1
            else:
                self.message_user(request, f"⚠️ {withdraw.user.username} has insufficient balance.")
        self.message_user(request, f"✅ {count} withdrawal(s) approved.")

    def reject_withdrawal(self, request, queryset):
        count = 0
        for withdraw in queryset.filter(is_approved=False, is_rejected=False):
            withdraw.is_rejected = True
            withdraw.save()

            Transaction.objects.create(
                user=withdraw.user,
                transaction_type='withdraw',
                amount=withdraw.amount,
                status='rejected',
                note="Withdrawal rejected"
            )
            count += 1
        self.message_user(request, f"❌ {count} withdrawal(s) rejected.")

    approve_withdrawal.short_description = "✅ Approve selected withdrawal requests"
    reject_withdrawal.short_description = "❌ Reject selected withdrawal requests"


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'transaction_type', 'amount', 'status', 'created_at')
    list_filter = ('status', 'transaction_type')


@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'bet_type', 'number', 'amount', 'is_win', 'payout', 'created_at')



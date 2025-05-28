from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('stapp.urls')),   # ← myapp ke urls ko include karna
]

from django.urls import path, include
from rest_framework import routers

from user_auth import views
from user_auth.views import CustomTokenObtainPairView, CustomTokenRefreshView

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('payment/', views.get_payment, name='payments'),
    path('register', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('is_auth', views.is_auth, name='is_auth'),
    path('get_user', views.get_user, name='get_user'),
]

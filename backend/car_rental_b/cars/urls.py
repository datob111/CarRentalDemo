from django.urls import path, include
from .views import CarViewSet, ReservationViewSet, reservation_create, get_reservations
from rest_framework import routers

router = routers.DefaultRouter()
router.register('cars', CarViewSet)
router.register('reservations', ReservationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('reserve-car/', reservation_create),
    path('get_reservations/<pk>/', get_reservations),
]

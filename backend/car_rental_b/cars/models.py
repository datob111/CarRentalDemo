from django.db import models
from user_auth.models import CustomUser
# Create your models here.


class Car(models.Model):
    name = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=15, decimal_places=2)
    release_year = models.IntegerField()
    is_rented = models.BooleanField()
    car_photo = models.ImageField(upload_to='car_photos/', default='car_photos/car_default.jpg', blank=True)

    def __str__(self):
        return f'{self.name} - {self.release_year}'


class Reservation(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reservations')
    payment_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    price = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f'{self.car} - {self.user}'


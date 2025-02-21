from django.contrib import admin

from cars.models import Car, Reservation

# Register your models here.
admin.site.register(Car)
admin.site.register(Reservation)

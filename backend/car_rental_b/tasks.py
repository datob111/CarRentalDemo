import os
import django
import schedule
import time
from django.utils import timezone
import requests
from django.db.models.signals import post_delete

# Ensure that the Django settings module is specified
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "car_rental_b.settings")

# Set up Django environment to access models
django.setup()

# Now you can safely import your models
from cars.models import Reservation

def delete_expired_reservations():
    expired_reservations = Reservation.objects.filter(end_date__lt=timezone.localtime(timezone.now()))
    for reservation in expired_reservations:
        pk = reservation.id
        car = reservation.car
        car.is_rented = False
        car.save()
        requests.delete('http://127.0.0.1:8000/reservations/' + str(pk) + '/')
        print(f'Reservation {reservation} deleted')
    print(timezone.localtime(timezone.now()))


# Schedule the task every 5 minutes
schedule.every(20).seconds.do(delete_expired_reservations)

while True:
    schedule.run_pending()  # Run the scheduled tasks
    time.sleep(1)  # Wait for 1 second before running again

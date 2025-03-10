import os
import django
import schedule
import time
from django.utils import timezone

# Ensure that the Django settings module is specified
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "car_rental_b.settings")

# Set up Django environment to access models
django.setup()

# Now you can safely import your models
from cars.models import Reservation

def delete_expired_reservations():


    expired_reservations = Reservation.objects.filter(end_date__lt=timezone.localtime(timezone.now()))
    for reservation in expired_reservations:
        car = reservation.car
        car.is_rented = False
        car.save()
        reservation.delete()
        print(f'Reservation {reservation} deleted')
    print(timezone.localtime(timezone.now()))





# Schedule the task every 5 minutes
schedule.every(5).minutes.do(delete_expired_reservations)

while True:
    schedule.run_pending()  # Run the scheduled tasks
    time.sleep(1)  # Wait for 1 second before running again

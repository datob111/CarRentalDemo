from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from cars.models import Reservation
from .models import Messages, CustomUser
from twilio.rest import Client
from django.conf import settings

from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async, async_to_sync

# @receiver(post_delete, sender=Reservation)
# def reservation_delete(sender, instance, **kwargs):
#     new_message = instance.user.messages_set(message="The reservation time has expired.", type="info")
#     new_message.save()
#     print(new_message)


@receiver(post_save, sender=Reservation)
def reservation_save(sender, instance, **kwargs):
    print(instance.user)
    message = f"Hello, You have booked the car - {instance.car.name} from {instance.start_date} to {instance.end_date}."
    new_message = Messages(user=instance.user, type='sc', message=message)
    new_message.save()
    # client = Client(settings.ACCOUNT_SID, settings.AUTH_TOKEN)
    # client.messages.create(to='+995' + instance.user.phone_number,
    #                        from_=settings.TWILIO_PHONE_NUMBER, body=message)


@receiver(post_save, sender=Messages)
def add_message(sender, instance, **kwargs):
    instance.user.new_messages_count += 1
    instance.user.save()
    print(instance.user.new_messages_count)


@receiver(post_save, sender=Messages)
def real_time_messages(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'messages_channel',
        {'type': 'receive', 'message': 'well done!!!'}
    )


# @receiver(post_save, sender=CustomUser)
# def create_user_profile(sender, instance, created, **kwargs):
#     channel_layer = get_channel_layer()
#     async_to_sync(channel_layer.group_send)(
#         'users', {
#             'type': 'receive',
#             'message': 'updated',
#         }
#     )

from django.urls import re_path
from .consumers import MessagesConsumer#, UserConsumer

websocket_urlpatterns = [
    re_path(r'ws/live_messages/$', MessagesConsumer.as_asgi()),
    # re_path(r'ws/user_update/$', UserConsumer.as_asgi()),
]

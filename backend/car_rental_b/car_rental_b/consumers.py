import json
from user_auth.models import Messages, CustomUser
from user_auth.serializers import MessageSerializer, CustomUserSerializer
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async


class MessagesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add('messages_channel', self.channel_name)

    async def disconnect(self, code):
        await self.close()
        await self.channel_layer.group_discard('messages_channel', self.channel_name)
        print('Disconnected from channel')

    async def receive(self, text_data=None, bytes_data=None):
        messages = await sync_to_async(lambda: Messages.objects.first())()
        serialized = await sync_to_async(MessageSerializer)(messages)

        await self.send(text_data=json.dumps(serialized.data))



# class UserConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.channel_layer.group_add('users', self.channel_name)
#         await self.accept()
#
#     async def disconnect(self, code):
#         await self.channel_layer.group_discard('users', self.channel_name)
#         await self.close()
#         print('Disconnected from channel')
#
#     async def receive(self, text_data=None, bytes_data=None):
#         user = self.scope['user']
#         serialized = await sync_to_async(CustomUserSerializer)(user)
#         await self.send(text_data=json.dumps(serialized.data))






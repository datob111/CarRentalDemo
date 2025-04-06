import json
from django.utils import timezone
import datetime
from django.shortcuts import render
from rest_framework import status

from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import CustomUser, Payment, Messages, PaymentCard
from .serializers import CustomUserSerializer, PaymentSerializer, MessageSerializer, CustomUserImageUpdateSerializer, \
    CustomUserUpdateSerializer, PaymentCardSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Create your views here.


class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    authentication_classes = [BasicAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            refresh_token = tokens['refresh']
            access_token = tokens['access']

            res = Response()
            res.data = {'success': True}
            res.set_cookie(key='access_token', value=access_token,
                           httponly=True, secure=True, samesite='None', path='/')
            res.set_cookie(key='refresh_token', value=refresh_token,
                           httponly=True, secure=True, samesite='None', path='/')
            # print(tokens)
            # print('\n')
            # print(res.cookies)
            # print('\n')
            # print(request.COOKIES)
            return res
        except:
            return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        print(request.COOKIES)

        if not refresh_token:
            return Response(
                {'refreshed': False, 'detail': 'No refresh token provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add refresh token to request data for processing
        request.data['refresh'] = refresh_token

        try:
            # Use the parent class logic to validate and get new access token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens.get('access')
            refresh_token = tokens.get('refresh')

            if not access_token:
                return Response(
                    {'refreshed': False, 'detail': 'No access token returned'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            res = Response({'refreshed': True})
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            # res.set_cookie(
            #     key='refresh_token',
            #     value=refresh_token,
            #     httponly=True,
            #     secure=True,
            #     samesite='None',
            #     path='/'
            # )
            return res

        except Exception as e:
            return Response(
                {'refreshed': False, 'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'errors': serializer.errors})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        res = Response()
        res.data = {'success': True}
        res.delete_cookie(key='access_token', path='/', samesite='None')
        res.delete_cookie(key='refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment(request):
    payment = Payment.objects.filter(user=request.user)
    serializer = PaymentSerializer(payment, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def is_auth(request):
    serializer = CustomUserSerializer(request.user)
    return Response(serializer != None)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def get_user(request):
    try:
        if request.method == 'GET':
            serializer = CustomUserSerializer(request.user, context={'request': request})
            return Response(serializer.data)
        else:
            serializer = CustomUserImageUpdateSerializer(request.user, context={'request': request}, data=request.data)
            print(request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request):
    try:
        messages = Messages.objects.filter(user=request.user).order_by('-date')
        serialized_messages = MessageSerializer(messages, many=True)
        return Response(serialized_messages.data)
    except Exception:
        return Response({'message': str(Exception)}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def see_new_messages(request):
    try:
        user = request.user
        user.new_messages_count = 0
        user.save()
        return Response('All messages have been seen successfully')
    except Exception:
        return Response({'message': str(Exception)}, status=status.HTTP_401_BAD_REQUEST)


@api_view(['PUT'])
def update_user(request):
    user = request.user
    try:
        serializer = CustomUserUpdateSerializer(user, context={'request': request}, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(request.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(e)
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_card(request):
    try:
        serializer = PaymentCardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            # serializer.data.update({'user': request.user, 'expiry_date': datetime.date.today()})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        print(type(request.data['expiry_date']))
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cards(request):
    try:
        all_cards = PaymentCard.objects.filter(user=request.user)
        serializer = PaymentCardSerializer(all_cards, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


import json

import requests

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet, ModelViewSet
from rest_framework.generics import ListAPIView, RetrieveAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes


from twilio.rest import Client
from django.conf import settings


from .models import Car, Reservation
from .serializers import CarSerializer, ReservationSerializer, TimeSerializer

# Create your views here.


class CarViewSet(ViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = []

    def list(self, request):
        queryset = Car.objects.all()
        serializer = CarSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Car.objects.all()
        car = get_object_or_404(queryset, pk=pk)
        serializer = CarSerializer(car)
        return Response(serializer.data)

    def create(self, request):
        serializer = CarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        car = get_object_or_404(Car, pk=pk)
        serializer = CarSerializer(car, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)


    def destroy(self, request, pk=None):
        car = get_object_or_404(Car, pk=pk)
        if car.delete():
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)



class ReservationViewSet(ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = []



    @action(methods=['get'], detail=True, url_path='reservation_time', url_name='reservation_time')
    def reservation_time(self, request, pk=None):
        reservation = get_object_or_404(Reservation, pk=pk)
        if reservation:
            start = reservation.start_date
            end = reservation.end_date
            hours = (end.timestamp() - start.timestamp()) // (60**2)
            minutes = (end.timestamp() - start.timestamp()) // 60 - (hours * 60)
            print('hours: ', hours)
            print('minutes: ', minutes)
            return Response(TimeSerializer({
                'start': start, 'end': end,
                'start_time': start.time(), 'end_time': end.time()
            }).data)

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        reservation = get_object_or_404(Reservation, pk=kwargs['pk'])
        if reservation:
            car = reservation.car
            car.is_rented = False
            car.save()
            reservation.delete()
            return Response({'cancel_reservation': 'success', 'delete_reservation': 'success'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reservation_create(request):
    user_pk = request.user.pk
    car_pk = request.data['car_pk']
    car = get_object_or_404(Car, pk=car_pk)
    start_date = request.data['start_date']
    end_date = request.data['end_date']
    price = request.data['price']
    if car:
        if car.is_rented:
            return Response({'message': 'the car is already booked!'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = ReservationSerializer(data={'user': user_pk, 'car': car_pk, 'start_date':
                start_date, 'end_date': end_date, 'price': price})
        if serializer.is_valid():
            serializer.save()
            car.is_rented = True
            car.save()

            message = f"Hello, You have booked the car - {car.name} from {start_date} to {end_date}."
            # resp = requests.post('https://textbelt.com/text', {
            #     'phone': '+995' + request.user.phone_number,
            #     'message': message,
            #     'key': 'textbelt',
            # })
            # print(resp.json())
            client = Client(settings.ACCOUNT_SID, settings.AUTH_TOKEN)
            client.messages.create(to='+995' + request.user.phone_number,
                                   from_=settings.TWILIO_PHONE_NUMBER, body=message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Car not found!'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([])
def get_reservations(request, pk):
    car = get_object_or_404(Car, pk=pk)
    if not car:
        return Response(status=status.HTTP_404_NOT_FOUND)
    reservations = Reservation.objects.filter(car=car).order_by('start_date')
    serializer = ReservationSerializer(reservations, many=True)
    try:
        return Response(serializer.data)
    except Exception:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


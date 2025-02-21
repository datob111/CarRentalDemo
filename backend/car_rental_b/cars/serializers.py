from rest_framework import serializers, status
from rest_framework.response import Response

from cars.models import Car, Reservation


class CarSerializer(serializers.ModelSerializer):
    car_photo = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = ('id', 'name', 'brand', 'description', 'price', 'release_year', 'is_rented', 'car_photo')

    def get_car_photo(self, obj):
        return "http://127.0.0.1:8000" + obj.car_photo.url


class ReservationSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['timestamp']

    def get_timestamp(self, obj):
        return obj.end_date.timestamp() - obj.start_date.timestamp()

    # def validate_car(self, obj):
    #     if obj.car.is_rented:
    #         return Response({'is_rented': True}, status=status.HTTP_409_CONFLICT)


class TimeSerializer(serializers.Serializer):
    start = serializers.DateTimeField()
    end = serializers.DateTimeField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

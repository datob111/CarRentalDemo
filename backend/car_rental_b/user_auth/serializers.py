from django.utils import timezone

from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import CustomUser, Payment, Messages


class CustomUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    last_login = serializers.DateTimeField(default=timezone.now, read_only=True)
    profile_photo = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'password1', 'password2',
                  'password', 'date_of_join', 'is_active', 'is_staff', 'last_login',
                  'is_superuser', 'phone_number', 'card_number', 'profile_photo', 'new_messages_count')
        read_only_fields = ['id', 'last_login', 'date_of_join', 'password']

    def validate_password2(self, value):
        password1 = self.initial_data.get('password1')
        if value != password1:
            raise serializers.ValidationError("Passwords don't match")
        return value

    def create(self, validated_data):
        validated_data.pop('password1')
        password = validated_data.pop('password2', None)
        if password:
            validated_data['password'] = make_password(password)
        return super().create(validated_data)

    def get_profile_photo(self, obj):
        return 'https://' + obj.profile_photo.url


class UserRegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'password', 'last_name', 'phone_number', 'card_number')

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = CustomUser.objects.create_user(**validated_data)
        user.save()
        return user


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    class Meta:
        model = Messages
        fields = '__all__'

    def get_date(self, obj):
        local_time = timezone.localtime(obj.date)
        return local_time.strftime('%Y-%m-%d %H:%M')

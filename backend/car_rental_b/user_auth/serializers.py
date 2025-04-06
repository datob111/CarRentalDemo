from django.utils import timezone

from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import CustomUser, Payment, Messages, PaymentCard


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
        if obj.profile_photo:
            return 'https://' + obj.profile_photo.url
        else:
            return "https://127.0.0.1:8000/media/profile_photos/default_profile_photo.png"


class CustomUserImageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('profile_photo', )


class CustomUserUpdateSerializer(serializers.ModelSerializer):
    # phone_number = serializers.CharField(required=False, style={'input_type': 'number'})
    # email = serializers.EmailField(required=False, style={'input_type': 'email'})
    class Meta:
        model = CustomUser
        fields = ('phone_number', 'email')
        extra_kwargs = {'phone_number': {'required': False, 'style': {'input_type': 'number'}},
                        'email': {'required': False, 'style': {'input_type': 'email'}}}



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


class PaymentCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentCard
        fields = ('id', 'ccv', 'card_number', 'postal_code', 'card_holder', 'expiry_date')

    def validate_ccv(self, value):
        if value < 0 or len(str(value)) != 3:
            raise serializers.ValidationError("Invalid CCV")
        return value

    def validate_card_number(self, value):
        if value < 0 or len(str(value)) != 16:
            raise serializers.ValidationError("Invalid Card Number")
        return value

    def validate_postal_code(self, value):
        if value < 0 or len(str(value)) != 4:
            raise serializers.ValidationError("Invalid Postal Code")
        return value

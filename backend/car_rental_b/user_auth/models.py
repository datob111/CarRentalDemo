from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, null=False, unique=True)
    first_name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_of_join = models.DateField(auto_now_add=True)
    phone_number = models.CharField(max_length=12, null=False)
    card_number = models.CharField(max_length=12, null=False)
    profile_photo = models.ImageField(upload_to='profile_photos/', default='profile_photos/default_profile_photo.png', blank=True, null=True)
    new_messages_count = models.PositiveIntegerField(default=0)

    objects = CustomUserManager()
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']


class Payment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payments')
    amount = models.IntegerField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.amount} {self.date}'

class Messages(models.Model):
    types = {
        'sc': 'success',
        'fl': 'fail',
        'wn': 'warning',
        'in': 'info'
    }
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='messages')
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=15, choices=types)


class PaymentCard(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payment_cards')
    card_number = models.IntegerField(null=False)
    expiry_date = models.DateField()
    ccv = models.IntegerField()
    card_holder = models.CharField(max_length=35, null=False)
    postal_code = models.IntegerField()



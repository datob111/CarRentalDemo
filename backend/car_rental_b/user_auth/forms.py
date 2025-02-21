from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    class Meta():
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'password1', 'password2', 'phone_number', 'card_number', 'is_staff', 'is_active')
        exclude = ('username',)

    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2


class CustomUserChangeForm(UserChangeForm):
    class Meta():
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'card_number', 'is_staff', 'is_active')


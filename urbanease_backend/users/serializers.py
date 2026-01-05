from rest_framework import serializers
from .models import AppUser
from django.contrib.auth import authenticate
from .models import ProviderProfile
from services.models import ServiceCategory
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ["email", "name", "phone", "address", "gender", "role", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        return AppUser.objects.create_user(password=password, **validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("Account is inactive")

        data["user"] = user
        return data
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ["id", "email", "name", "phone", "address", "gender", "role"]
# users/serializers.py


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ["id", "email", "name", "phone", "role"]


class ProviderProfileSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    skills = serializers.PrimaryKeyRelatedField(many=True, queryset=ServiceCategory.objects.all(), required=False)

    class Meta:
        model = ProviderProfile
        fields = ["id", "user", "skills", "bio", "is_verified", "hourly_rate", "created_at"]

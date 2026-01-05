from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from services.models import ServiceCategory
from django.conf import settings

class AppUserManager(BaseUserManager):
    def create_user(self, email, name, phone, address, gender, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field is mandatory')

        # default flags for normal user
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            name=name,
            phone=phone,
            address=address,
            gender=gender,
            **extra_fields
        )
        if password:
            user.set_password(password)
        else:
            # you could enforce password here if you want
            raise ValueError("Users must have a password.")

        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, phone, address, gender, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'Admin')  # 👈 set role for superuser

        if not password:
            raise ValueError("Superusers must have a password.")
        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, name, phone, address, gender, password, **extra_fields)


class AppUser(AbstractUser):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )
    ROLE_CHOICES = (
        ('Customer', 'Customer'),
        ('Provider', 'Provider'),
        ('Admin', 'Admin'),
    )

    # remove username field from AbstractUser
    username = None

    # use email as unique identifier
    email = models.EmailField(unique=True)

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='Customer')

    objects = AppUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone', 'address', 'gender']

    def __str__(self):
        return self.email


class ProviderProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="provider_profile")
    skills = models.ManyToManyField(ServiceCategory, blank=True, related_name="providers")
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ProviderProfile: {self.user.email}"
# from rest_framework import serializers
# from .models import Booking

# class GetBookingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Booking
#         fields = [
#             "id",
#             "service",
#             "scheduled_at",
#             "address",
#             "status",
#             "created_at",
#         ]
#         depth = 1   # expands service and its category
#         read_only_fields = ["id", "status", "created_at"]

#     def create(self, validated_data):
#         validated_data["customer"] = self.context["request"].user
#         return super().create(validated_data)

# # bookings/serializers.py
# from rest_framework import serializers
# from .models import Booking
# from services.models import Service
# from services.serializers import ServiceSerializer

# class BookingSerializer(serializers.ModelSerializer):
#     # Accept service as ID on input and validate against Service queryset
#     service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())

#     class Meta:
#         model = Booking
#         fields = [
#             "id",
#             "service",
#             "scheduled_at",
#             "address",
#             "status",
#             "created_at",
#         ]
#         read_only_fields = ["id", "status", "created_at"]
#         depth = 1  # will expand service to nested object in output

#     def create(self, validated_data):
#         # set customer from request.user (passed via context in view)
#         validated_data["customer"] = self.context["request"].user
#         return super().create(validated_data)

from rest_framework import serializers
from .models import Booking
from services.models import Service
from services.serializers import ServiceSerializer
from users.serializers import SimpleUserSerializer
class BookingSerializer(serializers.ModelSerializer):
    # Input: service ID
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        write_only=True
    )

    provider = SimpleUserSerializer(read_only=True)
    # Output: nested service object
    service_details = ServiceSerializer(
        source="service",
        read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "service",  
            "provider",        # input only
            "service_details",  # output only
            "scheduled_at",
            "address",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def create(self, validated_data):
        validated_data["customer"] = self.context["request"].user
        return super().create(validated_data)

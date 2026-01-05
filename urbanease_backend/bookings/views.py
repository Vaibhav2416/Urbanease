from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Booking
from .serializers import BookingSerializer # GetBookingSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_my_bookings(request):
    """
    GET /api/bookings/
    Returns all bookings of the logged-in user.
    """
    bookings = Booking.objects.filter(customer=request.user).select_related(
        "service", "service__category"
    )
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



# bookings/views.py (create_booking)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    # optional role check
    if hasattr(request.user, "role") and request.user.role != "Customer":
        return Response({"detail": "Only customers can create bookings."},
                        status=status.HTTP_403_FORBIDDEN)

    serializer = BookingSerializer(data=request.data, context={"request": request})
    # This will raise a 400 Bad Request with serializer.errors if input invalid
    serializer.is_valid(raise_exception=True)

    booking = serializer.save()
    return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)


# bookings/views.py (append provider endpoints)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Booking
from .serializers import BookingSerializer
from users.models import AppUser  # for provider lookup
from django.shortcuts import get_object_or_404

def is_provider(user):
    return hasattr(user, "role") and user.role == "Provider"

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def provider_incoming_bookings(request):
    """
    Endpoint for provider to view incoming unassigned bookings that match their skills.
    It returns bookings with status 'Pending' and whose service.category is in provider.skills.
    """
    if not is_provider(request.user):
        return Response({"detail": "Only providers can access this."}, status=status.HTTP_403_FORBIDDEN)

    # get provider profile skills
    provider_profile = getattr(request.user, "provider_profile", None)
    if not provider_profile:
        return Response({"detail": "Provider profile not found."}, status=status.HTTP_404_NOT_FOUND)

    skill_categories = provider_profile.skills.all()
    # bookings where service.category in provider skills and unassigned and pending
    bookings = Booking.objects.filter(
       Q(
            service__category__in=skill_categories,
            provider__isnull=True,
            status="Pending"
        )
        |
        Q(provider=request.user)
    ).select_related("service", "service__category", "customer")

    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def provider_accept_booking(request, booking_id):
    """
    Provider accepts a booking: sets provider=request.user and status='Accepted'
    """
    if not is_provider(request.user):
        return Response({"detail": "Only providers can accept bookings."}, status=status.HTTP_403_FORBIDDEN)

    booking = get_object_or_404(Booking, pk=booking_id)

    # Only pending and unassigned bookings can be accepted
    if booking.status != "Pending" or booking.provider is not None:
        return Response({"detail": "Booking is not available to accept."}, status=status.HTTP_400_BAD_REQUEST)

    # Optional: verify provider skill can handle this booking
    provider_profile = getattr(request.user, "provider_profile", None)
    if provider_profile and booking.service.category not in provider_profile.skills.all():
        return Response({"detail": "You don't have the required skill for this service."}, status=status.HTTP_403_FORBIDDEN)

    booking.provider = request.user
    booking.status = "Accepted"
    booking.save()

    return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


@api_view(["POST","PATCH"])
@permission_classes([IsAuthenticated])
def provider_update_status(request, booking_id):
    """
    Provider updates the booking status (in_progress, completed, cancelled)
    Request body: { "status": "In Progress" }
    Only provider assigned to booking can change status.
    """
    if not is_provider(request.user):
        return Response({"detail": "Only providers can change status."}, status=status.HTTP_403_FORBIDDEN)

    booking = get_object_or_404(Booking, pk=booking_id)

    if booking.provider != request.user:
        return Response({"detail": "You are not assigned to this booking."}, status=status.HTTP_403_FORBIDDEN)

    new_status = request.data.get("status")
    allowed = ["In Progress", "Completed", "Cancelled"]
    if new_status not in allowed:
        return Response({"detail": f"Status must be one of {allowed}."}, status=status.HTTP_400_BAD_REQUEST)

    booking.status = new_status
    booking.save()
    return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_booking(request, booking_id):
    """
    Customer can edit booking only if:
    - booking belongs to them
    - booking status is Pending
    """

    try:
        booking = Booking.objects.get(
            id=booking_id,
            customer=request.user
        )
    except Booking.DoesNotExist:
        return Response(
            {"detail": "Booking not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != "Pending":
        return Response(
            {"detail": "Only pending bookings can be edited"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # allowed editable fields
    scheduled_at = request.data.get("scheduled_at")
    address = request.data.get("address")

    if scheduled_at:
        booking.scheduled_at = scheduled_at

    if address:
        booking.address = address

    booking.save()

    return Response(
        {"message": "Booking updated successfully"},
        status=status.HTTP_200_OK
    )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_booking(request, booking_id):
    """
    Customer can cancel booking only if:
    - booking belongs to them
    - booking status is Pending
    """

    try:
        booking = Booking.objects.get(
            id=booking_id,
            customer=request.user
        )
    except Booking.DoesNotExist:
        return Response(
            {"detail": "Booking not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != "Pending":
        return Response(
            {"detail": "Only pending bookings can be cancelled"},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.delete()

    return Response(
        {"message": "Booking cancelled successfully"},
        status=status.HTTP_204_NO_CONTENT
    )


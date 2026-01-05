from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny  # later you can restrict
from rest_framework.response import Response
from rest_framework import status

from .models import ServiceCategory, Service
from .serializers import ServiceCategorySerializer, ServiceSerializer


# --------- CATEGORIES ----------

@api_view(["GET"])
@permission_classes([AllowAny])
def list_categories(request):
    """
    GET /api/services/categories/
    Returns list of all service categories.
    """
    categories = ServiceCategory.objects.all()
    serializer = ServiceCategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# --------- SERVICES ----------

@api_view(["GET"])
@permission_classes([AllowAny])
def list_services(request):
    """
    GET /api/services/
    Returns all active services with nested category.
    """
    services = Service.objects.filter(is_active=True).select_related("category")
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])  # later: use IsAuthenticated / IsAdminUser
def create_service(request):
    """
    POST /api/services/
    Body: { name, description, base_price, duration_in_minutes, is_active, category }
    Where 'category' is category ID.
    """
    serializer = ServiceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def service_detail(request, pk):
    """
    GET /api/services/<id>/
    Returns a single service by ID
    """
    try:
        service = Service.objects.select_related("category").get(
            pk=pk, is_active=True
        )
    except Service.DoesNotExist:
        return Response(
            {"detail": "Service not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ServiceSerializer(service)
    return Response(serializer.data, status=status.HTTP_200_OK)

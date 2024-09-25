from .models import *
from cinemamg import serializers, paginators, perms
from rest_framework.decorators import action
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework import status, parsers
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class MovieViewSet(viewsets.ViewSet, generics.ListAPIView, generics.UpdateAPIView):
    queryset = Movie.objects.all().order_by('name')
    serializer_class = serializers.MovieSerializer
    pagination_class = paginators.MoviePaginator

    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q)
        return queryset
    @action(methods=['get'], url_path='showtime', detail=True)
    def get_showtime(self, request, pk):
        showtime = self.get_object().showtime_set.filter(active=True)
        return Response(serializers.ShowtimeSerializer(showtime, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='review', detail=True)
    def get_review(self, request, pk):
        review = self.get_object().review.order_by('-created_date')
        return Response(serializers.ReviewSerializer(review, many=True).data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            genre = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        genre = self.get_object()
        genre.delete()
        return Response({
            'message': 'Genre deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

class ShowtimeViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Showtime.objects.filter(active=True).all()
    serializer_class = serializers.ShowtimeSerializer
    permission_classes = [permissions.IsAdminUser]


class UserViewSet(viewsets.ModelViewSet, generics.UpdateAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for key, value in request.data.items():
                setattr(user, key, value)
            user.save()
        return Response(serializers.UserSerializer(request.user).data)

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    # def get_serializer_class(self):
    #     if self.request.user.is_authenticated:
    #         return serializers.A

    def retrieve(self, request, *args, **kwargs):
        return Response(self.get_serializer(self.get_object()).data, status=status.HTTP_200_OK)


    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.role == User.Role.ADMIN:  # Không cho phép xóa admin
            return Response({
                'message': 'Cannot delete admin user'
            }, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({
            'message': 'User deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

class GenreViewSet(viewsets.ModelViewSet, generics.CreateAPIView,
                                        generics.UpdateAPIView,
                                        generics.DestroyAPIView):
    queryset = Genre.objects.all()
    serializer_class = serializers.GenreSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:  # Cho phép tất cả người dùng đã đăng nhập xem thể loại
            permission_classes = [IsAuthenticated]
        else:  # Chỉ admin mới có quyền thêm, sửa, xóa
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class CinemaHallViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = CinemaHall.objects.filter(active=True).all()
    serializer_class = serializers.CinemaHallSerializer
    permission_classes = [permissions.IsAdminUser]

class ReviewViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveUpdateDestroyAPIView, generics.DestroyAPIView):
    queryset = Review.objects.filter(active=True).all()
    serializer_class = serializers.ReviewSerializer
    permission_classes = [perms.ReviewOwner]

    @action(methods=['get'], url_path='user', detail=True)
    def get_review(self, request, pk):
        review = self.get_object().review_set.select_related('user'). order_by('-id')

        paginator = paginators.ReviewPaginator()
        page = paginator.paginate_queryset(review, request)
        if page is not None:
            serializer = serializers.ReviewSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        return Response(serializers.ReviewSerializer(review, many=True).data)



class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = serializers.PromotionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]  # Người dùng có thể xem danh sách và chi tiết
        else:
            permission_classes = [IsAdminUser]  # Chỉ admin mới có thể thêm, sửa, xóa
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            promotion = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            promotion = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        promotion = self.get_object()
        promotion.delete()
        return Response({
            'message': 'Promotion deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = serializers.BookingSerializer
    permission_classes = [IsAuthenticated] #alowed cho user(phai co tai khoan)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            booking = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.user != request.user:
            return Response({
                'message': 'You can only cancel your own booking'
            }, status=status.HTTP_403_FORBIDDEN)
        booking.status = 'cancelled'
        booking.save()
        return Response({
            'message': 'Booking cancelled successfully'
        }, status=status.HTTP_204_NO_CONTENT)

class InvoiceViewSet(viewsets.ModelViewSet, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

        # Gán booking và tính toán số tiền khi tạo invoice
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            invoice = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import serializers
from .models import *
from django.utils import timezone


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'created_date', 'updated_date', 'active']

class MovieSerializer(serializers.ModelSerializer):
    genre_names = serializers.SerializerMethodField()
    # release_date = serializers.DateTimeField(format="%Y-%m-%d")

    def to_representation(self, instance):
        req = super().to_representation(instance)
        # Kiểm tra nếu poster_img không phải là None
        if instance.poster_img:
            req['poster_img'] = instance.poster_img.url
        else:
            req['poster_img'] = None  # Hoặc bạn có thể đặt một giá trị mặc định nếu muốn
        return req
    class Meta:
        model = Movie
        fields = ['id', 'name', 'genre_names', 'release_date', 'description', 'poster_img']

    def get_genre_names(self, obj):
        return [genre.name for genre in obj.genre.all()]

    #lấy ds cac review trong movie

class ShowtimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showtime
        fields = ['id', 'showtime_date', 'movie', 'cinemaHall']

class UserSerializer(serializers.ModelSerializer):
    #ham bam mat khau
    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(user.password)
        user.save()

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)  # Cập nhật và mã hóa mật khẩu
            user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'email', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            },
        }


class CinemaHallSerializer(serializers.ModelSerializer):
    class Meta:
        model = CinemaHall
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user']  # Không cho phép người dùng tự chọn user

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ['code', 'promo_type', 'discount_value', 'start_date', 'end_date']

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['booking', 'total_amount', 'promotion', 'payment_status']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating', 'movie', 'user']

from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import routers
from cinemamg import views

r = routers.DefaultRouter()
r.register('movie', views.MovieViewSet, 'movie')
r.register('showtime', views.ShowtimeViewSet, 'showtime')
r.register('users', views.UserViewSet, 'users')
r.register(r'genres', views.GenreViewSet, 'genre')
r.register(r'cinema_hall', views.CinemaHallViewSet, 'cinema_hall')
r.register(r'review', views.ReviewViewSet, 'review')
r.register(r'promotions', views.PromotionViewSet, 'promotion')
r.register(r'booking', views.BookingViewSet, 'booking')
r.register(r'invoice', views.InvoiceViewSet, 'invoice')
r.register(r'users', views.UserViewSet, basename='user')



urlpatterns = [
    path('', include(r.urls)),
    path('api/', include(r.urls)),
]

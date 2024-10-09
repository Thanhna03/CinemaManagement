from django.contrib import admin
from .models import *
from django.utils.html import mark_safe
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path
from django.template.response import TemplateResponse
from django.db.models import Count


class CinemaAdminSite(admin.AdminSite):
    site_header = 'SERENCE CINAME'

    def get_urls(self):
        return [
            path('cinema-stats/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        movie_stats = Movie.objects.annotate(c=Count('id')).values('id', 'name', 'c')
        return TemplateResponse(request, 'admin/stats.html', {
            "movie_stats": movie_stats
        })


admin.site = CinemaAdminSite(name='mycinamewebsite')

class MyUser(admin.ModelAdmin):
    list_display = ['id', 'role', 'created_date', 'updated_date', 'active']
    list_filter = ['id', 'created_date']
    search_fields = ['id', 'role']

class MyMovie(admin.ModelAdmin):
    list_display = ['id', 'name', 'get_genre', 'release_date', 'active']
    list_filter = ['id', 'name']
    search_fields = ['id', 'name']
    def get_genre(self, obj):
        return ", ".join([genre.name for genre in obj.genre.all()])

    get_genre.short_description = 'Genre'


class MyShowtime(admin.ModelAdmin):
    list_display = ['id', 'showtime_date', 'movie', 'cinemaHall', 'start_time', 'end_time']
    search_fields = ['id', 'movie', 'cinemaHall']

class MyCinemaHall(admin.ModelAdmin):
    list_display = ['id', 'name', 'location', 'created_date', 'updated_date', 'active']
    search_fields = ['id', 'name', 'location']

class MyInvoice(admin.ModelAdmin):
    list_display = ['id', 'total_amount', 'final_amount', 'payment_status', 'active']
    search_fields = ['id', 'discount']

class MyPromotion(admin.ModelAdmin):
    list_display = ['code', 'promo_type', 'description', 'start_date', 'end_date', 'active']

class MyBooking(admin.ModelAdmin):
    list_display = ['seats', 'showtime', 'user', 'status']

class MyReview(admin.ModelAdmin):
    list_display = ['rating', 'movie', 'user']

# class MyGenre(admin.ModelAdmin):
#     list_display = ['id', 'genre']


admin.site.register(User, MyUser)
admin.site.register(Genre)
admin.site.register(Movie, MyMovie)
admin.site.register(Showtime, MyShowtime)
admin.site.register(CinemaHall, MyCinemaHall)
admin.site.register(Invoice, MyInvoice)
admin.site.register(Promotion, MyPromotion)
admin.site.register(Booking, MyBooking)
admin.site.register(Review, MyReview)


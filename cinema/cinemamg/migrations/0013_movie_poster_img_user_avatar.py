# Generated by Django 5.1 on 2024-08-31 18:17

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cinemamg', '0012_genre_remove_movie_genre_movie_genre'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='poster_img',
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
    ]
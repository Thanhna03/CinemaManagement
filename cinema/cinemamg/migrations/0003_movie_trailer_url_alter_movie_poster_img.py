# Generated by Django 5.1 on 2024-08-31 10:47

import cloudinary.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cinemamg', '0002_alter_movie_poster_img'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='trailer_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='poster_img',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True),
        ),
    ]

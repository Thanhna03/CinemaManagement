# Generated by Django 5.1 on 2024-09-30 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cinemamg', '0015_alter_movie_release_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='release_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
# Generated by Django 5.1 on 2024-09-24 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cinemamg', '0014_alter_review_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='release_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

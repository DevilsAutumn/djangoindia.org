# Generated by Django 5.1.2 on 2024-10-27 15:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0018_eventregistration_event_slug_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='eventregistration',
            name='event_slug',
        ),
    ]

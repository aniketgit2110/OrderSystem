# Generated by Django 4.2.7 on 2023-12-05 11:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0007_dealer_password'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dealer',
            name='password',
        ),
    ]

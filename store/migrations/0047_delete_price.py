# Generated by Django 4.2.7 on 2024-03-16 12:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0046_remove_order_urgent_orderedproduct'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Price',
        ),
    ]
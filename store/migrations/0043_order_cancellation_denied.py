# Generated by Django 4.2.7 on 2024-03-06 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0042_order_cancellation_approved_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='cancellation_denied',
            field=models.BooleanField(default=False, null=True),
        ),
    ]

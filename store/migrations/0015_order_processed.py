# Generated by Django 4.2.7 on 2023-12-14 04:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0014_alter_order_shipping_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='processed',
            field=models.BooleanField(default=False, null=True),
        ),
    ]

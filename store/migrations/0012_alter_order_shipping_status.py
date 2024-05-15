# Generated by Django 4.2.7 on 2023-12-07 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0011_delete_shipping_status_order_shipping_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='shipping_status',
            field=models.CharField(choices=[('Order Placed', 'Order Placed'), ('Out for Delivery', 'Out for Delivery'), ('Delivered', 'Delivered')], default='placed', max_length=50),
        ),
    ]

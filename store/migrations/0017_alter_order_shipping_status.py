# Generated by Django 4.2.7 on 2023-12-14 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0016_alter_order_shipping_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='shipping_status',
            field=models.CharField(choices=[('pending', 'Order Pending'), ('accepted', 'Order Accepted'), ('processing', 'Processing'), ('out_for_delivery', 'Out for Delivery'), ('delivered', 'Delivered')], default='pending', max_length=50),
        ),
    ]

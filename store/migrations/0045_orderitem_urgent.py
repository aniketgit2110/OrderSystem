# Generated by Django 4.2.7 on 2024-03-15 02:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0044_remove_product_price_remove_product_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='urgent',
            field=models.BooleanField(default=False, null=True),
        ),
    ]

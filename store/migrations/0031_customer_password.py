# Generated by Django 4.2.7 on 2024-02-15 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0030_alter_product_inventory'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='password',
            field=models.CharField(max_length=50, null=True),
        ),
    ]

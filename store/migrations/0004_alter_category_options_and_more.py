# Generated by Django 4.2.7 on 2023-11-27 13:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0003_shippingaddress_orderitem'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name_plural': 'categories'},
        ),
        migrations.RenameField(
            model_name='order',
            old_name='completed',
            new_name='complete',
        ),
    ]

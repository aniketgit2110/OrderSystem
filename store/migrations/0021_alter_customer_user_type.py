# Generated by Django 4.2.7 on 2024-01-04 02:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0020_rename_dealer_customer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='user_type',
            field=models.CharField(choices=[('admin', 'Admin'), ('manager', 'Manager'), ('staff', 'Staff'), ('customer', 'Customer')], max_length=50, null=True),
        ),
    ]

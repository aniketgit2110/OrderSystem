# Generated by Django 4.2.7 on 2024-02-24 06:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0035_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='price',
            name='name',
            field=models.CharField(max_length=50, null=True),
        ),
    ]

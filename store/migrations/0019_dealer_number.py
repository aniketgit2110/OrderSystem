# Generated by Django 4.2.7 on 2024-01-01 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0018_dealer_user_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='dealer',
            name='number',
            field=models.CharField(max_length=50, null=True),
        ),
    ]

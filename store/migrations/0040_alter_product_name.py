# Generated by Django 4.2.7 on 2024-02-28 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0039_alter_product_base_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='name',
            field=models.CharField(db_index=True, max_length=50, null=True),
        ),
    ]

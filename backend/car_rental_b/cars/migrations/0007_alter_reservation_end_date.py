# Generated by Django 5.1.6 on 2025-03-08 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0006_reservation_payment_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='end_date',
            field=models.DateTimeField(db_index=True),
        ),
    ]

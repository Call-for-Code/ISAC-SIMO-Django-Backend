# Generated by Django 3.0.2 on 2020-01-17 04:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20200114_1602'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_type',
            field=models.CharField(choices=[('user', 'User'), ('engineer', 'Engineer'), ('government', 'Government'), ('admin', 'Admin')], default='user', max_length=50),
        ),
    ]

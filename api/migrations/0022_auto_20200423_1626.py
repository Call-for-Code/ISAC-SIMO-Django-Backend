# Generated by Django 2.0 on 2020-04-23 10:41

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_offlinemodel'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offlinemodel',
            name='file',
            field=models.FileField(upload_to=api.models.PathAndRename('offline_models')),
        ),
    ]

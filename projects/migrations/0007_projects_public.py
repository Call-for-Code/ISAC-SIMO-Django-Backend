# Generated by Django 3.0.6 on 2020-11-25 09:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_projects_ibm_api_key'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='public',
            field=models.BooleanField(default=False),
        ),
    ]
# Generated by Django 3.0.6 on 2020-10-21 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_projects_guest'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='ibm_api_key',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]

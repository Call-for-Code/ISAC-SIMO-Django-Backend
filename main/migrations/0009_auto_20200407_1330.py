# Generated by Django 2.0 on 2020-04-07 07:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_user_projects'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='projects',
            field=models.ManyToManyField(blank=True, related_name='users', to='projects.Projects'),
        ),
    ]

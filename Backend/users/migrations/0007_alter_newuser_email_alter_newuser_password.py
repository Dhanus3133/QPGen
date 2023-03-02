# Generated by Django 4.1.1 on 2023-02-19 11:28

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_rename_email_verfied_newuser_email_verified'),
    ]

    operations = [
        migrations.AlterField(
            model_name='newuser',
            name='email',
            field=models.EmailField(max_length=150, validators=[users.models.validate_email]),
        ),
        migrations.AlterField(
            model_name='newuser',
            name='password',
            field=models.TextField(max_length=150),
        ),
    ]
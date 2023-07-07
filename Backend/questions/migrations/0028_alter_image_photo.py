# Generated by Django 4.1.1 on 2023-07-06 16:00

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0027_alter_image_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='photo',
            field=models.ImageField(null=True, upload_to='questions', validators=[django.core.validators.validate_image_file_extension]),
        ),
    ]

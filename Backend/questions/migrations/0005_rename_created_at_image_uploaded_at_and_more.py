# Generated by Django 4.1.1 on 2022-11-25 12:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0004_remove_image_name_alter_image_photo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='created_at',
            new_name='uploaded_at',
        ),
        migrations.RemoveField(
            model_name='image',
            name='updated_at',
        ),
    ]

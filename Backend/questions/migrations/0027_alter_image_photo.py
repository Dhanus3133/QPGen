# Generated by Django 4.1.1 on 2023-07-05 04:53

from django.db import migrations, models
import questions.models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0026_remove_topic_priority'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='photo',
            field=models.ImageField(null=True, upload_to='questions'),
        ),
    ]

# Generated by Django 4.1.1 on 2022-12-04 10:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0007_alter_question_created_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='topic',
            name='priority',
            field=models.BooleanField(default=False),
        ),
    ]
# Generated by Django 4.1.1 on 2022-09-14 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_alter_bloomstaxonomylevel_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='subject',
            name='co_description',
            field=models.CharField(default='nothing now', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='subject',
            name='course_outcome',
            field=models.TextField(default='nothing now'),
            preserve_default=False,
        ),
    ]

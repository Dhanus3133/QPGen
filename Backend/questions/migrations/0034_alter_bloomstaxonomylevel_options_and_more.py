# Generated by Django 4.2.4 on 2023-08-21 15:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0033_question_updated_by_alter_question_created_by'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bloomstaxonomylevel',
            options={'ordering': ['name']},
        ),
        migrations.AlterModelOptions(
            name='markrange',
            options={'ordering': ['start']},
        ),
    ]
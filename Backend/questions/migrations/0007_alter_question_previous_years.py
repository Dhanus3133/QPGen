# Generated by Django 4.1.1 on 2022-09-15 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0006_alter_question_end_mark_alter_question_start_mark'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='previous_years',
            field=models.ManyToManyField(blank=True, null=True, related_name='questions', to='questions.previousyearsqp'),
        ),
    ]

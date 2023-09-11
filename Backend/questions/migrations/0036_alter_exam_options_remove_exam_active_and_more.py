# Generated by Django 4.2.4 on 2023-08-26 07:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0035_exam_analysis_analysisbtl'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='exam',
            options={},
        ),
        migrations.RemoveField(
            model_name='exam',
            name='active',
        ),
        migrations.RemoveField(
            model_name='exam',
            name='choices',
        ),
        migrations.RemoveField(
            model_name='exam',
            name='counts',
        ),
        migrations.RemoveField(
            model_name='exam',
            name='label',
        ),
        migrations.RemoveField(
            model_name='exam',
            name='marks',
        ),
        migrations.RemoveField(
            model_name='exam',
            name='order',
        ),
        migrations.RemoveField(
            model_name='exam',
            name='time',
        ),
        migrations.RemoveField(
            model_name='exam',
            name='total',
        ),
        migrations.RemoveField(
            model_name='exam',
            name='units',
        ),
        migrations.CreateModel(
            name='ExamMark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=200, unique=True)),
                ('total', models.IntegerField()),
                ('marks', models.JSONField()),
                ('counts', models.JSONField()),
                ('choices', models.JSONField()),
                ('units', models.JSONField()),
                ('time', models.CharField(max_length=25)),
                ('order', models.PositiveIntegerField()),
                ('active', models.BooleanField(default=True)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='marks', to='questions.exam')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
    ]
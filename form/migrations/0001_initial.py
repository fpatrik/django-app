# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-01-08 09:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('js_file', models.FileField(upload_to='js_files')),
            ],
            options={
                'verbose_name': 'Form',
                'verbose_name_plural': 'Forms',
            },
        ),
    ]
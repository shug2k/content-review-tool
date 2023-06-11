# Generated by Django 4.2.2 on 2023-06-10 18:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_decisiontreecmt_create_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='reviewcmt',
            name='entity_content',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='decisiontreecmt',
            name='create_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='decisiontreecmt',
            name='update_time',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='queuecmt',
            name='create_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='queuecmt',
            name='update_time',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='reviewcmt',
            name='create_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]

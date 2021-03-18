# Generated by Django 3.1.5 on 2021-01-26 13:48

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("countries", "0001_country"),
    ]

    operations = [
        migrations.CreateModel(
            name="modeldaterange",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("initial_date", models.DateField()),
                ("maximum_date", models.DateField()),
                ("first_restrictions_date", models.DateField(null=True)),
                ("lockdown_date", models.DateField(null=True)),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="modeldaterange",
                        to="countries.country",
                    ),
                ),
            ],
        ),
    ]
"""Migrations for Django countries app"""
import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    """Migrations for Django countries app"""

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Country",
            fields=[
                (
                    "iso_code",
                    models.CharField(max_length=3, primary_key=True, serialize=False),
                ),
                ("area", models.PositiveIntegerField()),
                ("name", models.CharField(max_length=255)),
                ("population", models.PositiveIntegerField(null=True)),
                (
                    "geometry",
                    django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326),
                ),
            ],
        ),
    ]

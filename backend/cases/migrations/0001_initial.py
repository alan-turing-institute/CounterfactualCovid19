"""Migrations for Django cases app"""
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    """Migrations for Django cases app"""

    initial = True

    dependencies = [
        ("countries", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="CasesRecord",
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
                ("date", models.DateField()),
                ("weekly_avg_cases", models.FloatField()),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="cases_records",
                        to="countries.country",
                    ),
                ),
            ],
            options={
                "unique_together": {("country", "date")},
            },
        ),
    ]

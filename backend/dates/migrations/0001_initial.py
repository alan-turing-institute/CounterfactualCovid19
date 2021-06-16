"""Migrations for Django dates app"""

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    """Migrations for Django dates app"""

    initial = True

    dependencies = [
        ("countries", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="CountryDateSet",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("initial_date", models.DateField()),
                ("maximum_date", models.DateField()),
                ("first_restrictions_date", models.DateField(null=True)),
                ("lockdown_date", models.DateField(null=True)),
                ("first_case_date", models.DateField(null=True)),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="CountryDateSet",
                        to="countries.country",
                    ),
                ),
            ],
            options={
                "unique_together": {
                    ("country", "first_restrictions_date", "lockdown_date")
                },
            },
        ),
        migrations.CreateModel(
            name="KnotDateSet",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("knot_date_1", models.DateField(null=True)),
                ("knot_date_2", models.DateField(null=True)),
                ("n_knots", models.IntegerField()),
                ("growth_factor_0_1", models.FloatField(null=True)),
                ("growth_factor_1_2", models.FloatField(null=True)),
                ("growth_factor_2_3", models.FloatField(null=True)),
                ("weight", models.IntegerField(null=True)),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="KnotDateSet",
                        to="countries.country",
                    ),
                ),
            ],
            options={
                "unique_together": {("country", "knot_date_1", "knot_date_2")},
            },
        ),
        migrations.CreateModel(
            name="PossibleDateSet",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("n_days_first_restrictions", models.IntegerField(null=True)),
                ("n_days_lockdown", models.IntegerField(null=True)),
                (
                    "dates_counterfactual_first_restrictions",
                    models.DateField(null=True),
                ),
                ("dates_counterfactual_lockdown", models.DateField(null=True)),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="PossibleDateSet",
                        to="countries.country",
                    ),
                ),
            ],
            options={
                "unique_together": {
                    (
                        "country",
                        "dates_counterfactual_first_restrictions",
                        "dates_counterfactual_lockdown",
                    )
                },
            },
        ),
    ]

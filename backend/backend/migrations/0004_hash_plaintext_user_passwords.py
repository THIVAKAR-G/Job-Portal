from django.conf import settings
from django.contrib.auth.hashers import identify_hasher, make_password
from django.db import migrations


def hash_plaintext_passwords(apps, schema_editor):
    app_label, model_name = settings.AUTH_USER_MODEL.split('.')
    User = apps.get_model(app_label, model_name)

    for user in User.objects.all():
        try:
            identify_hasher(user.password)
        except ValueError:
            user.password = make_password(user.password)
            user.save(update_fields=['password'])


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_application_unique_application_per_job_applicant'),
    ]

    operations = [
        migrations.RunPython(hash_plaintext_passwords, migrations.RunPython.noop),
    ]

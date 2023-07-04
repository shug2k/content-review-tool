from django.db import models
from . import validators


class DecisionTreeCR(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    name = models.CharField(128, unique=True, db_index=True)
    tree = models.JSONField(validators=[validators.DecisionTreeValidator.validate_tree])

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @staticmethod
    def default_decision_tree():
        return {
            "start_question_tag": "is_violating",
            "questions": [
                {
                    "tag": "is_violating",
                    "text": "Is this content violating?",
                    "answers": [
                        {"tag": "yes", "text": "Yes", "decision": "yes_violating"},
                        {"tag": "no", "text": "No", "decision": "no_violating"},
                    ],
                }
            ],
        }


class QueueCR(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    name = models.CharField(128, unique=True, db_index=True)
    decision_tree = models.ForeignKey(
        DecisionTreeCR, on_delete=models.CASCADE, default=None, blank=True, null=True
    )
    prioritization_function = models.JSONField(default=None, blank=True, null=True)


class ReviewCR(models.Model):
    class EntityTypeChoices(models.TextChoices):
        TEXT = "text"
        IMAGE = "image"

    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    entity_id = models.CharField(128, default=None, blank=True, null=True)
    entity_type = models.CharField(128, choices=EntityTypeChoices.choices)
    entity_content = models.TextField()
    entity_create_time = models.DateTimeField(default=None, blank=True, null=True)
    entity_metadata = models.JSONField(default=None, blank=True, null=True)
    user_id = models.CharField(128, default=None, blank=True, null=True)
    user_name = models.CharField(128, default=None, blank=True, null=True)
    user_email = models.CharField(128, default=None, blank=True, null=True)
    user_phone_number = models.CharField(128, default=None, blank=True, null=True)
    user_metadata = models.JSONField(default=None, blank=True, null=True)
    queue = models.ForeignKey(
        QueueCR, on_delete=models.CASCADE, default=None, blank=True, null=True
    )
    questions_with_answers = models.JSONField(default=None, blank=True, null=True)
    score = models.FloatField(default=None, blank=True, null=True)

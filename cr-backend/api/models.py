from django.db import models
from . import validators


class DecisionTreeCR(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    name = models.CharField(128)
    tree = models.JSONField(validators=[validators.DecisionTreeValidator.validate_tree])


class QueueCR(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    name = models.CharField(128)
    decision_tree = models.ForeignKey(
        DecisionTreeCR, on_delete=models.CASCADE, default=None, blank=True, null=True
    )
    prioritization_function = models.JSONField(default=None, blank=True, null=True)


class ReviewCR(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    entity_id = models.CharField(128, default=None, blank=True, null=True)
    entity_type = models.CharField(128, default=None, blank=True, null=True)
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

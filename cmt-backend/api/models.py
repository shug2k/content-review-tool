from django.db import models
from django.utils import timezone


class DecisionTreeCMT(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    name = models.CharField(128)
    tree = models.JSONField()


class QueueCMT(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    name = models.CharField(128)
    decision_tree = models.ForeignKey(
        DecisionTreeCMT, on_delete=models.CASCADE, default=None, blank=True, null=True
    )
    prioritization_function = models.JSONField(default=None, blank=True, null=True)


class ReviewCMT(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField()
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
        QueueCMT, on_delete=models.CASCADE, default=None, blank=True, null=True
    )
    questions_with_answers = models.JSONField(default=None, blank=True, null=True)
    score = models.FloatField(default=None, blank=True, null=True)

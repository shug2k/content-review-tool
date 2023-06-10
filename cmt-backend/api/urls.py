from django.urls import path

from . import routes

urlpatterns = [
    path("queues/", routes.get_queues),
    path("create-queue/", routes.create_queue),
]

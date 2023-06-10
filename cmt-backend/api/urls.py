from django.urls import path

from . import routes

urlpatterns = [
    path("queues/", routes.QueueRoutes.get_queues),
    path("create-queue/", routes.QueueRoutes.create_queue),
    path("modify-queue/<int:queue_id>/", routes.QueueRoutes.modify_queue),
    path("queue/<int:queue_id>/", routes.QueueRoutes.get_reviews_for_queue),
]

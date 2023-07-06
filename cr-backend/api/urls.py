"""
Copyright 2023, Sagnik Ghosh

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from django.urls import path

from . import routes

urlpatterns = [
    # Queues
    path("queues", routes.QueueRoutes.get_queues),
    path("create-queue", routes.QueueRoutes.create_queue),
    path("modify-queue/<str:queue_name>", routes.QueueRoutes.modify_queue),
    path("delete-queue/<str:queue_name>", routes.QueueRoutes.delete_queue),
    path("queue/<int:queue_id>", routes.QueueRoutes.get_reviews_for_queue),
    # Reviews
    path("review/<int:review_id>", routes.ReviewRoutes.get_review),
    path(
        "review/<int:review_id>/store-result", routes.ReviewRoutes.store_review_result
    ),
    path("create-review", routes.ReviewRoutes.create_review),
    path("modify-review/<int:review_id>", routes.ReviewRoutes.modify_review),
    path("delete-review/<int:review_id>", routes.ReviewRoutes.delete_review),
    # Decision Trees
    path("create-decision-tree", routes.DecisionTreeRoutes.create_decision_tree),
    path(
        "modify-decision-tree/<str:decision_tree_name>",
        routes.DecisionTreeRoutes.modify_decision_tree,
    ),
    path(
        "delete-decision-tree/<str:decision_tree_name>",
        routes.DecisionTreeRoutes.delete_decision_tree,
    ),
]

import bisect
import json

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import IntegrityError
from django.http import (
    JsonResponse,
    HttpResponse,
    HttpRequest,
    HttpResponseNotAllowed,
    HttpResponseBadRequest,
    HttpResponseNotFound,
)
from api.models import QueueCR, DecisionTreeCR, ReviewCR


class QueueRoutes:
    @staticmethod
    def get_queues(request: HttpRequest) -> JsonResponse:
        if request.method != "GET":
            return HttpResponseNotAllowed(["GET"])

        queues = QueueCR.objects.all().order_by("name")
        queue_array = [
            {
                "id": q.id,
                "name": q.name,
                "item_count": ReviewCR.objects.filter(
                    queue_id=q.id, questions_with_answers__isnull=True
                ).count(),
            }
            for q in queues
        ]

        return JsonResponse({"queues": queue_array})

    @staticmethod
    def create_queue(request: HttpRequest) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        request_data = json.loads(request.body)

        try:
            QueueCR.objects.create(
                name=request_data["name"],
                decision_tree=DecisionTreeCR.objects.get(
                    name=request_data["decision_tree_name"]
                )
                if "decision_tree_name" in request_data
                else None,
                prioritization_function=request_data.get("prioritization_function"),
            )
        except ObjectDoesNotExist:
            return HttpResponseBadRequest(
                f"decision tree '{request_data['decision_tree_name']}' does not exist!"
            )

        return HttpResponse("OK")

    @staticmethod
    def modify_queue(request: HttpRequest, queue_name: str) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        request_data = json.loads(request.body)

        try:
            queue = QueueCR.objects.get(name=queue_name)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest(
                f"Queue '{queue_name}' does not exist! Please create it first"
            )

        if "name" in request_data:
            queue.name = request_data["name"]
        if "decision_tree_name" in request_data:
            try:
                queue.decision_tree = DecisionTreeCR.objects.get(
                    name=request_data["decision_tree_name"]
                )
            except ObjectDoesNotExist:
                return HttpResponseBadRequest(
                    f"decision tree '{request_data['decision_tree_name']}' does not exist!"
                )
        if "prioritization_function" in request_data:
            queue.prioritization_function = request_data["prioritization_function"]

        try:
            queue.save()
        except IntegrityError:
            return HttpResponseBadRequest(
                f"Queue name '{request_data['name']}' already exists! Please use a different name"
            )

        return HttpResponse("OK")

    @staticmethod
    def delete_queue(request: HttpRequest, queue_name: str) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        try:
            queue = QueueCR.objects.get(name=queue_name)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest(f"Queue '{queue_name}' does not exist!")

        queue.delete()

        return HttpResponse("OK")

    @staticmethod
    def get_reviews_for_queue(request: HttpRequest, queue_id: int) -> JsonResponse:
        if request.method != "GET":
            return HttpResponseNotAllowed(["GET"])

        reviews = ReviewCR.objects.filter(
            queue_id=queue_id, questions_with_answers__isnull=True
        ).order_by("create_time")
        review_array = [
            {"id": r.id, "entity_id": r.entity_id, "entity_type": r.entity_type}
            for r in reviews
        ]

        return JsonResponse({"reviews": review_array})


class ReviewRoutes:
    @staticmethod
    def get_review_response(
        review: ReviewCR,
        prev_review_id: int | None = None,
        next_review_id: int | None = None,
    ) -> JsonResponse:
        return JsonResponse(
            {
                "entity_id": review.entity_id,
                "entity_type": review.entity_type,
                "entity_content": review.entity_content,
                "entity_create_time": review.entity_create_time,
                "entity_metadata": review.entity_metadata,
                "user_id": review.user_id,
                "user_name": review.user_name,
                "user_email": review.user_email,
                "user_phone_number": review.user_phone_number,
                "user_metadata": review.user_metadata,
                "queue_id": review.queue_id,
                "prev_review_id": prev_review_id,
                "next_review_id": next_review_id,
                "decision_tree": review.queue.decision_tree.tree
                if review.queue.decision_tree
                else DecisionTreeCR.default_decision_tree(),
            }
        )

    @staticmethod
    def get_review(request: HttpRequest, review_id: int) -> JsonResponse:
        if request.method != "GET":
            return HttpResponseNotAllowed(["GET"])

        try:
            review = ReviewCR.objects.get(id=review_id)
        except ObjectDoesNotExist:
            return HttpResponseNotFound(
                f"Review ID {review_id} does not exist on this server"
            )

        next_review_id = None
        prev_review_id = None
        queue_reviews = list(
            ReviewCR.objects.filter(
                queue_id=review.queue.id, questions_with_answers__isnull=True
            ).order_by("create_time")
        )

        prev_review_idx = bisect.bisect_left(
            queue_reviews, review.create_time, key=lambda x: x.create_time
        )
        if prev_review_idx > 0:
            prev_review_id = queue_reviews[prev_review_idx - 1].id

        next_review_idx = bisect.bisect(
            queue_reviews, review.create_time, key=lambda x: x.create_time
        )
        if next_review_idx < len(queue_reviews):
            next_review_id = queue_reviews[next_review_idx].id

        return ReviewRoutes.get_review_response(review, prev_review_id, next_review_id)

    @staticmethod
    def create_review(request: HttpRequest) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        request_data = json.loads(request.body)

        if (
            "entity_type" not in request_data
            or "entity_content" not in request_data
            or "queue_name" not in request_data
        ):
            return HttpResponseBadRequest(
                "Review requires an entity_type, entity_content, and queue_name"
            )

        try:
            ReviewCR.objects.create(
                entity_id=request_data.get("entity_id"),
                entity_type=request_data["entity_type"],
                entity_content=request_data["entity_content"],
                entity_create_time=request_data.get("entity_create_time"),
                entity_metadata=request_data.get("entity_metadata"),
                user_id=request_data.get("user_id"),
                user_name=request_data.get("user_name"),
                user_email=request_data.get("user_email"),
                user_phone_number=request_data.get("user_phone_number"),
                user_metadata=request_data.get("user_metadata"),
                queue=QueueCR.objects.get(name=request_data["queue_name"]),
            )
        except ValidationError as e:
            return HttpResponseBadRequest(e)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest(
                f"queue '{request_data['queue_name']}' does not exist!"
            )

        return HttpResponse("OK")

    @staticmethod
    def modify_review(request: HttpRequest, review_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        request_data = json.loads(request.body)

        try:
            review = ReviewCR.objects.get(id=review_id)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest(f"Review {review_id} does not exist!")

        if "entity_id" in request_data:
            review.entity_id = request_data["entity_id"]
        if "entity_type" in request_data:
            review.entity_type = request_data["entity_type"]
        if "entity_content" in request_data:
            review.entity_content = request_data["entity_content"]
        if "entity_create_time" in request_data:
            review.entity_create_time = request_data["entity_create_time"]
        if "entity_metadata" in request_data:
            review.entity_metadata = request_data["entity_metadata"]
        if "user_id" in request_data:
            review.user_id = request_data["user_id"]
        if "user_name" in request_data:
            review.user_name = request_data["user_name"]
        if "user_email" in request_data:
            review.user_email = request_data["user_email"]
        if "user_phone_number" in request_data:
            review.user_phone_number = request_data["user_phone_number"]
        if "user_metadata" in request_data:
            review.user_metadata = request_data["user_metadata"]
        if "queue_name" in request_data:
            try:
                review.queue = QueueCR.objects.get(name=request_data["queue_name"])
            except ObjectDoesNotExist:
                return HttpResponseBadRequest(
                    f"queue '{request_data['queue_name']}' does not exist!"
                )

        try:
            review.save()
        except ValidationError as e:
            return HttpResponseBadRequest(e)

        return HttpResponse("OK")

    @staticmethod
    def store_review_result(request: HttpRequest, review_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        request_data = json.loads(request.body)

        review = ReviewCR.objects.get(id=review_id)

        review.questions_with_answers = request_data["questions_with_answers"]

        review.save()

        return HttpResponse("OK")

    @staticmethod
    def delete_review(request: HttpRequest, review_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        try:
            review = ReviewCR.objects.get(id=review_id)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest(f"Review {review_id} does not exist!")

        review.delete()

        return HttpResponse("OK")


class DecisionTreeRoutes:
    @staticmethod
    def create_decision_tree(request: HttpRequest) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        request_data = json.loads(request.body)

        try:
            DecisionTreeCR.objects.create(
                name=request_data["name"],
                tree=request_data["tree"],
            )
        except ValidationError as e:
            return HttpResponseBadRequest(e)

        return HttpResponse("OK")

    @staticmethod
    def modify_decision_tree(
        request: HttpRequest, decision_tree_name: str
    ) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        request_data = json.loads(request.body)

        try:
            decision_tree = DecisionTreeCR.objects.get(name=decision_tree_name)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest(
                f"Decision tree '{decision_tree_name}' does not exist!"
            )

        if "name" in request_data:
            decision_tree.name = request_data["name"]
        if "decision_tree" in request_data:
            decision_tree.tree = request_data["decision_tree"]

        try:
            decision_tree.save()
        except ValidationError as e:
            return HttpResponseBadRequest(e)

        return HttpResponse("OK")

    @staticmethod
    def delete_decision_tree(
        request: HttpRequest, decision_tree_name: str
    ) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        try:
            decision_tree = DecisionTreeCR.objects.get(name=decision_tree_name)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest(
                f"Decision tree '{decision_tree_name}' does not exist!"
            )

        decision_tree.delete()

        return HttpResponse("OK")

import bisect

from django.http import JsonResponse, HttpResponse, HttpRequest, HttpResponseNotAllowed
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
                "item_count": ReviewCR.objects.filter(queue_id=q.id).count(),
            }
            for q in queues
        ]

        return JsonResponse({"queues": queue_array})

    @staticmethod
    def create_queue(request: HttpRequest) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        queue = QueueCR(
            name=request.POST["name"],
            decision_tree_id=request.POST.get("decision_tree_id"),
            prioritization_function=request.POST.get("prioritization_function"),
        )

        queue.save()

        return HttpResponse("OK")

    @staticmethod
    def modify_queue(request: HttpRequest, queue_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        queue = QueueCR.objects.get(id=queue_id)

        if request.POST.get("name") is not None:
            queue.name = request.POST.get("name")
        if request.POST.get("decision_tree_id") is not None:
            queue.decision_tree_id = request.POST.get("decision_tree_id")
        if request.POST.get("prioritization_function") is not None:
            queue.prioritization_function = request.POST.get("prioritization_function")

        queue.save()

        return HttpResponse("OK")

    @staticmethod
    def delete_queue(request: HttpRequest, queue_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        queue = QueueCR.objects.get(id=queue_id)

        queue.delete()

        return HttpResponse("OK")

    @staticmethod
    def get_reviews_for_queue(request: HttpRequest, queue_id: int) -> JsonResponse:
        if request.method != "GET":
            return HttpResponseNotAllowed(["GET"])

        reviews = ReviewCR.objects.filter(queue_id=queue_id).order_by("create_time")
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
                "decision_tree": review.queue.decision_tree.tree,
            }
        )

    @staticmethod
    def get_review(request: HttpRequest, review_id: int) -> JsonResponse:
        if request.method != "GET":
            return HttpResponseNotAllowed(["GET"])

        review = ReviewCR.objects.get(id=review_id)

        next_review_id = None
        prev_review_id = None
        queue_reviews = list(
            ReviewCR.objects.filter(queue_id=review.queue.id).order_by("create_time")
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

        review = ReviewCR(
            entity_id=request.POST.get("entity_id"),
            entity_type=request.POST.get("entity_type"),
            entity_content=request.POST.get("entity_content"),
            entity_create_time=request.POST.get("entity_create_time"),
            entity_metadata=request.POST.get("entity_metadata"),
            user_id=request.POST.get("user_id"),
            user_name=request.POST.get("user_name"),
            user_email=request.POST.get("user_email"),
            user_phone_number=request.POST.get("user_phone_number"),
            user_metadata=request.POST.get("user_metadata"),
            queue_id=request.POST.get("queue_id"),
        )

        review.save()

        return HttpResponse("OK")

    @staticmethod
    def modify_review(request: HttpRequest, review_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        review = ReviewCR.objects.get(id=review_id)

        if request.POST.get("entity_id") is not None:
            review.entity_id = request.POST.get("entity_id")
        if request.POST.get("entity_type") is not None:
            review.entity_type = request.POST.get("entity_type")
        if request.POST.get("entity_content") is not None:
            review.entity_content = request.POST.get("entity_content")
        if request.POST.get("entity_create_time") is not None:
            review.entity_create_time = request.POST.get("entity_create_time")
        if request.POST.get("entity_metadata") is not None:
            review.entity_metadata = request.POST.get("entity_metadata")
        if request.POST.get("user_id") is not None:
            review.user_id = request.POST.get("user_id")
        if request.POST.get("user_name") is not None:
            review.user_name = request.POST.get("user_name")
        if request.POST.get("user_email") is not None:
            review.user_email = request.POST.get("user_email")
        if request.POST.get("user_phone_number") is not None:
            review.user_phone_number = request.POST.get("user_phone_number")
        if request.POST.get("user_metadata") is not None:
            review.user_metadata = request.POST.get("user_metadata")
        if request.POST.get("queue_id") is not None:
            review.queue_id = request.POST.get("queue_id")

        review.save()

        return HttpResponse("OK")

    @staticmethod
    def store_review_result(request: HttpRequest, review_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        review = ReviewCR.objects.get(id=review_id)

        if request.POST.get("questions_with_answers") is not None:
            review.questions_with_answers = request.POST.get("questions_with_answers")

        review.save()

        return HttpResponse("OK")

    @staticmethod
    def delete_review(request: HttpRequest, review_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        review = ReviewCR.objects.get(id=review_id)

        review.delete()

        return HttpResponse("OK")


class DecisionTreeRoutes:
    @staticmethod
    def create_decision_tree(request: HttpRequest) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        decision_tree = DecisionTreeCR(
            name=request.POST["name"],
            tree=request.POST.get("tree"),
        )

        decision_tree.save()

        return HttpResponse("OK")

    @staticmethod
    def modify_decision_tree(
        request: HttpRequest, decision_tree_id: int
    ) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        decision_tree = DecisionTreeCR.objects.get(id=decision_tree_id)

        if request.POST.get("name") is not None:
            decision_tree.name = request.POST.get("name")
        if request.POST.get("decision_tree") is not None:
            decision_tree.tree = request.POST.get("decision_tree")

        decision_tree.save()

        return HttpResponse("OK")

    @staticmethod
    def delete_decision_tree(
        request: HttpRequest, decision_tree_id: int
    ) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        decision_tree = DecisionTreeCR.objects.get(id=decision_tree_id)

        decision_tree.delete()

        return HttpResponse("OK")

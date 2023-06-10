from django.http import JsonResponse, HttpResponse, HttpRequest, HttpResponseNotAllowed
from api.models import QueueCMT, DecisionTreeCMT, ReviewCMT


class QueueRoutes:
    @staticmethod
    def get_queues(request: HttpRequest) -> JsonResponse:
        if request.method != "GET":
            return HttpResponseNotAllowed(["GET"])

        queues = QueueCMT.objects.all().order_by("name")
        queue_array = [{"id": q.id, "name": q.name} for q in queues]

        return JsonResponse({"queues": queue_array})

    @staticmethod
    def create_queue(request: HttpRequest) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        queue = QueueCMT(
            name=request.POST["name"],
            decision_tree_id=request.POST["decision_tree_id"]
            if "decision_tree_id" in request.POST
            else None,
            prioritization_function=request.POST["prioritization_function"]
            if "prioritization_function" in request.POST
            else None,
        )

        queue.save()

        return HttpResponse("OK")

    @staticmethod
    def modify_queue(request: HttpRequest, queue_id: int) -> HttpResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        queue = QueueCMT.objects.get(id=queue_id)
        if request.POST.get("name"):
            queue.name = request.POST.get("name")

        if request.POST.get("decision_tree_id"):
            queue.decision_tree_id = request.POST.get("decision_tree_id")

        if request.POST.get("prioritization_function"):
            queue.prioritization_function = request.POST.get("prioritization_function")

        queue.save()

        return HttpResponse("OK")

    @staticmethod
    def get_reviews_for_queue(request: HttpRequest, queue_id: int) -> JsonResponse:
        if request.method != "GET":
            return HttpResponseNotAllowed(["GET"])

        reviews = ReviewCMT.objects.filter(queue_id=queue_id).order_by("create_time")
        review_array = [
            {"id": r.id, "entity_id": r.entity_id, "entity_type": r.entity_type}
            for r in reviews
        ]

        return JsonResponse({"reviews": review_array})

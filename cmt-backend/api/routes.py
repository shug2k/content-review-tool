from django.http import JsonResponse, HttpResponse, HttpRequest, HttpResponseNotAllowed
from api.models import QueueCMT, DecisionTreeCMT


def get_queues(request: HttpRequest) -> JsonResponse:
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    queues = QueueCMT.objects.all()
    queue_array = []
    for q in queues:
        queue_array.append({"id": q.id, "name": q.name})

    response = {"queues": queue_array}

    return JsonResponse(response)


def create_queue(request: HttpRequest) -> HttpResponse:
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    queue = QueueCMT(
        name=request.POST["name"],
        decision_tree=DecisionTreeCMT.objects.get(id=request.POST["decision_tree_id"])
        if "decision_tree_id" in request.POST
        else None,
        prioritization_function=request.POST["prioritization_function"]
        if "prioritization_function" in request.POST
        else None,
    )

    queue.save()

    return HttpResponse("OK")

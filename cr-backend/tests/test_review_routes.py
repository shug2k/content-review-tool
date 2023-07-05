import pytest
import json

from api.models import DecisionTreeCR, ReviewCR


@pytest.mark.django_db
def test_get_review_route(client, text_review):
    response = client.get("/review/" + str(text_review.id))

    data = json.loads(response.content)

    assert response.status_code == 200
    assert data["entity_id"] == text_review.entity_id
    assert data["entity_type"] == "text"
    assert data["entity_content"] == text_review.entity_content
    assert data["user_id"] == text_review.user_id
    assert data["user_email"] == text_review.user_email
    assert data["user_phone_number"] == text_review.user_phone_number
    assert data["queue_id"] == text_review.queue.id
    assert data["prev_review_id"] is None
    assert data["next_review_id"] is None
    assert (
        data["decision_tree"]["start_question_tag"]
        == DecisionTreeCR.default_decision_tree()["start_question_tag"]
    )


@pytest.mark.django_db
def test_get_review_route_pulls_tree(client, text_review_q2, base_decision_tree):
    response = client.get("/review/" + str(text_review_q2.id))

    data = json.loads(response.content)

    assert response.status_code == 200
    # assumes queue_2 has base_decision_tree (see conftest.py for setup)
    assert (
        data["decision_tree"]["start_question_tag"]
        == base_decision_tree.tree["start_question_tag"]
    )


@pytest.mark.django_db
def test_get_review_route_has_next(client, text_review, image_review):
    response = client.get("/review/" + str(text_review.id))

    data = json.loads(response.content)

    # note: the following is dependent on image_review being created after text_review
    assert response.status_code == 200
    assert data["prev_review_id"] is None
    assert data["next_review_id"] == image_review.id


@pytest.mark.django_db
def test_get_review_route_has_prev(client, text_review, image_review):
    response = client.get("/review/" + str(image_review.id))

    data = json.loads(response.content)

    # note: the following is dependent on image_review being created after text_review
    assert response.status_code == 200
    assert data["prev_review_id"] == text_review.id
    assert data["next_review_id"] is None


@pytest.mark.django_db
def test_get_review_route_wrong_review(client, text_review):
    response = client.get("/review/" + str(text_review.id + 102315))

    assert response.status_code == 404
    assert (
        response.content.decode()
        == f"Review ID {text_review.id + 102315} does not exist on this server"
    )


@pytest.mark.django_db
def test_create_review_route(client, queue_1):
    response = client.post(
        "/create-review",
        {
            "entity_id": "123",
            "entity_type": "image",
            "entity_content": "http://www.image.com/something",
            "queue_name": queue_1.name,
        },
        content_type="application/json",
    )

    assert response.status_code == 200

    review = ReviewCR.objects.get(entity_id="123")
    assert review.entity_type == "image"
    assert review.entity_content == "http://www.image.com/something"
    assert review.queue.id == queue_1.id


@pytest.mark.django_db
def test_create_review_route_wrong_entity_type(client, queue_1):
    response = client.post(
        "/create-review",
        {
            "entity_id": "125",
            "entity_type": "img",
            "entity_content": "http://www.image.com/something",
            "queue_name": queue_1.name,
        },
        content_type="application/json",
    )
    assert response.status_code == 400
    assert "'img' is not a valid choice" in response.content.decode()


@pytest.mark.django_db
def test_create_review_route_content_not_url_for_image(client, queue_1):
    response = client.post(
        "/create-review",
        {
            "entity_id": "125",
            "entity_type": "image",
            "entity_content": "Some random text",
            "queue_name": queue_1.name,
        },
        content_type="application/json",
    )
    assert response.status_code == 400
    assert (
        response.content.decode()
        == "For entity_type 'image', entity_content must be a valid URL!"
    )


@pytest.mark.django_db
def test_create_review_route_missing_queue(client, queue_1):
    response = client.post(
        "/create-review",
        {
            "entity_id": "125",
            "entity_type": "image",
            "entity_content": "Some random text",
        },
        content_type="application/json",
    )
    assert response.status_code == 400
    assert (
        response.content.decode()
        == "Review requires an entity_type, entity_content, and queue_name"
    )


@pytest.mark.django_db
def test_create_review_route_wrong_queue(client, queue_1):
    response = client.post(
        "/create-review",
        {
            "entity_id": "125",
            "entity_type": "image",
            "entity_content": "Some random text",
            "queue_name": "Random queue",
        },
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.content.decode() == "queue 'Random queue' does not exist!"


@pytest.mark.django_db
def test_modify_review_route(client, text_review, queue_2):
    response = client.post(
        "/modify-review/" + str(text_review.id),
        {
            "entity_id": "128",
            "entity_type": "image",
            "entity_content": "http://www.image.com/test",
            "user_id": "100",
            "user_name": "Jane Doe",
            "user_email": "jane@doe.com",
            "user_phone_number": "+17771234567",
            "queue_name": queue_2.name,
        },
        content_type="application/json",
    )

    assert response.status_code == 200

    review = ReviewCR.objects.get(id=text_review.id)

    assert review.entity_id == "128"
    assert review.entity_type == "image"
    assert review.entity_content == "http://www.image.com/test"
    assert review.user_id == "100"
    assert review.user_name == "Jane Doe"
    assert review.user_email == "jane@doe.com"
    assert review.user_phone_number == "+17771234567"
    assert review.queue.id == queue_2.id


@pytest.mark.django_db
def test_modify_review_route_wrong_queue(client, text_review):
    response = client.post(
        "/modify-review/" + str(text_review.id),
        {
            "queue_name": "Random Queue",
        },
        content_type="application/json",
    )

    assert response.status_code == 400
    assert response.content.decode() == "queue 'Random Queue' does not exist!"


@pytest.mark.django_db
def test_modify_review_route_missing_review(client):
    response = client.post(
        "/modify-review/104",
        {
            "entity_id": "111",
        },
        content_type="application/json",
    )

    assert response.status_code == 400
    assert response.content.decode() == "Review 104 does not exist!"


@pytest.mark.django_db
def test_modify_review_route_validate_entity_type(client, text_review):
    response = client.post(
        "/modify-review/" + str(text_review.id),
        {
            "entity_type": "img",
        },
        content_type="application/json",
    )

    assert response.status_code == 400
    assert "is not a valid choice." in response.content.decode()


@pytest.mark.django_db
def test_modify_review_route_image_needs_url(client, text_review):
    response = client.post(
        "/modify-review/" + str(text_review.id),
        {
            "entity_type": "image",
        },
        content_type="application/json",
    )

    assert response.status_code == 400
    assert (
        response.content.decode()
        == "For entity_type 'image', entity_content must be a valid URL!"
    )

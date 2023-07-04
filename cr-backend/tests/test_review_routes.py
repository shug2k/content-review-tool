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

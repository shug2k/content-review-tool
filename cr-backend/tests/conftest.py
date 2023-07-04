import pytest

from api.models import QueueCR, DecisionTreeCR, ReviewCR


@pytest.fixture
def base_decision_tree():
    return DecisionTreeCR.objects.create(
        name="test2",
        tree={
            "start_question_tag": "q1",
            "questions": [
                {
                    "tag": "q1",
                    "text": "Question 1",
                    "answers": [
                        {
                            "tag": "a1",
                            "text": "Answer 1",
                        },
                        {
                            "tag": "a2",
                            "text": "Answer 2",
                        },
                    ],
                }
            ],
        },
    )


@pytest.fixture
def queue_1():
    return QueueCR.objects.create(
        name="Test Queue 1",
    )


@pytest.fixture
def queue_2(base_decision_tree):
    return QueueCR.objects.create(
        name="Test Queue 2",
        decision_tree=base_decision_tree,
    )


@pytest.fixture
def text_review(queue_1):
    return ReviewCR.objects.create(
        entity_id="1",
        entity_type="text",
        entity_content="Testing out",
        entity_create_time="2023-01-01 12:00:01Z",
        user_id="10",
        user_name="John Doe",
        user_email="john@doe.com",
        user_phone_number="+15555555555",
        queue=queue_1,
    )


@pytest.fixture
def text_review_q2(queue_2):
    return ReviewCR.objects.create(
        entity_id="2",
        entity_type="text",
        entity_content="Testing out queue 2 with tree",
        entity_create_time="2023-01-03 12:00:01Z",
        queue=queue_2,
    )


@pytest.fixture
def image_review(queue_1):
    return ReviewCR.objects.create(
        entity_id="3",
        entity_type="image",
        entity_content="http://www.image.com/test",
        entity_create_time="2023-02-01 01:00:01Z",
        queue=queue_1,
    )

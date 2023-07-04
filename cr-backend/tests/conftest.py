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

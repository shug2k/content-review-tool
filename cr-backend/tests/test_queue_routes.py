import pytest


class TestQueueRoutes:
    @pytest.mark.django_db
    def test_queues_route(self, client):
        response = client.get("/queues")
        assert response.status_code == 200

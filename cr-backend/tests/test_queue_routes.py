import pytest

class TestClassDemoInstance:
    value = 0

    @pytest.mark.django_db
    def test_one(self, client):
        response = client.get('/queues')
        assert response.status_code == 200

from django.urls import path

from . import routes

urlpatterns = [
    path("", routes.index, name="index"),
]
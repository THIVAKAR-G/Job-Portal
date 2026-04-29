
from django.contrib import admin
from django.urls import path
from .views import hello_api, register_user, basic_login, job_list, job_detail, apply_job

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", hello_api, name="home"),
    path("hello/", hello_api, name="hello_api"),
    path("register", register_user),
    path("login", basic_login),
    path("jobs",job_list),
    path("jobs/<int:job_id>", job_detail),
    path("apply", apply_job)
]

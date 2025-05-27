from django.contrib import admin
from django.urls import path, include
from api.views import GetCreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", GetCreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    # path("api/rubric", CreateRubricView.as_view(), name="create-rubric"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
]

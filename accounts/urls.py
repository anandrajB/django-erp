from django.urls import path, include
from api.api import GetPostAPI, PutAPI
from .views import (UserRegistration, Changepassword,
                    Login, UserCRUD, ProfileView, LogoutAPIView, Userprofile)
urlpatterns = [
    path('signup/', UserRegistration.as_view()),
    path('user/<int:pk>', UserCRUD.as_view()),
    path('login/', Login.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('change-password/', Changepassword.as_view()),
    path('api/', GetPostAPI.as_view()),
    path('put/<int:pk>/', PutAPI.as_view()),
    path('userprofile/', Userprofile.as_view())
]

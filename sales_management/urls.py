from django.urls import path, include
from .views import Sales_order_api

# from .views import *
urlpatterns = [
    path('sales-order', Sales_order_api.as_view())
]

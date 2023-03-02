from django.urls import path, include
from .views import Purchase_request_api, ProductionOrderAPI, transfer_request_submit
# from .views import *
urlpatterns = [
    path('purchase-request', Purchase_request_api.as_view()),
    path('production-order', ProductionOrderAPI.as_view()),
    path('transfer_submit', transfer_request_submit.as_view()),
]

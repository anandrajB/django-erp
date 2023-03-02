from django.shortcuts import render
from .serializer import *

from rest_framework.views import APIView
from rest_framework.generics import (ListAPIView,ListCreateAPIView,RetrieveUpdateDestroyAPIView,CreateAPIView)
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.status import (HTTP_100_CONTINUE,HTTP_200_OK,HTTP_400_BAD_REQUEST,HTTP_206_PARTIAL_CONTENT)
from django.http import JsonResponse, HttpResponse
from purchase_management.models import Purchase_inquiry
from purchase_management.serializer import purchase_inquiry_serializer,purchase_inquiry_create_serializer


<<<<<<< HEAD
# class purchase_inquiry_api(CreateAPIView):
#     serializer_class = purchase_inquiry_serializer
#     permission_classes = AllowAny
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         purchase_inquiry = Purchase_inquiry.objects.create(
#             procurement_user_id = self.request.user
#         )
#         PI_serializer = []
#         try:
#             for item in data['']:
#                 purchase_inquiry = Purchase_inquiry.get(id=item['id'])
 

               
=======
class purchase_inquiry_api(ListCreateAPIView):
    serializer_class = purchase_inquiry_create_serializer
    permission_classes = AllowAny
    # def get(self, request, *args, **kwargs):

    # def post(self, request, *args, **kwargs):
    #     data = request.data
    #     purchase_inquiry = Purchase_inquiry.objects.create(
    #         procurement_user_id = self.request.user,
    #     )
    #     PI_serializer = []
    #     try:
    #         for item in data['']:
    #             purchase_inquiry = Purchase_inquiry.get(id=item['id'])
    #     return Response({'status':'success','data':data})
>>>>>>> f7d73cf996666c72520929a35ea122b4deed087b

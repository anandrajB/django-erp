from accounts.serializer import *
from data_management.serializer import *
# from accounts.forms import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_401_UNAUTHORIZED, HTTP_206_PARTIAL_CONTENT,
    HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_203_NON_AUTHORITATIVE_INFORMATION, HTTP_206_PARTIAL_CONTENT
)
from rest_framework.generics import (
    RetrieveUpdateDestroyAPIView,
)
from django.shortcuts import get_object_or_404
from .db import get_serializer,get_table,get_model
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
# app_data = {'branch': {'model': Branch,
#                        'serializer': BranchSerializer, 'form': BranchForm}, 'product': {'model': Product, 'serializer': ProductSerializer, 'form': ProductForm}, }

class GetPostAPI(APIView):
    permission_classes = [AllowAny]
    def model(self):
        model_name=get_model(self.request)
        if model_name:
            return model_name
        return None

    def get_serializer_class(self):
        try:
            serializer=get_serializer(self.request)
            if serializer is not None:
                return serializer
            return NullSerializer
        except:
            return None

    def get_queryset(self):
        try:
            table=get_table(self.request)
            queryset=table.objects.all()
            return queryset
        except:
            return None

    def get(self, request, *args, **kwargs):
        model = request.query_params.get('model', None)
        print(model)
        if model:
            try:
                serializer = self.get_serializer_class()
                queryset = self.get_queryset()
                data = serializer(queryset, many=True)
                return Response(data.data, status=HTTP_200_OK)
            except Exception as e:
                return Response({"status": "Not Found", 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({"status": "Not Found", 'data': 'give a valid details'}, status=HTTP_206_PARTIAL_CONTENT)

    def post(self, request, *args, **kwargs):
        model = request.query_params.get('model', None)
        print(model)
        if model:
            try:
                model = self.model()
                serializer = self.get_serializer_class()
                data = serializer(data=request.data)
                if data.is_valid():
                    try:
                        print(model)
                        data.save(*args, **kwargs)
                        return Response({"status": "created", "data": data.data}, status=HTTP_200_OK)
                    except Exception as e:
                        return Response({"status": "Not Created", "data": data.errors}, status=HTTP_206_PARTIAL_CONTENT)
            except Exception as e:
                        return Response({"status": "Not Created", "data": str(e)}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({"status": "Not Found", 'data': 'give a valid details'}, status=HTTP_206_PARTIAL_CONTENT)


class PutAPI(RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    def model(self):
        model_name=get_model(self.request)
        if model_name:
            return model_name
        return None

    def get_serializer_class(self):
        try:
            serializer=get_serializer(self.request)
            if serializer is not None:
                return serializer
            return NullSerializer
        except:
            return None

    def get_queryset(self):
        model=self.model()
        if model:
            table=get_table(model)
            queryset=table.objects.all()
            return queryset
        else:
            return None

    def retrieve(self,request,pk):
        try:
            serializer= self.get_serializer_class()
            print(serializer)
            if serializer is not None:
                table=self.model()
                queryset = get_object_or_404(table,id=pk)
                serialize=serializer(queryset)
                return Response (serialize.data)
            else:
                print('No model exist')
                return Response({"status": "No Product", }, status=HTTP_206_PARTIAL_CONTENT)
        except Exception as e:
            return Response({"status": f"No Model Named {str(e)}" }, status=HTTP_206_PARTIAL_CONTENT)

    def update(self, request, pk):
        try:
            model=self.model()
            product = get_object_or_404(model, id=pk)
            get_serializer = self.get_serializer_class()
            if get_serializer is not None:
                serializer=get_serializer(product,request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=HTTP_200_OK)
            return Response({'status': 'failure', 'data': 'None'}, status=HTTP_206_PARTIAL_CONTENT)
        except Exception as e:
            return Response({'status': 'failure', 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)
    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     print(instance)
    #     self.perform_destroy(instance)
    #     return Response(status=HTTP_200_OK)
    
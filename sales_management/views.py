from django.shortcuts import render
from .serializer import *
from .models import *
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView, ListCreateAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView)
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_100_CONTINUE, HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_206_PARTIAL_CONTENT, HTTP_201_CREATED)
from django.http import JsonResponse, HttpResponse
from .serializer import sales_order_serializer, sales_order_items_serializer, sales_order_create_serializer
from .models import Sales_order, Sales_order_items, Sales_invoice
from rest_framework.permissions import AllowAny
from data_management.models import Product, Parties
from django.db.models import Q


class Sales_order_api(ListCreateAPIView, RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Sales_order.objects.all()

    def get_serializer_class(self):
        print(self.request)
        if self.request.method == 'GET':
            return sales_order_serializer
        return sales_order_create_serializer

    def get_queryset(self):
        pk = self.request.query_params.get('pk', None)
        status = self.request.query_params.get('status', None)
        print(pk)
        user = self.request.user
        if pk:
            return Sales_order.objects.get(sales_order_no=pk)
        return Sales_order.objects.filter(Q(status='new') | Q(status='modified'), sales_person_id=user.id)

    def list(self, request):
        pk = self.request.query_params.get('pk', None)
        queryset = Sales_order.objects.all()
        try:
            if pk:
                queryset = Sales_order.objects.get(sales_order_no=pk)
                data = sales_order_serializer(queryset)
            else:
                data = sales_order_serializer(queryset, many=True)
        except Exception as error:
            return Response({'status': 'failure', 'data': str(error)}, status=HTTP_200_OK)
        return Response({'status': 'success', 'data': data.data}, status=HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        data = request.data
        print('data0', data)
        id = request.query_params.get('id', None)
        if id:
            customer_id = Parties.objects.get(id=data['customer_id'])
            sales_order = Sales_order.objects.filter(pk=id).update(sales_person_id=self.request.user, customer_id=customer_id,
                                                                   date_delivery_expected=data['date_delivery_expected'], status='modified')
            sales_order = Sales_order.objects.get(pk=id)
            SO_serializer = sales_order_serializer(sales_order).data
            print('jos')
            SOI_serializer = []
            try:
                for item_id in data['sales_order_items_edit']:
                    item = data['sales_order_items_edit'][item_id]
                    product = Product.objects.get(id=int(item['product']))
                    sales_order_item = Sales_order_items.objects.filter(pk=item_id, sales_order_no=sales_order).update(sales_order_no=sales_order,
                                                                                                                       product=product, quantity_ordered=item[
                                                                                                                           'quantity_ordered'], unit_price=item['unit_price'],
                                                                                                                       payment_terms=data[
                                                                                                                           'payment_terms'], total_price=item['total_price'], due_date=data['due_date'], freight_charges_paid_by=data['freight_charges_paid_by'],
                                                                                                                       date_delivery_expected=data['date_delivery_expected'])
                    print(item_id, 'id')
                    sales_order_item = Sales_order_items.objects.get(
                        id=item_id)
                    serializer = sales_order_items_serializer(
                        sales_order_item)
                    SOI_serializer.append(
                        serializer.data)
                    print(item)
                for item_id in data['sales_order_items_list']:
                    # print(, 'items')
                    item = data['sales_order_items_list'][item_id]
                    product = Product.objects.get(id=int(item['product']))
                    sales_order_item = Sales_order_items.objects.create(sales_order_no=sales_order,
                                                                        product=product, quantity_ordered=item[
                                                                            'quantity_ordered'], unit_price=item['unit_price'],
                                                                        payment_terms=data[
                                                                            'payment_terms'], total_price=item['total_price'], due_date=data['due_date'], freight_charges_paid_by=data['freight_charges_paid_by'],
                                                                        date_delivery_expected=data['date_delivery_expected'])
                    serializer = sales_order_items_serializer(
                        sales_order_item)
                    SOI_serializer.append(
                        serializer.data)
                    print(item)

                for item_id in data['sales_order_items_delete']:

                    sales_order_item = Sales_order_items.objects.get(
                        pk=item_id)
                    sales_order_item.delete()
                result = {'sales_order': SO_serializer,
                          'sales_order_items': SOI_serializer}
            except Exception as error:
                return Response({'status': 'failure', 'data': str(error)}, status=HTTP_206_PARTIAL_CONTENT)
            return Response({'status': 'success', 'data': data}, status=HTTP_200_OK)
        else:
            return Response({'status': 'failure', 'data': 'give a valid primary key'}, status=HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        data = request.data
        customer_id = Parties.objects.get(id=data['customer_id'])
        sales_order = Sales_order.objects.create(
            sales_person_id=self.request.user, customer_id=customer_id,
            date_delivery_expected=data['date_delivery_expected'], status='new')
        SO_serializer = sales_order_serializer(sales_order).data
        print('jos')
        SOI_serializer = []
        # try:
        for item_id in data['sales_order_items_list']:
            # print(, 'items')
            item = data['sales_order_items_list'][item_id]
            product = Product.objects.get(id=int(item['product']))
            sales_order_item = Sales_order_items.objects.create(sales_order_no=sales_order,
                                                                product=product, quantity_ordered=item[
                                                                    'quantity_ordered'], unit_price=item['unit_price'],
                                                                payment_terms=data[
                                                                    'payment_terms'], total_price=item['total_price'], due_date=data['due_date'], freight_charges_paid_by=data['freight_charges_paid_by'],
                                                                date_delivery_expected=data['date_delivery_expected'])
            serializer = sales_order_items_serializer(
                sales_order_item)
            SOI_serializer.append(
                serializer.data)
            print(item)
        result = {'sales_order': SO_serializer,
                  'sales_order_items': SOI_serializer}
        # except Exception as error:
        #     return Response({'status': 'failure', 'data': str(error)}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({'status': 'success', 'data': result}, status=HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        id = request.query_params.get('id', None)
        if id:
            try:
                sales_order = Sales_order.objects.get(pk=id)
                sales_order.status = 'cancelled'
                sales_order.save()
            except Exception as error:
                return Response({'status': 'failure', 'data': str(error)}, status=HTTP_206_PARTIAL_CONTENT)
            return Response({'status': 'success', 'data': 'cancelled successfully'}, status=HTTP_200_OK)
        else:
            return Response({'status': 'failure', 'data': 'give a valid primary key'}, status=HTTP_200_OK)

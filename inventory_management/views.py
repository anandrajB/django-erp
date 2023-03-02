from django.shortcuts import render
from django.shortcuts import get_object_or_404
from .serializer import *
from .models import *
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView, ListCreateAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView)
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_100_CONTINUE, HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_206_PARTIAL_CONTENT, HTTP_201_CREATED)
from django.http import JsonResponse, HttpResponse
from purchase_management.models import Purchase_request, Purchase_request_items
from purchase_management.serializer import purchase_request_items_serializer, purchase_request_serializer
from inventory_management.serializer import scrap_management_serializer
from purchase_management.forms import purchase_requestform, purchase_request_itemsform
from rest_framework.permissions import AllowAny
from data_management.models import Rawmaterials


class Purchase_request_api(CreateAPIView):
    serializer_class = purchase_serializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        try:
            production_order = ProductionOrder.objects.get(
                production_no=data['production_no'])
            purchase_request = Purchase_request.objects.create(
                warehouse_user_id=self.request.user)
            if production_order:
                purchase_request.production_order_id = data['production_no']
                purchase_request.save()
            PR_serializer = purchase_request_serializer(purchase_request).data
            # print('jos')
            result = {}

            # for item in data['raw_material_items']:
            #     rm_id = Rawmaterials.objects.get(id=item['id'])
            #     purchase_request_items = Purchase_request_items.objects.create(
            #         purchase_request_no=purchase_request, rm_id=rm_id, rm_quantity=item['quantity'])
            #     serializer = purchase_request_items_serializer(
            #         purchase_request_items)
            #     PRI_serializer.append(
            #         serializer.data)
            #     print(item)
            # result = {'purchase_request': PR_serializer,
            #           'purchase_request_items': PRI_serializer}
            purchase_request_items = Purchase_request_items.objects.create(
                purchase_request_no=purchase_request, rm_type=data['rm_type'], rm_id=data['rm_id'], rm_quantity=data['quantity'])
            PRI_serializer = purchase_request_items_serializer(
                purchase_request_items)
            result = {'purchase_request': PR_serializer,
                      'purchase_request_items': PRI_serializer.data}
        except Exception as error:
            return Response({'status': 'failure', 'data': error}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({'status': 'success', 'data': result}, status=HTTP_201_CREATED)


class ProductionOrderAPI(ListCreateAPIView, UpdateAPIView):
    serializer_class = Production_order_serializer
    permission_classes = [AllowAny]
    queryset = ProductionOrder.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()
        data = serializer(queryset, many=True)
        return Response({'status': 'success', 'data': data.data}, status=HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        try:
            raw_material_data = data['raw_material_data']
            production_no = ProductionOrder.objects.all()
            if (len(production_no)):
                production_no = int(
                    production_no[len(production_no)-1].production_no)+1
            else:
                production_no = 1
            print(production_no, "production")
            product = data['product']
            product = Product.objects.get(id=product)
            if (data['parts'] == 'all_parts'):
                data['parts'] = product.parts
            del data['raw_material_data']
            for item in raw_material_data:
                if item['required_action'] == 'purchase_request':
                    purchase_request = Purchase_request.objects.create(
                        warehouse_user_id=self.request.user)
                    purchase_request_item = Purchase_request_items.objects.create(
                        purchase_request_no=purchase_request, rm_id=item['rm_id'], rm_quantity=item['quantity_to_produce'])
                else:
                    production_no += 1
                    print(production_no, 'dafee')
                    ProductionOrder.objects.create(
                        production_no=production_no, master_production_no=data['master_production_no'], product=product, status='initiate Sub-production')
            serializer = Production_order_serializer(data=data)
            print(data)
            try:
                if serializer.is_valid():
                    serializer.save()
                    return Response({'status': 'success'}, status=HTTP_201_CREATED)
            except:
                return Response({'status': 'failure', 'data': serializer.errors},
                                status=HTTP_206_PARTIAL_CONTENT)
        except Exception as error:
            return Response({'status': 'failure', 'data': str(error)}, status=HTTP_206_PARTIAL_CONTENT)

    def update(self, request, *args, **kwargs):
        data = request.data
        id = request.query_params.get('id', None)
        if not id:
            return Response({'status': 'failure', 'data': 'primary is required'}, status=HTTP_206_PARTIAL_CONTENT)
        try:
            raw_material_data = data['raw_material_data']
            production_no = ProductionOrder.objects.all()
            if (len(production_no)):
                production_no = int(
                    production_no[len(production_no)-1].production_no)+1
            else:
                production_no = 1
            print(production_no, "production")
            product = data['product']
            product = Product.objects.get(id=product)
            if (data['parts'] == 'all_parts'):
                data['parts'] = product.parts
            del data['raw_material_data']
            for item in raw_material_data:
                if item['required_action'] == 'purchase_request':
                    purchase_request = Purchase_request.objects.create(
                        warehouse_user_id=self.request.user)
                    purchase_request_item = Purchase_request_items.objects.create(
                        purchase_request_no=purchase_request, rm_id=item['rm_id'], rm_quantity=item['quantity_to_produce'])
                else:
                    production_no += 1
                    print(production_no, 'dafee')
                    ProductionOrder.objects.create(
                        production_no=production_no, master_production_no=data['master_production_no'], product=product, status='initiate Sub-production')
            print('hi')
            production_order = ProductionOrder.objects.filter(
                production_no=id).update(parts=data['parts'], product=product,
                                         production_type=data['production_type'], sales_order=data['sales_order_no'], status=data['status'])
            production_order = ProductionOrder.objects.get(production_no=id)
            serializer = Production_order_serializer(production_order)
        # print(data)
            return Response({'status': 'success', 'data': serializer.data}, status=HTTP_200_OK)
        except Exception as error:
            return Response({'status': 'failure', 'data': str(error)}, status=HTTP_206_PARTIAL_CONTENT)


class transfer_request_submit(CreateAPIView):
    serializer_class = transfer_requests_serializer
    Permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        transfer = Transfer_requests.objects.create(
            request_details=data['request_details'], from_party=data[
                'from_party'], jobwork_details=data['jobwork_details'], status=data['status']
        )
        print(type(data['request_details']))
        for i in data['request_details']:
            user = request.user
            branch = user.branch
            print(branch)
            if data['request_details'][i]['rm_type'] == 'finished_goods' or data['request_details'][i]['rm_type'] == 'semi_finished_goods':
                print('hai')
                Inventory_products = Inventory_product.objects.get(
                    id=data['request_details'][i]['rm_id'], warehouse_name=branch)
                Inventory_products.stock_remaining = Inventory_products.stock_remaining - \
                    int(data['request_details'][i]['rm_quantity'])
                print(Inventory_products.stock_remaining)
            else:
                rawmterials = Inventory_rawmaterial.objects.get(
                    rm_id=data['request_details'][i]['rm_id'], warehouse_name=branch)
                print(rawmterials.rm_stock, 'this')
                rawmterials.rm_stock = rawmterials.rm_stock - \
                    int(data['request_details'][i]['rm_quantity'])
                print(rawmterials.rm_stock, 'the')

        return Response({'status': 'success'}, status=HTTP_201_CREATED)

class scrap_management_view():
    serializer_class = scrap_management_serializer
    permission_classes = [AllowAny]
    query_set = Scrap_management.objects.all()

    def update(self, request, pk):
        try:
            branch = get_object_or_404(Scrap_management, id=pk)
            serializer = Scrap_management(branch, data=request.data)
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({'status': 'failure', 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)

    # user = request.user
        # print(user)
        # branch = user.branch
        # print(branch)

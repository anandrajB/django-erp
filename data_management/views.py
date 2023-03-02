from django.shortcuts import render
from .serializer import *
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    RetrieveUpdateAPIView,
    UpdateAPIView,
    DestroyAPIView,
    ListAPIView,
)
from django.http import JsonResponse, HttpResponse
from utils.res import ResponseChoices
from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_401_UNAUTHORIZED, HTTP_206_PARTIAL_CONTENT,
    HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_203_NON_AUTHORITATIVE_INFORMATION, HTTP_206_PARTIAL_CONTENT
)
from rest_framework.response import Response
from .models import *
from accounts.serializer import *
from django.shortcuts import get_object_or_404
from .forms import *
from .utils import model_data, model_for_dropdown
import json
# Create your views here.


class GETAPI(ListAPIView, RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = NullSerializer

    def get_serializer_class(self, *args, **kwargs):
        model_name = self.request.query_params.get('model', None)
        if model_name and model_name in model_data:
            model = model_data[model_name]
            return model['serializer']
        return self.serializer_class

#     def get_form(self):
#         model_name = self.request.query_params.get('model')
#         if model_name and model_name in model_data:

#             form = model_data[model_name]['form'].base_fields
#             data = {}
#             for i in form:
#                 # print(i, type(form[i]).__name__)
#                 if (type(form[i]).__name__ == 'SimpleArrayField'):
#                     data[i] = 'listfield'
#                 elif (type(form[i]).__name__ == 'JSONField'):
#                     data[i] = 'jsonfield'
#                 elif (type(form[i]).__name__ == 'CharField'):
#                     data[i] = 'text'
#                 else:
#                     data[i] = form[i].widget.input_type
# #                 # print(i, form[i].widget.input_type)
#             return data
#         return None

    def get_table(self):
        model_name = self.request.query_params.get('model', None)
        if model_name and model_name in model_data:
            model = model_data[model_name]
            return model['model']
        return None

    def get_queryset(self):
        pk = self.request.query_params.get('pk', None)
        filter_by = self.request.query_params.get('filter_by', None)
        filter_value = self.request.query_params.get('filter_value', None)
        my_filter = {}
        if filter_value and filter_by:
            filter_value = filter_value.split(',')
            filter_by = filter_by.split(',')
            for i in range(0, len(filter_by)):
                print(filter_by[i], filter_value[i])
                my_filter[filter_by[i]] = filter_value[i]
        table = self.get_table()
        if table:
            queryset = table.objects.all()
            if pk:
                return table.objects.get(pk=pk)
            if filter_by and filter_value:
                queryset = queryset.filter(**my_filter)
                print(queryset)
            return queryset
        return None

    def get(self, request, *args, **kwargs):
        pk = self.request.query_params.get('pk', None)
        try:
            serializer_class = self.get_serializer_class()
            # form = self.get_form()
            if serializer_class == NullSerializer:
                return Response({"status": ResponseChoices.FAILURE, "data": ResponseChoices.NOT_VALID_MODEL},
                                status=HTTP_206_PARTIAL_CONTENT)
            queryset = self.get_queryset()
            if pk:
                serializer = serializer_class(queryset)
            else:
                serializer = serializer_class(queryset, many=True)
        except Exception as e:
            return Response({"status": ResponseChoices.FAILURE, 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)
        if pk:
            return Response(serializer.data, status=HTTP_200_OK)
        return Response({"status": ResponseChoices.SUCCESS, 'data': serializer.data}, status=HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        if serializer_class == NullSerializer:
            return Response({"status": ResponseChoices.FAILURE, "data": ResponseChoices.NOT_VALID_MODEL}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = serializer_class(data=request.data)
        print(request.data)
        if serializer.is_valid():
            # try:
            # print(serializer)
            serializer.save()
            return Response({"status": ResponseChoices.SUCCESS, "data": serializer.data}, status=HTTP_201_CREATED)
            # except:
            # return Response({"status": ResponseChoices.FAILURE, "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({"status": ResponseChoices.FAILURE, 'data': serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)

    def update(self, request):
        pk = self.request.query_params.get('pk')
        try:
            table = self.get_table()
            if table:
                if pk:
                    obj = table.objects.get(pk=pk)
                    print(table, pk, obj, 'table')
                    serializer_class = self.get_serializer_class()
                    serializer = serializer_class(obj, data=request.data)
                    if serializer.is_valid():
                        try:
                            serializer.save()
                            return Response({'status': ResponseChoices.SUCCESS, 'data': serializer.data}, status=HTTP_200_OK)
                        except:
                            return Response({'status': ResponseChoices.FAILURE, 'data': serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)
                    return Response({'status': ResponseChoices.FAILURE, 'data': serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)
        except Exception as e:
            return Response({'status': ResponseChoices.FAILURE, 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_queryset()
        self.perform_destroy(instance)
        return Response(status=HTTP_200_OK)


class FormData(APIView):

    def get(self, request, *args, **kwargs):
        model = request.query_params.get('model')
        if model:
            model = model.lower()
            form = (model_data[model]['form']).base_fields
            data = {}
            for i in form:
                print(i, type(form[i]).__name__)
                if (type(form[i]).__name__ == 'SimpleArrayField'):
                    data[i] = 'listfield'
                elif (type(form[i]).__name__ == 'JSONField'):
                    data[i] = 'jsonfield'
                elif (type(form[i]).__name__ == 'CharField'):
                    data[i] = 'text'
                else:
                    data[i] = form[i].widget.input_type
                # print(i, form[i].widget.input_type)
            return Response({'form': data}, status=HTTP_200_OK)
        return Response({'form': None}, status=HTTP_206_PARTIAL_CONTENT)


def production_flow_dropdown(request):
    id = request.GET.get('id', None)
    with_filter = request.GET.get('filter', None)
    product = Product.objects.get(pk=id)
    exists = False
    multipart = True
    part_list = []
    if not product.multiple_parts:
        multipart = False
    production_flow = ProductionFlow.objects.filter(product_code=product)
    for i in production_flow:
        part_list.append(i.part_name)
    if production_flow:
        exists = True
    result = {}
    result['exists'] = exists
    data = '<option value="">---------</option>'
    result['data'] = data
    result['multipart'] = multipart
    result['part_list'] = part_list
    if (isinstance(product.parts, list)):
        for i in product.parts:
            # if i not in part_list:
            data += f'<option value="{i}">{i}</option>'
        result['data'] = data
        return JsonResponse(result)
    return JsonResponse(result)


{  # class FormData(APIView):
    #     def get(self, request, *args, **kwargs):
    #         model = request.query_params.get('model')
    #         if model:
    #             form = PartyForm.base_fields
    #             data = {}
    #             for i in form:
    #                 print(i, type(form[i]).__name__)
    #                 if (type(form[i]).__name__ == 'SimpleArrayField'):
    #                     data[i] = 'listfield'
    #                 elif (type(form[i]).__name__ == 'JSONField'):
    #                     data[i] = 'jsonfield'
    #                 elif (type(form[i]).__name__ == 'CharField'):
    #                     data[i] = 'text'
    #                 else:
    #                     data[i] = form[i].widget.input_type
    #                 # print(i, form[i].widget.input_type)
    #             return Response({'serializer': data})
    #         return Response({'serializer': 'none'})
}


def dropdown_getjson(request):
    model = request.GET.get('model', None)
    name = request.GET.get('name', None)
    filter_by = request.GET.get('filter_by', None)
    filter_value = request.GET.get('filter_value', None)
    id = request.GET.get('id', 'id')
    my_filter = {}
    my_filter[filter_by] = filter_value
    order_by = request.GET.get('order_by', None)
    products = None
    data_list = []
    res = ''
    if model:
        # if model == 'product_type':
        #     data_dropdown = "<option value='' >Select Product type</option><option value='finished'>Finished</option><option value='semi-finished'>Semi-Finished</option>"
        #     return JsonResponse({'html': data_dropdown})
        if not name:
            name = model_for_dropdown[model.lower()]
        res = '<option selected disabled value="" >{}</option>'.format(
            model.lower())
        model = model_data[model.lower()]['model']
        print('mode', model)
        products = model.objects.all()
        if order_by:
            products = products.order_by(order_by)
        # if model == UserRole:
        #     if filter_by:
        #         products = model.objects.filter(
        #             Q(department=None) | Q(department=filter_value))
        #     else:
        #         products = model.objects.filter(department=None)
        # else:
        if filter_by:
            print(filter_by, filter_value)
            if filter_value:
                products = products.filter(**my_filter)
            else:
                return
        if len(products):
            if model == PartyType:
                for data in products:
                    print(data, 'filter')
                    data_list.append(
                        {'id': getattr(data, name), 'name': getattr(data, name)})
                    res += f"<option value='{getattr(data,name)}'>{getattr(data,name)}</option>"
            else:
                for data in products:
                    print(data, 'filter')
                    print(name, 'da')
                    data_list.append(
                        {'id': data.pk, 'name': getattr(data, name)})
                    res += f"<option value='{data.pk}'>{getattr(data,name)}</option>"
    return JsonResponse({'list': data_list, 'html': res})


{
    #  def dropdown_getjson(request):
    #     model = request.GET.get('model', None)
    #     name = request.GET.get('name', None)
    #     filter_by = request.GET.get('filter_by', None)
    #     filter_value = request.GET.get('filter_value', None)
    #     id = request.GET.get('id', 'id')
    #     my_filter = {}
    #     my_filter[filter_by] = filter_value
    #     order_by = request.GET.get('order_by', None)
    #     products = None
    #     data_list = []
    #     if model:
    #         if model == 'product_type':
    #             data_dropdown = "<option value='' >---------</option><option value='finished'>Finished</option><option value='semi-finished'>Semi-Finished</option>"
    #             return JsonResponse({'html': data_dropdown})
    #         if not name:
    #             name = model_for_dropdown[model.lower()]
    #         res = '<option value="" >---------</option>'
    #         print('mode', model_data[model.lower()])
    #         model = model_data[model.lower()]['model']
    #         products = model.objects.all()
    #         if order_by:
    #             products = products.order_by(order_by)
    #         if filter_by:
    #             print(filter_by, filter_value)
    #             if filter_value:
    #                 products = products.filter(**my_filter)
    #             else:
    #                 return
    #         if len(products):
    #             for data in products:
    #                 data_list.append(
    #                     {'id': getattr(data, id), 'name': getattr(data, name)})
    #                 res += f"<option value='{getattr(data,id)}'>{getattr(data,name)}</option>"
    #     return JsonResponse({'list': data_list, 'html': res})


    # class ProductionFlowView(ListCreateAPIView, UpdateAPIView, DestroyAPIView):
    #     permission_classes = [AllowAny]
    #     serializer_class = pf_serializer

    #     def list(self, request, *args, **kwargs):
    #         pf = ProductionFlow.objects.all().order_by('product', 'part_name')
    #         pf = ProductionFlowSerializer(pf, many=True)
    #         product = None
    #         phases = {}
    #         data = []
    #         for i in pf.data:
    #             product = i['product_code']
    #             part_name = i['part_name']
    #             productivity = Productivity.objects.filter(
    #                 product=product, part_name=part_name).order_by('product', 'part_name')
    #             if part_name == '':
    #                 part_name = 'singlepart'
    #             productivity = ProductivitySerializer(productivity, many=True)
    #             if str(product) not in phases:
    #                 phases[str(product)] = {}
    #             phases[str(product)][part_name] = productivity.data
    #         for i in phases:
    #             data_set = {}
    #             data_set['product'] = i
    #             data_set['productivity'] = phases[i]
    #             data.append(data_set)

    #         return Response({'status': 'success', 'data': data})

    #     def post(self, request, *args, **kwargs):
    #         # print(request.data['product'])
    #         data = request.data
    #         product = data['product_code']
    #         part_name = data['part_name']
    #         phases_list = {}
    #         if not product or product == '':
    #             print('no product')
    #         # try:
    #         product = Product.objects.get(id=product)
    #         # if product.multiple_parts:
    #         # if part_name == '' or part_name == None:
    #         #     print('nopaer')
    #         # if part_name not in product.parts:
    #         #     print('no parts in product')
    #         productivity_list = (data['productivity_to_add'])
    #         print(productivity_list)
    #         index = 0
    #         for productivity in productivity_list:
    #             print(productivity)
    #             index += 1
    #             phase = ProductionPhases.objects.get(
    #                 phase_name=productivity['phase_name'])
    #             pr = Productivity.objects.create(product=product, part_name=part_name,
    #                                              phase=phase, quantity_perday=productivity['quantity_perday'], scrap_quantity=productivity['scrap_quantity'])
    #             # pr.save()
    #             phases_list[index] = phase.phase_name
    #         pf = ProductionFlow.objects.create(
    #             product=product, part_name=part_name, phases=phases_list)
    #         # pf.save()
    #         # except Exception as e:
    #         # print('error', str(e))
    #         return Response({'status': 'success', 'data': data})

    #     def update(self, request, *args, **kwargs):
    #         # print('sd')
    #         data = request.data
    #         product = data['product']
    #         part_name = data['part_name']
    #         # phases_list ={}
    #         if not product or product == '':
    #             print('no product')
    #         # try:
    #         product = Product.objects.get(id=product)
    #         pf = ProductionFlow.objects.get(product=product, part_name=part_name)
    #         phases_list = pf.phases
    #         productivity_list_to_add = (data['productivity_to_add'])
    #         productivity_list_to_update = (data['productivity_to_update'])
    #         productivity_list_to_delete = (data['productivity_to_delete'])
    #         print('delete', productivity_list_to_delete)
    #         print(productivity_list_to_add, 'add', '\n', productivity_list_to_update,
    #               'edit\n', productivity_list_to_delete, 'delete\n')
    #         for productivity_index in productivity_list_to_update:
    #             print(productivity_index, 'edit\n')
    #             productivity = Productivity.objects.get(
    #                 id=productivity_index['id'])
    #             phase = ProductionPhases.objects.get(
    #                 phase_name=productivity_index['phase_get']['name'])
    #             productivity.phase = phase
    #             productivity.scrap_quantity = productivity_index['scrap_quantity']
    #             productivity.quantity_perday = productivity_index['quantity_perday']
    #             productivity.save()
    #         for pro in productivity_list_to_delete:
    #             print(pro, 'delete\n')
    #             productivity = Productivity.objects.get(id=pro)
    #             productivity.delete()

    #         for productivity in productivity_list_to_add:
    #             phase = ProductionPhases.objects.get(
    #                 phase_name=productivity['phase_name'])
    #             pr = Productivity.objects.create(product=product, part_name=part_name,
    #                                              phase=phase, quantity_perday=productivity['quantity_perday'], scrap_quantity=productivity['scrap_quantity'])
    #             # pr.save()
    #         phases_list = {}
    #         productivity_list = Productivity.objects.filter(
    #             product=product, part_name=part_name)
    #         for index, val in enumerate(productivity_list):
    #             phases_list[index+1] = val.phase.phase_name
    #         pf = ProductionFlow.objects.get(product=product, part_name=part_name)
    #         pf.phases = phases_list
    #         pf.save()
    #         # pr.save()

    #         # except Exception as e:
    #         #     print('error', str(e))
    #         # print(data)
    #         return Response({'status': 'success', 'data': 'data'})

    #     def destroy(self, request, *args, **kwargs):
    #         id = self.request.query_params.get('pk', None)
    #         if not id:
    #             return Response({'status': 'failure', 'data': 'give a valid id'}, status=HTTP_206_PARTIAL_CONTENT)
    #         try:
    #             pf = ProductionFlow.objects.get(id=id)
    #             productivity_list = Productivity.objects.filter(
    #                 product=pf.product, part_name=pf.part_name)
    #             productivity_list.delete()
    #             pf.delete()
    #             return Response({'status': 'success', 'data': 'deleted'}, status=HTTP_200_OK)
    #         except Exception as e:
    #             return Response({'status': 'failure', 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)
}


class ProductionFlowView(APIView):
    serializer_class = PFSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        production_flow = None
        product = Product.objects.get(product_code=data['product_code'])
        try:
            production_flow = ProductionFlow.objects.get(
                product_code=product, part_name=data['part_name'])
        except:
            production_flow = ProductionFlow.objects.create(
                product_code=product, part_name=data['part_name'])

        try:
            productivity_list = Productivity.objects.filter(
                product=product, part_name=data['part_name'])
            phases = {}
            count = 1
            for productivity in productivity_list:
                phases[count] = productivity.phase.phase_name

            production_flow.phases = phases
            production_flow.save()
            production_flow = ProductionFlowSerializer(production_flow)
            return Response({'status': 'success', 'data': production_flow.data}, status=HTTP_200_OK)
        except Exception as error:
            return Response({'status': 'failure', 'data': str(error)}, status=HTTP_206_PARTIAL_CONTENT)

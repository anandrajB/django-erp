from .models import (Inventory_product, Inventory_rawmaterial,
                     WIP, Productivity_Mgmt, Scrap_management, Transfer_request_type, Transfer_requests, ProductionOrder, vehicle_deatails)
from rest_framework.serializers import ModelSerializer, ValidationError, Serializer, SerializerMethodField
from rest_framework import serializers
from django.db.models import Q
from purchase_management.models import Purchase_request, Purchase_request_items


class Production_order_serializer(ModelSerializer):
    product_get = SerializerMethodField('get_product')
    raw_material_data = serializers.ListField(write_only=True, required=False)

    def get_product(self, obj):
        if obj.product:
            return {'id': obj.product.id, 'name': obj.product.product_name}
        return None

    class Meta:
        model = ProductionOrder
        fields = ['production_no', 'production_type',
                  'master_production_no', 'sales_order', 'product', 'product_get', 'parts', 'status', 'raw_material_data']


class Inventory_rm_serializer(ModelSerializer):
    rm_get = SerializerMethodField('get_rm')

    def get_rm(self, obj):
        if obj.rm:
            return {'id': obj.rm.id, 'name': obj.rm.rm_name}
        return None

    class Meta:
        model = Inventory_rawmaterial
        fields = ['id', 'rm', 'rm_get', 'rm_stock',
                  'rm_stock_production', 'warehouse_name']


# {    # def validate(self, data):
        # try:
        # inventory_obj = self.Meta.model.objects.filter(
        #     rm=data['rm'].id, warehouse_name=(data['warehouse_name']).lower())
        # print(data['warehouse_name'], data['rm'].id)
        # if len(inventory_obj) > 0:
        #     print(inventory_obj[0].id)
        #     rm_name = data['rm'].rm_name
        #     warehouse = data['warehouse_name']
        #     raise ValidationError(
        #         f'{rm_name} already has inventory data in {warehouse} warehouse')
        # return data}


class Inventory_product_serializer(ModelSerializer):
    product_get = SerializerMethodField('get_product')

    def get_product(self, obj):
        if obj.product:
            return {'id': obj.product.id, 'name': obj.product.product_name}
        return None

    class Meta:
        model = Inventory_product
        fields = ['id', 'product', 'product_get', 'product_stock',
                  'assigned_stock', 'stock_remaining', 'warehouse_name']

    def validate(self, data):
        # try:
        inventory_obj = self.Meta.model.objects.filter(
            product=data['product'].id, warehouse_name=(data['warehouse_name']))
        if self.instance:
            inventory_obj = inventory_obj.exclude(id=self.instance.id)
        print(data['warehouse_name'], data['product'].id)
        print(data['warehouse_name'].id)
        if len(inventory_obj) > 0:
            print(inventory_obj[0].id)
            product_name = data['product'].product_name
            warehouse_name = data['warehouse_name']
            raise ValidationError(
                f'{product_name} already has invetory data in {warehouse_name} warehouse')
        return data


class wipserializer(ModelSerializer):
    class Meta:
        model = WIP
        fields = ['workitem_id', 'product_id',
                  'quantity', 'date_initiated', 'current_status', 'expected_date_completion']


class productivity_mgmt_serializer(ModelSerializer):
    class Meta:
        model = Productivity_Mgmt
        fields = ['id', 'workitem_id', 'working_date', 'product_id',
                  'part_name', 'phase_id', 'phase_id', 'labours_worked', 'units_completed']


class scrap_management_serializer(ModelSerializer):
    class Meta:
        model = Scrap_management
        fields = ['id', ' workitem_id ', 'Product_id ', 'part_name', 'projected_scrap',
                  ' actual_scrap']


class transfer_request_type_serializer(ModelSerializer):
    class Meta:
        model = Transfer_request_type
        fields = ['id', 'request_type_id',
                  ' request_type']


class transfer_requests_serializer(ModelSerializer):
    class Meta:
        model = Transfer_requests
        fields = ['request_id', 'request_date', 'request_type', 'from_party', 'to_party', 'request_detalis', 'jobwork_details',
                  'expected_date_completed', 'required_status']


# class purchase_serializer(Serializer):
#     raw_material_items = serializers.ListField()
rm_type_choices = [('semi_finished_goods', 'semi_finished_goods'),
                   ('rawmaterial', 'Rawmaterial'),]


class purchase_serializer(Serializer):
    rm_type = serializers.ChoiceField(choices=rm_type_choices)
    rm_id = serializers.IntegerField()
    measurement_unit = serializers.CharField(required=False)
    quantity = serializers.IntegerField()
    production_number = serializers.IntegerField()


# class purchase_serializer(Serializer):
#     raw_material_items = serializers.ListField()


class vehicle_deatails_serializer(ModelSerializer):
    class Meta:
        model = vehicle_deatails
        fields = ['Vehicle_Type', 'vehicle_number']

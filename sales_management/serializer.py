from rest_framework import serializers
from .models import (Sales_order, Sales_order_items,
                     Delivery_note, Sales_invoice, Returned_goods)
from accounts.models import User


class sales_order_serializer(serializers.ModelSerializer):
    sales_order_items_get = serializers.SerializerMethodField("get_items")
    customer_id_get = serializers.SerializerMethodField("get_customer")
    sales_person_id_get = serializers.SerializerMethodField("get_sales_person")

    def get_customer(self, obj):
        if obj.customer_id:
            customer_obj = {'id': obj.customer_id.id,
                            'name': obj.customer_id.party_name, }
            return customer_obj
        return None

    def get_sales_person(self, obj):
        if obj.sales_person_id:
            sales_person_obj = {'id': obj.sales_person_id.id,
                                'name': obj.sales_person_id.name
                                }
            return sales_person_obj
        return None

    def get_items(self, obj):

        if obj.sales_order_no:
            sales_order_items = Sales_order_items.objects.filter(
                sales_order_no=obj.sales_order_no)
            sales_order_items_list = []
            for i in sales_order_items:
                sales_order_items_list.append(
                    sales_order_items_serializer(i).data)
            return sales_order_items_list
        return None

    class Meta:
        model = Sales_order
        fields = ['sales_order_no', 'sales_order_date',
                  'customer_id', 'customer_id_get', 'sales_person_id', 'sales_person_id_get', 'date_delivery_expected', 'sales_order_items_get', 'status']


class sales_order_items_serializer(serializers.ModelSerializer):
    product_get = serializers.SerializerMethodField("get_product")

    def get_product(self, obj):
        if obj.product:
            department_obj = {'id': obj.product.id,
                              'name': obj.product.product_name}
            return department_obj
        return None

    class Meta:
        model = Sales_order_items
        fields = ['id', 'sales_order_no', 'product', 'product_get',
                  'quantity_ordered', 'unit_price', 'currency', 'gst', 'total_price', 'freight_charges', 'freight_charges_paid_by',
                  'payment_terms', 'due_date', 'units_delivered', 'date_delivery_expected']


freight_charges_paid_by_choices = [('self', 'self'),
                                   ('customer', 'customer')]


class sales_order_create_serializer(serializers.ModelSerializer):
    sales_order_items_list = serializers.ListField()
    due_date = serializers.DateField()
    freight_charges_paid_by = serializers.ChoiceField(
        choices=freight_charges_paid_by_choices)
    payment_terms = serializers.CharField()
    sales_order_items_edit = serializers.JSONField()
    sales_order_items_delete = serializers.ListField()

    class Meta:
        model = Sales_order
        fields = ['sales_order_no', 'sales_order_date', 'customer_id', 'payment_terms', 'due_date', 'freight_charges_paid_by',
                  'date_delivery_expected', 'sales_order_items_list', 'sales_person_id', 'status', 'sales_order_items_edit', 'sales_order_items_delete']


class delivery_note_serializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery_note
        fields = ['id', 'sales_order_no', 'product', 'date_delivery',
                  'delivery_mode', 'delivery_details', 'units_delivered', 'eway_bill_no']


class sales_invoice_serializer(serializers.ModelSerializer):
    class Meta:
        model = Sales_invoice
        fields = ['id', 'sales_invoice_no', 'sales_order_no ', 'e_invoice_no']


class returned_goods_serializer(serializers.ModelSerializer):
    class Meta:
        model = Returned_goods
        fields = ['id', 'sales_invoice', 'sales_order_no', 'product',
                  'quantity', 'return_reason', 'returned_goods_status']

from .models import (Purchase_request, Purchase_request_items, Purchase_order, Purchase_inquiry,
                     Purchase_inquiry_items, PO_items, GRN, GRN_items, Purchase_return, Purchase_return_items

                     )
from rest_framework import serializers


class purchase_request_serializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_request
        fields = '__all__'


class purchase_request_items_serializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_request_items
        fields = ['id', 'purchase_request_no',
                  'rm_id', 'rm_quantity', 'rm_unitprice']


class purchase_order_serializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_order
        fields = ['id', 'purchase_order_no', 'po_date',
                  'supplier_id', 'procurement_user_id', 'expected_date_receipt']


class purchase_inquiry_serializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_inquiry
        fields = ['id', 'purchase_inquiry_no', 'po_date', 'supplier_id',
                  'procurement_user_id', 'excepted_date_receipt']
class purchase_inquiry_serializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_inquiry
        fields =['id','purchase_inquiry_no','po_date', 'supplier_id'
    'procurement_user_id','excepted_date_receipt'] 
class purchase_inquiry_create_serializer(serializers.ModelSerializer):
    purchase_inquiry_items = serializers.ListField()
    class Meta:
        model = Purchase_inquiry
        fields = ['id', 'purchase_inquiry_no', 'po_date', 'supplier_id',
                  'procurement_user_id', 'excepted_date_receipt','purchase_inquiry_items']

class purchase_inquiry_items_serializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_inquiry_items
        fields = ['id', 'purchase_inquiry_no', 'rm_id',
                  'rm_quantity', 'rm_unitprice', 'currency']


class po_items_serializer(serializers.ModelSerializer):
    class Meta:
        model = PO_items
        fields = ['id', 'purchase_order_no', 'rm_id', 'rm_quantity', 'rm_unitprice',
                  'rm_sgst', 'rm_cgst', 'rm_igst', 'currency', 'received_units', 'expected_date_receipt']


class grn_serializer(serializers.ModelSerializer):
    class Meta:
        model = GRN
        fields = ['id', 'grn_id', 'purchase_order_no', 'purchase_invoice_no', 'purchase_invoice_date',
                  'purchase_invoice_value', 'frieght_charges', 'currency', 'total_purchase_value', 'due_date']


class grn_items_serializer(serializers.ModelSerializer):
    class Meta:
        model = GRN_items
        fields = ['id', 'grn_id', 'rm_id', 'receivied_units', 'actual_unit_price', 'currency '
                  'rm_sgst', 'rm_cgst', 'rm_igst']


class purchase_return_serializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_return
        fields = ['id', 'purchase_return_id', 'grn_id', 'returned_date',
                  'transport_cost', 'currency', 'debit_note_number']


class purchase_return_items_serializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_inquiry_items
        fields = ['id', 'purchase_return_id', 'rm_id', 'returned_units', 'returned_unit_price', 'actual_unit_price '
                  'currency', 'rm_sgst', 'rm_cgst', 'rm_igst']

from django.forms import ModelForm
from .models import *


class SO_form(ModelForm):
    class Meta:
        models = Sales_order
        fields = '__all__'


class Sales_order_items_form(ModelForm):
    class Meta:
        models = Sales_order_items
        fields = '__all__'


class Returned_goods_form(ModelForm):
    class Meta:
        models = Returned_goods
        fields = '__all__'

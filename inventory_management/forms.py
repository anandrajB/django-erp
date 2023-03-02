from django.forms import ModelForm
from.models import (Inventory_product,Inventory_rawmaterial,
WIP,Scrap_management,Productivity_Mgmt,Transfer_request_type,Transfer_requests)


class Inventory_productForm(ModelForm):
    class Meta:
        model = Inventory_product
        fields ='__all__'
       


class Inventory_rawmaterialForm(ModelForm):
    class Meta:
        model = Inventory_rawmaterial
        fields ='__all__'


class productivity_mgmtForm(ModelForm):
    class Meta:
        model = Productivity_Mgmt
        fields = '__all__'

class WIPform(ModelForm):
    class Meta:
        model = WIP
        fields = '__all__'

class scrap_managementForm(ModelForm):
    class Meta:
        model = Scrap_management
        fields = '__all__'


class transfer_request_typeForm(ModelForm):
    class Meta:
        model = Transfer_request_type
        fields ='__all__'

class transfer_requestsForm(ModelForm):
    class Meta:
        model = Transfer_requests
        fields = '__all__'




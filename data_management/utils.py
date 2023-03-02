from .models import *
from .serializer import *
from .forms import *
from accounts.models import *
from accounts.serializer import *
from inventory_management.models import *
from inventory_management.serializer import *
from inventory_management.forms import *
# from purchase_management.models import Purchase_request, Purchase_request_items
# from purchase_management.serializer import purchase_request_items_serializer, purchase_request_serializer
# from purchase_management.forms import purchase_requestform, purchase_request_itemsform

from sales_management.models import *
from sales_management.serializer import *
from sales_management.forms import *
# Create your views here.

model_for_dropdown = {
    'user': 'name',
    'department': 'name',
    'subdivision': 'name',
    'userrole': 'role',
    'branch': 'cityname',
    'measuredunits': 'measured_unit_name',
    'currency': 'currency_name',
    'partytype': 'party_type',
    'country': 'country_name',
    'parties': 'party_name',
    'product': 'product_name',
    'rawmaterials': 'rm_name',
    'productionphase': 'phase_name',
    'state': 'state_name'
}


model_data = {'user': {'model': User, 'serializer': UserUpdateSerializer, 'form': UserForm},
              'product': {'model': Product, 'serializer': ProductSerializer, 'form': ProductForm},
              'branch': {'model': Branch, 'serializer': BranchSerializer, 'form': BranchForm},
              'department': {'model': Department, 'serializer': DepartmentsSerializer, 'form': DepartmentForm},
              'userrole': {'model': UserRole, 'serializer': UserRoleSerializer, 'form': UserRoleForm},
              'subdivision': {'model': Sub_division, 'serializer': SubDivisionSerializer, 'form': SubDivisionForm},
              'rawmaterial': {'model': Rawmaterials, 'serializer': RawmaterialsSerializer, 'form': RawmaterialsForm},
              'billofmaterial': {'model': BillOfMaterials, 'serializer': BillOfMaterialsSerializer, 'form': BillOfMaterialsForm},
              'productionphase': {'model': ProductionPhases, 'serializer': ProductionPhasesSerializer, 'form': ProductionPhasesForm},
              'productionflow': {'model': ProductionFlow, 'serializer': ProductionFlowSerializer, 'form': ProductionFlowForm},
              'country': {'model': Country, 'serializer': CountrySerializer, 'form': CountryForm},
              'partytype': {'model': PartyType, 'serializer': PartyTypeSerializer, 'form': PartyTypeForm},
              'parties': {'model': Parties, 'serializer': PartiesSerializer, 'form': PartyForm},
              'productivity': {'model': Productivity, 'serializer': ProductivitySerializer, 'form': ProductivityForm},
              'currency': {'model': Currency, 'serializer': CurrencySerializer, 'form': CurrencyForm},
              'measuredunits': {'model': MeasuredUnits, 'serializer': UnitSerializer, 'form': UnitForm},
              'inventory_rawmaterial': {'model': Inventory_rawmaterial, 'serializer': Inventory_rm_serializer, 'form': InventoryRmForm},
              'inventory_product': {'model': Inventory_product, 'serializer': Inventory_product_serializer, 'form': InventoryProductForm},
              'wip': {'model': WIP, 'serializer': wipserializer, 'form': WIPform},
              'sales': {'model': Sales_order, 'serializer': sales_order_serializer, 'form': SO_form},
              'si': {'model': Sales_order_items, 'serializer': sales_order_items_serializer, 'form': Sales_order_items_form},
              'vehicle_deatails': {'model': vehicle_deatails, 'serializer': vehicle_deatails_serializer, 'form': vehicle_deatails_form},
              'transfer_request': {'model': Transfer_requests, 'serializer': transfer_requests_serializer, 'form': transfer_requestsForm},
              'scrap_management': {'model': Scrap_management, 'serializer': scrap_management_serializer, 'form': scrap_managementForm},
              'return_goods': {'model': Returned_goods, 'serializer': returned_goods_serializer, 'form': Returned_goods_form},
              'state': {'model': State, 'serializer': StateSerializer}
              }

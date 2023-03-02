from accounts.models import *
from accounts.serializer import *
# from accounts.forms import *
from data_management.models import *
from data_management.serializer import *
from data_management.forms import *
app_data = {'branch': {'model': Branch,'serializer': BranchSerializer, 'form': BranchForm}, 
            'product': {'model': Product, 'serializer': ProductSerializer, 'form': ProductForm},
            'department': {'model':Department,'serializer':DepartmentsSerializer,'form': DepartmentForm},
            'subdivision': {'model': Sub_division, 'serializer': SubDivisionSerializer,'form': SubDivisionForm},
            'partytype': {'model': PartyType, 'serializer': PartyTypeSerializer, 'form': PartyTypeForm},
            'produt':{'model': Product, 'serializer': ProductSerializer, 'form': ProductForm},
            'rawmaterials':{'model':Rawmaterials,'serializer': RawmaterialsSerializer, 'form': RawmaterialsForm},
            'billofmaterials':{'model': BillOfMaterials,'serializer': BillOfMaterialsSerializer,'form':BillOfMaterialsForm},
            'productionflow':{'model': ProductionFlow,'serializer': ProductionFlowSerializer,'form': ProductionFlowForm},
            'parties':{'model':Parties,'serializer':PartiesSerializer,'form':PartyForm},   
}
def get_model(request):
    param=request.query_params.get('model')
    print(param)
    model=app_data[param]
    if model:
        print(model)
        return model['model']
    else:
        return None

def get_serializer(request):
    model_name = request.query_params.get('model')
    try:
        model = app_data[model_name]
        if model:
            return model['serializer']
    except:
        return None

def get_table(request):
    model_name = get_model(request)
    if model_name:
        print(model_name,'get_table')
        return model_name
    return None


# def get_queryset(id):
#     pk=id
#     table = get_table()
#     if table:
#         queryset = table.objects.get(id=pk)
#         return queryset
#     return None
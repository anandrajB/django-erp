from django.urls import path, include

from .views import (

    FormData,
    GETAPI,
    production_flow_dropdown,
    ProductionFlowView,
    # FormData
    # parties,
    # products,
    # rawmaterial,
    # product_parts,
    # phases
    dropdown_getjson
)
urlpatterns = [

    path('pf_dropdown', production_flow_dropdown),
    path('form', FormData.as_view()),
    path('get', GETAPI.as_view()),
    path('pf', ProductionFlowView.as_view()),
    path('dropdown/', dropdown_getjson),

    # path('loadparty/', parties),
    # path('loadproduct/', products),
    # path('loadrawmaterial/', rawmaterial),
    # path('loadproductparts/', product_parts),
    # path('loadphases/', phases)
]

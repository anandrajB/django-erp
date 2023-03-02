from django.shortcuts import render, redirect
from django.http import HttpResponse


def main(request):
    return render(request, 'base/base.html')


def common_view(request):
    return render(request, 'accounts/dm-common.html')


def admin_view(request):
    return render(request, 'base/admin.html')


def login(request):
    return render(request, 'accounts/login.html')

# def department_view(request):
#     return render(request, 'accounts/department.html')


# def user_role_view(request):
#     return render(request, 'accounts/userrole.html')


# def sub_division_view(request):
#     return render(request, 'accounts/sub_division.html')


# def branch_view(request):
#     return render(request, 'accounts/branch.html')

def forgetpassword_view(request):
    return render(request, 'accounts/forgetpassword.html')

# def user_view(request):
#     return render(request, 'accounts/user.html')


# def phase_view(request):
#     return render(request, 'dmtemplates/phase.html')


def rawmaterial_view(request):
    return render(request, 'dmtemplates/rawmaterials.html')


def billof_material_view(request):
    return render(request, 'dmtemplates/billofmaterials.html')


# def admin_view(request):
#     return render(request, 'base/admin.html')


def product_view(request):
    return render(request, 'dmtemplates/product.html')


# def production_flow(request):
#     return render(request, 'dmtemplates/production_flow.html')


def productionflow(request):
    return render(request, 'dmtemplates/productionflow.html')


def party_view(request):
    return render(request, 'dmtemplates/parties.html')


# def party_type_view(request):
#     return render(request, 'dmtemplates/party type.html')


# def country_view(request):
#     return render(request, 'dmtemplates/country.html')


def inventory_maintenance_view(request):
    return render(request, 'inventory/inventory-maintenance.html')


def inventory_menu_view(request):
    return render(request, 'inventory/inventory-menu.html')


def new_purchase_request(request):
    return render(request, 'inventory/new_purchase_request.html')


def return_goods_view(request):
    return render(request, 'inventory/return-goods.html')


def sales_order_create_view(request):
    return render(request, 'sales_management/new_sales_order.html')


def sales_order_view(request):
    return render(request, 'sales_management/sales_order.html')


def produciton_order_view(request):
    return render(request, 'inventory/production-order.html')


def purchase_request_view(request):
    return render(request, 'inventory/purchase-request.html')


def new_produciton_view(request):
    return render(request, 'inventory/newproduction.html')


def manual_deliverynote_view(request):
    return render(request, 'inventory/manualdeliverynote.html')


def inventory_transfer_view(request):
    return render(request, 'inventory/inventorytransfer.html')


def return_goods_view(request):
    return render(request, 'inventory/return_goods.html')


def goods_recipts_note_view(request):
    return render(request, 'inventory/goods_recipt_note.html')


def purchase_inquiry_view(request):
    return render(request, 'purchase/purchase_inquiry.html')


def purchase_order_view(request):
    return render(request, 'purchase/purchase_order.html')


def frondend_view(request):
    return render(request, 'accounts/front-end.html')

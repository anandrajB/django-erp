from django.db import models
from data_management.models import Rawmaterials, Product, ProductionFlow, ProductionPhases, Parties
from accounts.models import User, Branch
from sales_management.models import Sales_order
from django.contrib.postgres.fields import ArrayField


class Inventory_rawmaterial(models.Model):
    rm = models.ForeignKey(
        Rawmaterials, on_delete=models.SET_NULL, null=True, blank=True)
    rm_stock = models.PositiveIntegerField()
    rm_stock_production = models.PositiveIntegerField(null=True, blank=True)
    warehouse_name = models.ForeignKey(
        Branch, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return str(self.rm.rm_name) + '-' + str(self.rm_stock)


class Inventory_product(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_stock = models.PositiveIntegerField()
    assigned_stock = models.JSONField(null=True, blank=True)
    stock_remaining = models.PositiveIntegerField(null=True, blank=True)
    warehouse_name = models.ForeignKey(
        Branch, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return str(self.product) + '-' + str(self.warehouse_name)


production_type_choices = [('internal', 'internal'),
                           ('sales-order', 'sales-order'),]

mpo_status_choices = [
    ('awaiting_raw_material', 'awaiting_raw_material'),
    ('initiate_sub_production', 'initiate_sub_production')
]


class ProductionOrder(models.Model):
    production_no = models.IntegerField(primary_key=True)
    master_production_no = models.IntegerField(null=True, blank=True)
    production_type = models.CharField(max_length=30,
                                       choices=production_type_choices, default='internal')
    sales_order = models.ForeignKey(
        Sales_order, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=True)
    parts = ArrayField(
        models.CharField(max_length=35, blank=True),
        blank=True,
        default=list,
        null=True
    )
    status = models.CharField(
        max_length=30, choices=mpo_status_choices, default='awaiting_raw_material')

    class Meta:
        verbose_name = 'Production Order'

    def __str__(self):
        return str(self.master_production_no)+'-'+self.product.product_name


class WIP(models.Model):
    workitem_id = models.AutoField(primary_key=True)
    production_order = models.ForeignKey(
        ProductionOrder, on_delete=models.SET_NULL, null=True, blank=True)
    product_id = models.ForeignKey(
        Product, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField()
    date_initiated = models.DateField(auto_now_add=True)
    current_status = models.JSONField(null=True, blank=True)
    expected_date_completion = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "WIP"

    def __str__(self):
        return self.product_id.product_name + '-' + self.quantity


class Productivity_Mgmt(models.Model):
    workitem_id = models.ForeignKey(
        WIP, on_delete=models.CASCADE, null=True, blank=True)
    working_date = models.DateField()
    Product_id = models.ForeignKey(
        Product, on_delete=models.CASCADE, blank=True, null=True)
    part_name = models.CharField(max_length=30, null=True, blank=True)
    phase_id = models.ForeignKey(
        ProductionPhases, on_delete=models.CASCADE, null=True, blank=True)
    labours_worked = models.IntegerField()
    units_completed = models.IntegerField()

    class Meta:
        verbose_name = 'productivity_mgmt'

    def __str__(self):
        return self.workitem_id.product_id.product_name + '-' + self.part_name + '-'+self.phase_id.phase_name


class Scrap_management(models.Model):
    workitem_id = models.ForeignKey(
        WIP, on_delete=models.CASCADE, null=True, blank=True)
    product_id = models.ForeignKey(
        Product, on_delete=models.CASCADE, blank=True, null=True)
    part_name = models.CharField(max_length=30, null=True, blank=True)
    projected_scrap = models.IntegerField()
    actual_scrap = models.IntegerField()

    class Meta:
        verbose_name = 'scrap_management'

    def __str__(self):
        return self.part_name + '-' + self.workitem_id


class Transfer_request_type(models.Model):
    request_type = models.CharField(max_length=40)

    class Meta:
        verbose_name = 'transfer_request_type'

    def __str__(self):
        return self.request_type


class Transfer_requests(models.Model):
    request_id = models.AutoField(primary_key=True)
    request_date = models.DateField(auto_now_add=True)
    request_type = models.ForeignKey(
        Transfer_request_type, on_delete=models.SET_NULL, null=True)
# branches or parties
    from_party = models.CharField(max_length=50)
    to_party = models.CharField(max_length=50)
    #
    request_details = models.JSONField(null=True, blank=True)
    jobwork_details = models.JSONField(null=True, blank=True)
    expected_date_completion = models.DateField(auto_now_add=True)
    requried_status = models.CharField(blank=True, null=True, max_length=40)
    status = models.CharField(blank=True, null=True, max_length=50)

    class Meta:
        verbose_name = 'transfer_requests'

    def __str__(self):
        return self.to_party


class vehicle_deatails(models.Model):
    Vehicle_Type = models.CharField(blank=True, null=True, max_length=50)
    vehicle_number = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.vehicle_number

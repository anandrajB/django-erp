from django.db import models
from accounts.models import User
from data_management.models import Rawmaterials, Parties, Currency, Product
from django.core.exceptions import ValidationError


class Purchase_request(models.Model):
    purchase_request_no = models.AutoField(primary_key=True)
    purchaserequest_date = models.DateField(auto_now_add=True)
    warehouse_user_id = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True)
    production_order_id = models.IntegerField(null=True, blank=True)
    purchase_order_no = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'Purchase_request'

    def __str__(self):
        return self.purchase_request_no


rm_type_choices = [('semi_finished_goods', 'semi_finished_goods'),
                   ('rawmaterial', 'Rawmaterial'),]


class Purchase_request_items(models.Model):
    purchase_request_no = models.ForeignKey(
        Purchase_request, on_delete=models.SET_NULL, null=True)
    rm_type = models.CharField(
        choices=rm_type_choices, default='rawmaterial', max_length=50)
    rm_id = models.IntegerField(null=True, blank=True)
    rm_name = models.CharField(max_length=30, null=True, blank=True)
    rm_quantity = models.IntegerField()
    rm_unitprice = models.IntegerField(null=True, blank=True)
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'purchase_request_items'

    def __str__(self):
        return self.purchase_request_no

    def save(self, *args, **kwargs):
        try:
            if self.rm_type == 'rawmaterial':
                rm = Rawmaterials.objects.get(id=self.rm_id)
                self.rm_name = rm.rm_name
                if rm and rm.measured_unit:
                    self.measured_unit = rm.measured_unit.unit
            else:
                rm = Product.objects.get(
                    id=self.rm_id)
                self.rm_name = rm.product_name
        except Exception as error:
            raise ValidationError(error)
        return super(Purchase_request_items, self).save(*args, **kwargs)


class Purchase_order(models.Model):
    purchase_order_no = models.IntegerField(primary_key=True, unique=True)
    po_date = models.DateField()
    supplier_id = models.ForeignKey(
        Parties, on_delete=models.SET_NULL, null=True)
    procurement_user_id = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True)
    expected_date_receipt = models.DateField()

    class Meta:
        verbose_name = 'purchase_order'

    def __str__(self):
        return self.purchase_order_no


class Purchase_inquiry(models.Model):
    purchase_inquiry_no = models.IntegerField(primary_key=True)
    po_date = models.DateField()
    supplier_id = models.ForeignKey(
        Parties, on_delete=models.SET_NULL, null=True)
    procurement_user_id = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True)
    excepted_date_receipt = models.DateField()
    # purchase_order_no = models.ForeignKey(
    #     Purchase_order, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = 'purchase_inquiry'

    def __str__(self):
        return self.purchase_inquiry_no


class Purchase_inquiry_items(models.Model):
    purchase_inquiry_no = models.ForeignKey(
        Purchase_inquiry, on_delete=models.SET_NULL, null=True)
    rm_id = models.ForeignKey(
        Rawmaterials, on_delete=models.SET_NULL, null=True)
    rm_quantity = models.IntegerField()
    rm_unitprice = models.IntegerField()
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'purchase_inquiry_items'

    def __str__(self):
        return self.purchase_inquiry_no


class PO_items(models.Model):
    purchase_order_no = models.ForeignKey(
        Purchase_order, on_delete=models.SET_NULL, null=True)
    rm_id = models.ForeignKey(
        Rawmaterials, on_delete=models.SET_NULL, null=True)
    rm_quantity = models.IntegerField()
    rm_unitprice = models.IntegerField()
    rm_sgst = models.IntegerField()
    rm_cgst = models.IntegerField()
    rm_igst = models.IntegerField()
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)
    received_units = models.IntegerField()
    expected_date_receipt = models.DateField()

    class Meta:
        verbose_name = 'po_items'

    def __str__(self):
        return self.rm_id


class GRN(models.Model):
    # grn_id = models.IntegerField()
    purchase_order_no = models.ForeignKey(
        Purchase_order, on_delete=models.SET_NULL, null=True)
    grn_date = models.DateField(auto_now_add=True,null=True)
    purchase_invoice_no = models.IntegerField()
    purchase_invoice_date = models.DateField()
    purchase_invoice_value = models.IntegerField()
    frieght_charges = models.IntegerField()
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)
    total_purchase_value = models.IntegerField()
    due_date = models.DateField()

    class Meta:
        verbose_name = 'grn'

    def __str__(self):
        return self.purchase_order_no


class GRN_items(models.Model):
    grn_id = models.ForeignKey(
        GRN, on_delete=models.SET_NULL, null=True, blank=True)
    rm_id = models.ForeignKey(
        Rawmaterials, on_delete=models.SET_NULL, null=True)
    receivied_units = models.IntegerField()
    actual_unit_price = models.IntegerField()
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)
    rm_sgst = models.IntegerField()
    rm_cgst = models.IntegerField()
    rm_igst = models.IntegerField()

    class Meta:
        verbose_name = 'grn_items'

    def __str__(self):
        return self.rm_id


class Purchase_return(models.Model):
    purchase_return_id = models.IntegerField()
    grn_id = models.ForeignKey(GRN_items, on_delete=models.SET_NULL, null=True)
    returned_date = models.DateField()
    transport_cost = models.IntegerField()
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)
    debit_note_number = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'purchase_return'

    def __str__(self):
        return self.transport_cost


class Purchase_return_items(models.Model):
    purchase_return_id = models.ForeignKey(
        Purchase_return, on_delete=models.SET_NULL, null=True)
    rm_id = models.ForeignKey(
        Rawmaterials, on_delete=models.SET_NULL, null=True)
    returned_units = models.IntegerField()
    returned_unit_price = models.IntegerField()
    actual_unit_price = models.IntegerField()
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)
    rm_sgst = models.IntegerField()
    rm_cgst = models.IntegerField()
    rm_igst = models.IntegerField()

    class Meta:
        verbose_name = 'purchase_return_items'

    def __str__(self):
        return self.rm_id

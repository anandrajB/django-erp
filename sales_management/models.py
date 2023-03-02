from django.db import models
from data_management.models import Parties, Product, Currency
from accounts.models import User


status_choices = [('new', 'new'),
                  ('completed', 'completed'),
                  ('cancelled', 'cancelled'),
                  ('modified', 'modified')]

freight_charges_paid_by_choices = [('self', 'self'),
                                   ('customer', 'customer')]


class Sales_order(models.Model):
    sales_order_no = models.AutoField(primary_key=True)
    sales_order_date = models.DateField(auto_now_add=True)
    customer_id = models.ForeignKey(
        Parties, on_delete=models.SET_NULL, null=True)
    sales_person_id = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True)
    date_delivery_expected = models.DateField()
    status = models.CharField(
        max_length=20, choices=status_choices, default=status_choices[0])
    returnedgoods = models.JSONField(null=True,blank=True)

    class Meta:
        verbose_name = 'sales_order'

    def __str__(self):
        return str(self.sales_order_no)


class Sales_order_items(models.Model):
    sales_order_no = models.ForeignKey(
        Sales_order, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True)
    quantity_ordered = models.IntegerField()
    unit_price = models.IntegerField(null=True, blank=True)
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)
    gst = models.IntegerField(null=True, blank=True)
    freight_charges = models.IntegerField(null=True, blank=True)
    freight_charges_paid_by = models.CharField(
        max_length=20, choices=freight_charges_paid_by_choices, default="self")
    total_price = models.IntegerField(null=True, blank=True)
    # Freight Charges Paid by
    payment_terms = models.CharField(max_length=50)
    due_date = models.DateField(null=True, blank=True)
    units_delivered = models.IntegerField(null=True, blank=True)
    date_delivery_expected = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = 'sales_order_items'

    def __str__(self):
        return str(self.sales_order_no)


class Delivery_note(models.Model):
    sales_order_no = models.ForeignKey(
        Sales_order, on_delete=models.SET_NULL, null=True)
    product_id = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True)
    date_delivery = models.DateField()
    delivery_mode = models.CharField(max_length=50)
    delivery_details = models.JSONField(null=True, blank=True)
    units_delivered = models.IntegerField()
    eway_bill_no = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'delivery_note'

    def __str__(self):
        return self.sales_order_no + '-' + self.date_delivery


class Sales_invoice(models.Model):
    sales_invoice_no = models.CharField(max_length=50)
    sales_order_no = models.ForeignKey(
        Sales_order, on_delete=models.SET_NULL, null=True)
    e_invoice_no = models.CharField(max_length=30)

    class Meta:
        verbose_name = 'sales_invoice'

    def __str__(self):
        return self.sales_invoice_no


class Returned_goods(models.Model):
    return_reciept_no = models.AutoField(primary_key=True)
    return_reciept_date = models.DateField(null=True)
    sales_invoice = models.ForeignKey(
        Sales_invoice, on_delete=models.SET_NULL, null=True)
    sales_order_no = models.ForeignKey(
        Sales_order, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(null=True)
    return_reason = models.CharField(max_length=50)
    returned_goods_status = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'returned_goods'

    def __str__(self):
        return self.sales_order_no

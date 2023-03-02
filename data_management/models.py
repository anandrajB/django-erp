from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
# from pos
# Create your models here.


class MeasuredUnits(models.Model):
    measured_unit_code = models.CharField(
        max_length=30, primary_key=True, default='id')

    measured_unit_name = models.CharField(max_length=30, unique=True)

    def __str__(self) -> str:
        return self.measured_unit_name

    def save(self, *args, **kwargs):
        self.measured_unit_name = self.measured_unit_name .lower()
        super(MeasuredUnits, self).save(*args, **kwargs)


class Currency(models.Model):
    currency_code = models.CharField(
        max_length=30, primary_key=True, default='id')
    currency_name = models.CharField(max_length=30, unique=True)

    def __str__(self) -> str:
        return self.currency_name

    def save(self, *args, **kwargs):
        self.currency_name = self.currency_name.lower()
        super(Currency, self).save(*args, **kwargs)


class PartyType(models.Model):
    party_type = models.CharField(max_length=30, unique=True)

    class Meta:
        verbose_name = "PartyType"

    def __str__(self) -> str:
        return self.party_type

    def save(self, *args, **kwargs):
        self.party_type = self.party_type.lower()
        super(PartyType, self).save(*args, **kwargs)


class Country(models.Model):
    country_code = models.CharField(
        max_length=30, primary_key=True, default='id')
    country_name = models.CharField(max_length=30, unique=True)

    class Meta:
        verbose_name = "Country"

    def __str__(self) -> str:
        return self.country_name

    def save(self, *args, **kwargs):
        self.country_name = self.country_name.lower()
        super(Country, self).save(*args, **kwargs)


class State(models.Model):
    state_code = models.CharField(
        max_length=30, primary_key=True, default='id')
    state_name = models.CharField(max_length=30, null=True, blank=True)
    GST_code = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self) -> str:
        return self.state_name


class Parties(models.Model):
    id = models.AutoField(primary_key=True)
    party_type = models.ForeignKey(
        PartyType, to_field='party_type', on_delete=models.SET_NULL, null=True)
    party_country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, null=True)
    party_name = models.CharField(max_length=50)
    party_address = models.TextField()
    party_state = models.ForeignKey(
        State, on_delete=models.SET_NULL, null=True)
    party_pincode = models.IntegerField()
    party_GSTIN = models.CharField(max_length=30, null=True, blank=True)
    party_products = models.JSONField(null=True, blank=True)
    party_contact_name = models.CharField(max_length=30, null=True, blank=True)
    party_contact_no = models.CharField(max_length=30, null=True, blank=True)
    party_email = models.CharField(max_length=30, null=True, blank=True)

    class Meta:
        verbose_name = "Party"

    def clean(self):
        parties = Parties.objects.filter(
            party_name__iexact=self.party_name.lower())
        if self.pk:
            parties = parties.exclude(pk=self.pk)
        if parties.exists():
            raise ValidationError("This party already exists.")

    def __str__(self) -> str:
        return self.party_name


product_type_choices = [('finished', 'finished'),
                        ('semi-finished', 'semi-finished'),]
rm_type_choices = [('semi_finished_goods', 'semi_finished_goods'),
                   ('rawmaterial', 'Rawmaterial'),]


class ProductionPhases(models.Model):
    id = models.AutoField(primary_key=True)
    phase_name = models.CharField(max_length=30, unique=True)

    class Meta:
        verbose_name = "ProductionPhase"
        db_table = 'ProductionPhase'

    def __str__(self) -> str:
        return self.phase_name

    def save(self, *args, **kwargs):
        self.phase_name = self.phase_name.lower()
        super(ProductionPhases, self).save(*args, **kwargs)


class Product(models.Model):
    product_code = models.CharField(
        unique=True, primary_key=True, max_length=30, default='id')
    product_name = models.CharField(unique=True, max_length=30)
    product_type = models.CharField(
        max_length=30, choices=product_type_choices, default='finished')
    min_stock = models.IntegerField(default=100)
    maximum_price = models.IntegerField()
    minimum_price = models.IntegerField()
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)
    multiple_parts = models.BooleanField(default=False)
    parts = ArrayField(
        models.CharField(max_length=35, blank=True),
        blank=True,
        default=list,
        null=True
    )

    class Meta:
        verbose_name = "Product"

    def __str__(self) -> str:
        return self.product_name


class Rawmaterials(models.Model):
    rm_code = models.CharField(max_length=30, primary_key=True,)
    rm_name = models.CharField(max_length=50)
    measured_unit = models.ForeignKey(
        MeasuredUnits, on_delete=models.SET_NULL, null=True, blank=True)
    min_stock = models.IntegerField()
    rm_max_price = models.IntegerField()
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True, blank=True)
    preferred_supplier = ArrayField(
        models.CharField(max_length=30, null=True, blank=True),
        default=list
    )

    class Meta:
        verbose_name = "Rawmaterial"

    def __str__(self) -> str:
        return self.rm_name


class BillOfMaterials(models.Model):
    id = models.AutoField(primary_key=True)
    product_code = models.ForeignKey(Product, on_delete=models.CASCADE)
    part_name = models.CharField(max_length=30, null=True, blank=True)
    rm_serial_no = models.IntegerField(unique=True, null=True, blank=True)
    rm_type = models.CharField(
        max_length=20, choices=rm_type_choices, default='rawmaterial')
    rm_code = models.IntegerField(null=True, blank=True)
    rm_name = models.CharField(max_length=50)
    rm_quantity = models.IntegerField(null=True, blank=True)
    production_phase = models.ForeignKey(
        ProductionPhases, on_delete=models.SET_NULL, null=True, blank=True)
    measured_unit = models.ForeignKey(
        MeasuredUnits, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "BillOfMaterial"

    def save(self, *args, **kwargs):
        try:
            if self.rm_type == 'rawmaterial':
                rm = Rawmaterials.objects.get(pk=self.rm_code)
                self.rm_name = rm.rm_name
                if rm and rm.measured_unit:
                    self.measured_unit = rm.measured_unit
            else:
                rm = Product.objects.get(
                    pk=self.rm_code)
                self.rm_name = rm.product_name
        except Exception as error:
            raise ValidationError(error)
        return super(BillOfMaterials, self).save(*args, **kwargs)

    def __str__(self) -> str:
        return self.product_code.product_name + '-' + self.rm_name


class ProductionFlow(models.Model):
    id = models.AutoField(primary_key=True)
    product_code = models.ForeignKey(Product, on_delete=models.CASCADE)
    part_name = models.CharField(max_length=50, null=True, blank=True)
    phases = models.JSONField(null=True, blank=True)

    class Meta:
        verbose_name = "ProductionFlow"

    def __str__(self) -> str:
        return self.part_name


class Productivity(models.Model):
    id = models.AutoField(primary_key=True)
    phase = models.ForeignKey(
        ProductionPhases, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=True)
    part_name = models.CharField(max_length=50, null=True, blank=True)
    quantity_perday = models.PositiveIntegerField()
    scrap_quantity = models.PositiveIntegerField()

    def __str__(self) -> str:
        return str(self.quantity_perday)

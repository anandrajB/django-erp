from django.contrib import admin
from .models import *
admin.site.site_header = "Enterprise Resource Planning"
# Register your models here.
admin.site.register(PartyType)
admin.site.register(Country)
admin.site.register(Parties)
admin.site.register(Product)
admin.site.register(Rawmaterials)
admin.site.register(BillOfMaterials)
admin.site.register(ProductionPhases)
admin.site.register(ProductionFlow)
# admin.site.register()
# admin.site.register()
# admin.site.register()
# admin.site.register()

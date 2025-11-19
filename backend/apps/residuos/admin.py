from django.contrib import admin
from .models import TipoResiduo, Especie, LotesResiduos

@admin.register(TipoResiduo)
class TipoResiduoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')

@admin.register(Especie)
class EspecieAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')

@admin.register(LotesResiduos)
class LotesResiduosAdmin(admin.ModelAdmin):
    list_display = ('id', 'tipo_residuo', 'peso_kg', 'humedad', 'especie', 'fecha_ingreso')
    list_filter = ('tipo_residuo', 'especie', 'fecha_ingreso')
    search_fields = ('tipo_residuo__nombre', 'especie__nombre')
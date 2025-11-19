from django.contrib import admin
from .models import Temporada, DemandaMercado, Subproducto

@admin.register(Temporada)
class TemporadaAdmin(admin.ModelAdmin):
    list_display = ('fecha_inicio', 'fecha_fin')

@admin.register(DemandaMercado)
class DemandaMercadoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'subproducto', 'temporada')

@admin.register(Subproducto)
class SubproductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
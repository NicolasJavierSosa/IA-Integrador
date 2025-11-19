from django.contrib import admin
from .models import TipoMaquinaria, Maquinaria

@admin.register(TipoMaquinaria)
class TipoMaquinariaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')

@admin.register(Maquinaria)
class MaquinariaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo_maquinaria', 'disponible')
    list_filter = ('disponible', 'tipo_maquinaria')
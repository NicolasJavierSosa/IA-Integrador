from rest_framework import serializers
from .models import Temporada, DemandaMercado, Subproducto, AnalisisSubproducto

class TemporadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temporada
        fields = '__all__'

class SubproductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subproducto
        fields = '__all__'

class DemandaMercadoSerializer(serializers.ModelSerializer):
    subproducto = SubproductoSerializer(read_only=True)
    subproducto_id = serializers.PrimaryKeyRelatedField(
        queryset=Subproducto.objects.all(), source='subproducto', write_only=True
    )
    temporada = TemporadaSerializer(read_only=True)
    temporada_id = serializers.PrimaryKeyRelatedField(
        queryset=Temporada.objects.all(), source='temporada', write_only=True
    )

    class Meta:
        model = DemandaMercado
        fields = '__all__'

class AnalisisSubproductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalisisSubproducto
        fields = '__all__'
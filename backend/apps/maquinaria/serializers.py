from rest_framework import serializers
from .models import TipoMaquinaria, Maquinaria

class TipoMaquinariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMaquinaria
        fields = '__all__'

class MaquinariaSerializer(serializers.ModelSerializer):
    tipo_maquinaria = TipoMaquinariaSerializer(read_only=True)
    tipo_maquinaria_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoMaquinaria.objects.all(), source='tipo_maquinaria', write_only=True
    )

    class Meta:
        model = Maquinaria
        fields = '__all__'
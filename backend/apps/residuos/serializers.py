from rest_framework import serializers
from .models import TipoResiduo, Especie, LotesResiduos

class TipoResiduoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoResiduo
        fields = '__all__'

class EspecieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especie
        fields = '__all__'

class LotesResiduosSerializer(serializers.ModelSerializer):
    tipo_residuo = TipoResiduoSerializer(read_only=True)
    tipo_residuo_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoResiduo.objects.all(), source='tipo_residuo', write_only=True
    )
    especie = EspecieSerializer(read_only=True)
    especie_id = serializers.PrimaryKeyRelatedField(
        queryset=Especie.objects.all(), source='especie', write_only=True
    )

    class Meta:
        model = LotesResiduos
        fields = '__all__'
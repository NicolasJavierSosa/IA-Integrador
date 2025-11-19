from rest_framework import viewsets
from .models import Temporada, DemandaMercado, Subproducto
from .serializers import TemporadaSerializer, DemandaMercadoSerializer, SubproductoSerializer

class TemporadaViewSet(viewsets.ModelViewSet):
    queryset = Temporada.objects.all()
    serializer_class = TemporadaSerializer

class DemandaMercadoViewSet(viewsets.ModelViewSet):
    queryset = DemandaMercado.objects.all()
    serializer_class = DemandaMercadoSerializer

class SubproductoViewSet(viewsets.ModelViewSet):
    queryset = Subproducto.objects.all()
    serializer_class = SubproductoSerializer
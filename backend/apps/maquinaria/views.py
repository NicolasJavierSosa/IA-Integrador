from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import TipoMaquinaria, Maquinaria
from django_filters.rest_framework import DjangoFilterBackend
from .models import TipoMaquinaria, Maquinaria
from .serializers import TipoMaquinariaSerializer, MaquinariaSerializer

class TipoMaquinariaViewSet(viewsets.ModelViewSet):
    queryset = TipoMaquinaria.objects.all()
    serializer_class = TipoMaquinariaSerializer

class MaquinariaViewSet(viewsets.ModelViewSet):
    queryset = Maquinaria.objects.all()
    serializer_class = MaquinariaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tipo_maquinaria']
    search_fields = ['nombre']
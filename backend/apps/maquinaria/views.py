from rest_framework import viewsets
from .models import TipoMaquinaria, Maquinaria
from .serializers import TipoMaquinariaSerializer, MaquinariaSerializer

class TipoMaquinariaViewSet(viewsets.ModelViewSet):
    queryset = TipoMaquinaria.objects.all()
    serializer_class = TipoMaquinariaSerializer

class MaquinariaViewSet(viewsets.ModelViewSet):
    queryset = Maquinaria.objects.all()
    serializer_class = MaquinariaSerializer
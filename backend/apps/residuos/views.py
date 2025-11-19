from rest_framework import viewsets
from .models import TipoResiduo, Especie, LotesResiduos
from .serializers import TipoResiduoSerializer, EspecieSerializer, LotesResiduosSerializer

class TipoResiduoViewSet(viewsets.ModelViewSet):
    queryset = TipoResiduo.objects.all()
    serializer_class = TipoResiduoSerializer

class EspecieViewSet(viewsets.ModelViewSet):
    queryset = Especie.objects.all()
    serializer_class = EspecieSerializer

class LotesResiduosViewSet(viewsets.ModelViewSet):
    queryset = LotesResiduos.objects.all()
    serializer_class = LotesResiduosSerializer
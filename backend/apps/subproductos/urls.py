from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TemporadaViewSet, DemandaMercadoViewSet, SubproductoViewSet

router = DefaultRouter()
router.register(r'temporada', TemporadaViewSet)
router.register(r'demanda-mercado', DemandaMercadoViewSet)
router.register(r'subproducto', SubproductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
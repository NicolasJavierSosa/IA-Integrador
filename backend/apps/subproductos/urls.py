from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TemporadaViewSet, DemandaMercadoViewSet, SubproductoViewSet, AnalisisSubproductoViewSet

router = DefaultRouter()
router.register(r'temporadas', TemporadaViewSet)
router.register(r'demanda-mercado', DemandaMercadoViewSet)
router.register(r'subproductos', SubproductoViewSet)
router.register(r'historial', AnalisisSubproductoViewSet)

urlpatterns = [
    # Explicitly map the analyze action to ensure it takes precedence over the router's dynamic routes
    path('subproductos/analyze/', SubproductoViewSet.as_view({'post': 'analyze'}), name='subproducto-analyze'),
    path('', include(router.urls)),
]
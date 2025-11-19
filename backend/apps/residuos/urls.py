from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TipoResiduoViewSet, EspecieViewSet, LotesResiduosViewSet

router = DefaultRouter()
router.register(r'tipo-residuo', TipoResiduoViewSet)
router.register(r'especie', EspecieViewSet)
router.register(r'lotes-residuos', LotesResiduosViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
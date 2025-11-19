from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TipoMaquinariaViewSet, MaquinariaViewSet

router = DefaultRouter()
router.register(r'tipo-maquinaria', TipoMaquinariaViewSet)
router.register(r'maquinaria', MaquinariaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
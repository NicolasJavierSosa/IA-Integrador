from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Temporada, DemandaMercado, Subproducto, AnalisisSubproducto
from .serializers import TemporadaSerializer, DemandaMercadoSerializer, SubproductoSerializer, AnalisisSubproductoSerializer
from .services import prolog_service

class TemporadaViewSet(viewsets.ModelViewSet):
    queryset = Temporada.objects.all()
    serializer_class = TemporadaSerializer

class DemandaMercadoViewSet(viewsets.ModelViewSet):
    queryset = DemandaMercado.objects.all()
    serializer_class = DemandaMercadoSerializer

class SubproductoViewSet(viewsets.ModelViewSet):
    queryset = Subproducto.objects.all()
    serializer_class = SubproductoSerializer

    @action(detail=False, methods=['post'])
    def analyze(self, request):
        print("--- Starting Expert Analysis (via Subprocess) ---")
        try:
            # 1. Extract Data
            data = request.data
            
            # 2. Delegate to Service (Process Isolation)
            result = prolog_service.analyze_data(data)
            
            # 3. Process Results for History
            recommendations = result.get('recommendations', [])
            lot = data.get('lot', {})

            # Save Analysis to History
            try:
                # Find main recommendation
                main_rec = next((r['value'] for r in recommendations if r['type'] == 'optimal'), None)
                if not main_rec and recommendations:
                    main_rec = recommendations[0]['value']
                
                if main_rec:
                    AnalisisSubproducto.objects.create(
                        categoria=lot.get('category', 'Desconocido'),
                        especie=lot.get('species', 'Desconocida'),
                        volumen=float(lot.get('volume', 0) or 0),
                        recomendacion_principal=main_rec.replace('_', ' ').title(),
                        justificacion="Análisis automático basado en reglas de negocio.",
                        datos_entrada=data,
                        resultados=recommendations
                    )
            except Exception as db_err:
                print(f"Error saving history: {db_err}")

            return Response({
                "success": True,
                "recommendations": recommendations,
                "debug_facts": data
            })

        except Exception as e:
            print(f"CRITICAL ERROR in ExpertAnalysisView: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        except Exception as e:
            print(f"CRITICAL ERROR in ExpertAnalysisView: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AnalisisSubproductoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet to retrieve analysis history.
    ReadOnly because history should be immutable.
    """
    queryset = AnalisisSubproducto.objects.all()
    serializer_class = AnalisisSubproductoSerializer
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

            # 1.1 Validate minimal payload (defensive)
            lot = data.get('lot', {}) if isinstance(data, dict) else {}
            market = data.get('market', {}) if isinstance(data, dict) else {}

            raw_volume = lot.get('volume', None)
            if raw_volume in (None, ''):
                return Response(
                    {"success": False, "error": "El campo 'volume' (volumen del lote) es obligatorio."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                volume = float(raw_volume)
            except (TypeError, ValueError):
                return Response(
                    {"success": False, "error": "El campo 'volume' debe ser numérico."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if volume < 0:
                return Response(
                    {"success": False, "error": "El campo 'volume' no puede ser negativo."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validación específica Retazos: largo/ancho deben respetar límites
            if lot.get("category") == "Retazos":
                dims = lot.get("dimensions") or {}
                raw_length = dims.get("length")
                raw_width = dims.get("width")

                if raw_length in (None, "") or raw_width in (None, ""):
                    return Response(
                        {"success": False, "error": "Para Retazos, 'length' y 'width' son obligatorios."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    length_val = float(raw_length)
                    width_val = float(raw_width)
                except (TypeError, ValueError):
                    return Response(
                        {"success": False, "error": "Para Retazos, 'length' y 'width' deben ser numéricos."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if length_val < 10 or length_val > 50:
                    return Response(
                        {"success": False, "error": "Para Retazos, 'length' debe estar entre 10 y 50 cm."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if width_val < 3 or width_val > 10:
                    return Response(
                        {"success": False, "error": "Para Retazos, 'width' debe estar entre 3 y 10 cm."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            for cost_field in ("precioFinger", "costoFlete"):
                raw_cost = market.get(cost_field, None)
                if raw_cost in (None, ''):
                    continue
                try:
                    cost_value = float(raw_cost)
                except (TypeError, ValueError):
                    return Response(
                        {"success": False, "error": f"El campo '{cost_field}' debe ser numérico."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if cost_value < 0:
                    return Response(
                        {"success": False, "error": f"El campo '{cost_field}' no puede ser negativo."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            
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
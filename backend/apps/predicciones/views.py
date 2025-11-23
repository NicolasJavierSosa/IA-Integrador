from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from script.expert_system import ExpertSystem

class PredictView(APIView):
    def post(self, request):
        """
        Endpoint to receive form data and return expert system recommendations.
        Expected JSON payload:
        {
            "tipo_subproducto": "Corteza",
            "demanda_sustrato_local": "Alta",
            ... other facts ...
        }
        """
        data = request.data
        
        if not data:
            return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            expert = ExpertSystem()
            recommendations = expert.consult(data)
            return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

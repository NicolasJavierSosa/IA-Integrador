import sys
import os

# Add the backend directory to sys.path to allow imports
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.append(backend_dir)

from script.expert_system import ExpertSystem

def test_expert_system():
    print("Testing Expert System...")
    
    # Test Case 1: Corteza, Alta Demanda -> Producir Sustrato
    data1 = {
        'tipo_subproducto': 'Corteza',
        'demanda_sustrato_local': 'Alta'
    }
    print(f"\nTest Case 1: {data1}")
    try:
        es = ExpertSystem()
        recommendations = es.consult(data1)
        print("Recommendations:")
        for rec in recommendations:
            print(f" - {rec['conclusion']} (FC: {rec['certainty']})")
    except Exception as e:
        print(f"Error: {e}")

    # Test Case 2: Aserrin, Volumen Alto, Demanda Pellets Alta -> Pelletizacion Propia
    data2 = {
        'volumen_ton': 250,
        'tipo_subproducto': 'Aserrin',
        'demanda_mercado_local_pellets': 'Alta'
    }
    print(f"\nTest Case 2: {data2}")
    try:
        es = ExpertSystem()
        recommendations = es.consult(data2)
        print("Recommendations:")
        for rec in recommendations:
            print(f" - {rec['conclusion']} (FC: {rec['certainty']})")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_expert_system()

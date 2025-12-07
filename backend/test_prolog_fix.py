
import os
import sys

# Add backend directory to path so we can import apps
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Mock Django setup might be needed if services imports Django stuff
# But PrologService seems independent of Django models, it only uses pyswip logic.
# However, views.py imports models, but we are just testing PrologService here.

from apps.subproductos.services import prolog_service

def test_prolog_logic():
    print("--- Starting Prolog Logic Verification ---")
    
    # 1. Clear previous facts (simulation)
    print("Clearing facts...")
    predicates = [
        "precio_pellet/1", "volatilidad_pellet/1", "tipo/1", "volumen/1", "precio_chips/1"
    ]
    for pred in predicates:
        prolog_service.retract_all(pred)

    # 2. Assert Facts triggering Rule 09 (Pellets Risk)
    # Rule 09: recomendar(vender_aserrin) :- precio_pellet(P), P > 110, volatilidad_pellet(alta).
    
    print("\n--- Testing Rule 09 (Financial Risk) ---")
    prolog_service.assert_fact("precio_pellet(120)")
    prolog_service.assert_fact("volatilidad_pellet(alta)")
    
    results = prolog_service.query("recomendar(X)")
    print(f"Results for Rule 09: {results}")
    
    found = any(r['X'] == 'vender_aserrin' for r in results)
    if found:
        print("✅ Rule 09 PASSED: 'vender_aserrin' recommended due to high price & volatility.")
    else:
        print("❌ Rule 09 FAILED.")

    # 3. Assert Facts triggering Rule 15 (Chips Priority)
    # Rule 15: prioridad(asegurar_venta_contrato) :- precio_chips(P), P > 30, P < 90, volatilidad_chips(baja).
    
    print("\n--- Testing Rule 15 (Chips Stability) ---")
    # Clear interfering facts if any
    prolog_service.retract_all("precio_chips/1")
    prolog_service.retract_all("volatilidad_chips/1")
    
    prolog_service.assert_fact("precio_chips(50)")
    prolog_service.assert_fact("volatilidad_chips(baja)")
    
    results = prolog_service.query("prioridad(X)")
    print(f"Results for Rule 15: {results}")
    
    found = any(r['X'] == 'asegurar_venta_contrato' for r in results)
    if found:
        print("✅ Rule 15 PASSED: 'asegurar_venta_contrato' identified as priority.")
    else:
        print("❌ Rule 15 FAILED.")

    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    test_prolog_logic()

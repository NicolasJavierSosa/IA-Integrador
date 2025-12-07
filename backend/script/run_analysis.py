
import sys
import json
import os
from pyswip import Prolog

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def run_analysis(data):
    try:
        # Initialize Prolog
        prolog = Prolog()
        
        # Load rules
        # Assuming this script is in backend/script/
        base_dir = os.path.dirname(os.path.abspath(__file__))
        rules_path = os.path.join(base_dir, 'rules.pl').replace('\\', '/')
        
        prolog.consult(rules_path)
        
        # Extract data
        lot = data.get('lot', {})
        market = data.get('market', {})
        
        # Clean previous facts not needed since this is a fresh process
        # But for good measure we just assert
        
        # Assert Facts
        def assert_fact(predicate, value):
            if value is not None:
                if isinstance(value, str):
                    val = value.lower().replace(' ', '_')
                    prolog.assertz(f"{predicate}({val})")
                else:
                    prolog.assertz(f"{predicate}({value})")

        # --- Lot Facts ---
        assert_fact("tipo", lot.get('category'))
        assert_fact("especie", lot.get('species'))
        assert_fact("volumen", safe_float(lot.get('volume')))
        assert_fact("humedad", safe_float(lot.get('humidity')))
        assert_fact("contaminacion", 'si' if lot.get('chemicalContamination') else 'ninguna')
        assert_fact("corteza", 'si' if lot.get('hasBark') else 'no')
        
        dims = lot.get('dimensions', {})
        assert_fact("largo", safe_float(dims.get('length')))
        assert_fact("ancho", safe_float(dims.get('width')))
        
        if lot.get('defectType'):
            assert_fact("falla", lot.get('defectType'))
            if lot.get('category') == 'Madera con Fallas':
                    assert_fact("tipo", "madera_fallas")

        # --- Market Facts ---
        assert_fact("demanda_sustrato", 'alta' if market.get('demandaSustrato') else 'baja')
        assert_fact("mercado_compost", 'verdadero')
        assert_fact("demanda_compost", 'alta' if market.get('demandaCompost') else 'baja')
        assert_fact("espacio_compost", 'disponible' if market.get('espacioCompost') else 'limitado')
        assert_fact("demanda_jardineria", 'alta')
        
        assert_fact("demanda_pellets", 'alta' if market.get('demandaPellets') else 'baja')
        assert_fact("precio_pellet", safe_float(market.get('precioPellets')))
        assert_fact("volatilidad_pellet", 'alta' if market.get('volatilidadPellets') else 'baja')
        assert_fact("capacidad_almacenamiento", safe_float(market.get('capacidadAlmacenamiento')))
        
        assert_fact("maq_chipeadora", 'si')
        assert_fact("precio_chips", safe_float(market.get('precioChips')))
        assert_fact("volatilidad_chips", 'alta' if market.get('volatilidadChips') else 'baja')
        assert_fact("demanda_biomasa", 'alta' if market.get('demandaBiomasa') else 'baja')
        
        assert_fact("caldera", 'encendida' if market.get('estadoCaldera') else 'apagada')
        assert_fact("stock_biomasa", 'suficiente' if market.get('stockBiomasa') else 'bajo') 
        
        assert_fact("precio_finger", safe_float(market.get('precioFinger')))
        assert_fact("maq_finger", 'si')
        assert_fact("maq_reprocesadora", 'si')
        assert_fact("costo_flete", safe_float(market.get('costoFlete')))
        assert_fact("margen_ganancia", 20.0)

        # Query Rules
        recommendations = []
        
        for soln in prolog.query("recomendar(X)"):
            recommendations.append({
                "type": "optimal",
                "value": soln["X"],
                "desc": "Recomendación Óptima Identificada"
            })
            
        for soln in prolog.query("prioridad(X)"):
            recommendations.append({
                "type": "priority",
                "value": soln["X"],
                "desc": "Acción Prioritaria"
            })
            
        for soln in prolog.query("parcial(X)"):
            recommendations.append({
                "type": "partial",
                "value": soln["X"],
                "desc": "Viabilidad Parcial Detectada"
            })
            
        print(json.dumps({"success": True, "recommendations": recommendations}))
        
    except Exception as e:
        # Print error as JSON so parent can parse it
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    # Read JSON from stdin
    try:
        input_data = sys.stdin.read()
        if not input_data:
            raise ValueError("No input data provided")
        data = json.loads(input_data)
        run_analysis(data)
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Input Error: {str(e)}"}))
        sys.exit(1)

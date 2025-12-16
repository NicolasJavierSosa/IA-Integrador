import sys
import json
import os
from pyswip import Prolog
import unicodedata

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def normalize_string(text):
    """Remove accents and convert to lowercase with underscores"""
    if not text:
        return text
    # Normalize unicode characters (NFD = decompose accents)
    nfd = unicodedata.normalize('NFD', text)
    # Filter out accent marks
    without_accents = ''.join(char for char in nfd if unicodedata.category(char) != 'Mn')
    # Convert to lowercase and replace spaces
    return without_accents.lower().replace(' ', '_')

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

        machines = data.get('machines')
        if machines is None:
            # Backward-compatible default for callers that don't send machine availability.
            available_types = {"chipeadora", "finger_joint", "reprocesadora", "caldera"}
        else:
            available_types = set(machines.get('available_types', []) or [])

        def has_machine(type_code: str) -> bool:
            return type_code in available_types
        
        # Clean previous facts not needed since this is a fresh process
        # But for good measure we just assert
        
        # Assert Facts
        def assert_fact(predicate, value):
            if value is not None:
                if isinstance(value, str):
                    val = normalize_string(value)
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
        
        # Precios como texto cualitativo (Alto/Medio/Bajo) para comparaciones cualitativas
        precio_pellet_texto = market.get('precioPellets', 'Medio')
        precio_chips_texto = market.get('precioChips', 'Bajo')
        
        assert_fact("precio_pellet", precio_pellet_texto)
        assert_fact("volatilidad_pellet", 'alta' if market.get('volatilidadPellets') else 'baja')
        assert_fact("capacidad_almacenamiento", safe_float(market.get('capacidadAlmacenamiento')))
        
        assert_fact("maq_chipeadora", 'si' if has_machine('chipeadora') else 'no')
        
        # Precio chips: enviar como texto para comparaciones cualitativas (R15, R17, etc.)
        assert_fact("precio_chips", precio_chips_texto)
        
        # Precio chips numérico: para comparaciones matemáticas (R20)
        # Mapeo cualitativo → numérico (valores promedio de mercado en $/ton)
        precio_chips_numerico = {'Bajo': 30, 'Medio': 50, 'Alto': 70}.get(precio_chips_texto, 50)
        assert_fact("precio_chips_num", precio_chips_numerico)
        
        assert_fact("volatilidad_chips", 'alta' if market.get('volatilidadChips') else 'baja')
        assert_fact("demanda_biomasa", 'alta' if market.get('demandaBiomasa') else 'baja')
        
        # Caldera debe considerar tanto la señal del mercado como la disponibilidad real.
        caldera_encendida = bool(market.get('estadoCaldera')) and has_machine('caldera')
        assert_fact("caldera", 'encendida' if caldera_encendida else 'apagada')
        assert_fact("stock_biomasa", 'suficiente' if market.get('stockBiomasa') else 'bajo') 
        
        assert_fact("precio_finger", safe_float(market.get('precioFinger')))
        assert_fact("maq_finger", 'si' if has_machine('finger_joint') else 'no')
        assert_fact("maq_reprocesadora", 'si' if has_machine('reprocesadora') else 'no')
        assert_fact("costo_flete", safe_float(market.get('costoFlete')))
        assert_fact("margen_ganancia", 20.0)

        # Query Rules
        recommendations = []
        seen = set()  # Para evitar duplicados
        
        # Query for all recommendations (recomendar/1)
        try:
            for soln in prolog.query("recomendar(X)"):
                rec_value = str(soln["X"])
                if rec_value not in seen:
                    recommendations.append({
                        "type": "optimal",
                        "value": rec_value,
                        "desc": "Recomendación Óptima Identificada"
                    })
                    seen.add(rec_value)
        except Exception as e:
            print(f"Warning: Error querying recomendar: {e}", file=sys.stderr)
        
        # Query for priorities (prioridad/1)
        try:
            for soln in prolog.query("prioridad(X)"):
                prio_value = str(soln["X"])
                if prio_value not in seen:
                    recommendations.append({
                        "type": "priority",
                        "value": prio_value,
                        "desc": "Acción Prioritaria"
                    })
                    seen.add(prio_value)
        except Exception as e:
            print(f"Warning: Error querying prioridad: {e}", file=sys.stderr)
        
        # Query for partial viabilities (parcial/1)
        try:
            for soln in prolog.query("parcial(X)"):
                parcial_value = str(soln["X"])
                if parcial_value not in seen:
                    recommendations.append({
                        "type": "partial",
                        "value": parcial_value,
                        "desc": "Viabilidad Parcial Detectada"
                    })
                    seen.add(parcial_value)
        except Exception as e:
            print(f"Warning: Error querying parcial: {e}", file=sys.stderr)
            
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

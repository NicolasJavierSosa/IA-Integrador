#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar que TODAS las reglas del sistema experto funcionan correctamente
Incluyendo las reglas compuestas que dependen de reglas parciales
"""

import json
import subprocess
import os

def test_case(name, data, expected_recommendations=None):
    """
    Ejecuta un caso de prueba
    :param name: Nombre del test
    :param data: Datos de entrada
    :param expected_recommendations: Lista de recomendaciones esperadas (opcional)
    :return: True si pasa, False si falla
    """
    print(f"\n{'='*70}")
    print(f"Test: {name}")
    print(f"{'='*70}")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    run_analysis_path = os.path.join(script_dir, 'run_analysis.py')
    
    try:
        process = subprocess.run(
            ['python', run_analysis_path],
            input=json.dumps(data),
            text=True,
            capture_output=True,
            check=False
        )
        
        if process.returncode != 0:
            print(f"❌ ERROR: {process.stderr}")
            if process.stdout:
                print(f"Output: {process.stdout}")
            return False
        
        result = json.loads(process.stdout)
        
        if result.get('success'):
            recommendations = result.get('recommendations', [])
            print(f"✅ Ejecutado exitosamente")
            print(f"Total de recomendaciones: {len(recommendations)}")
            
            # Agrupar por tipo
            by_type = {'optimal': [], 'partial': [], 'priority': []}
            for rec in recommendations:
                rec_type = rec.get('type', 'unknown')
                rec_value = rec.get('value', 'unknown')
                if rec_type in by_type:
                    by_type[rec_type].append(rec_value)
            
            if by_type['optimal']:
                print(f"\n  RECOMENDACIONES ÓPTIMAS ({len(by_type['optimal'])}):")
                for val in by_type['optimal']:
                    print(f"    ✓ {val}")
            
            if by_type['priority']:
                print(f"\n  ACCIONES PRIORITARIAS ({len(by_type['priority'])}):")
                for val in by_type['priority']:
                    print(f"    ⚡ {val}")
            
            if by_type['partial']:
                print(f"\n  VIABILIDADES PARCIALES ({len(by_type['partial'])}):")
                for val in by_type['partial']:
                    print(f"    ⚙ {val}")
            
            # Verificar recomendaciones esperadas
            if expected_recommendations:
                found_values = [rec.get('value') for rec in recommendations]
                all_found = all(exp in found_values for exp in expected_recommendations)
                if all_found:
                    print(f"\n  ✅ Todas las recomendaciones esperadas fueron encontradas")
                else:
                    missing = [exp for exp in expected_recommendations if exp not in found_values]
                    print(f"\n  ⚠ Recomendaciones esperadas no encontradas: {missing}")
                    return False
            
            return True
        else:
            print(f"❌ Failed: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        import traceback
        traceback.print_exc()
        return False

# ==============================================================================
# TESTS PARA CORTEZA (REGLAS 01-05)
# ==============================================================================

test_corteza_sustrato = {
    "lot": {
        "category": "Corteza",
        "species": "Pino",
        "volume": 100,
        "humidity": 30,
        "chemicalContamination": False,
        "hasBark": True,
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaSustrato": True,
        "demandaCompost": True,
        "espacioCompost": True
    }
}

test_corteza_compostaje = {
    "lot": {
        "category": "Corteza",
        "species": "Eucalipto",
        "volume": 150,
        "humidity": 25,
        "chemicalContamination": False,
        "hasBark": True,
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaSustrato": False,
        "demandaCompost": False,
        "espacioCompost": False
    }
}

# ==============================================================================
# TESTS PARA ASERRÍN (REGLAS 06-10)
# ==============================================================================

test_aserrin_pellets_volumen = {
    "lot": {
        "category": "Aserrín",
        "species": "Pino",
        "volume": 250,
        "humidity": 15,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaPellets": True,
        "capacidadAlmacenamiento": 50,
        "precioPellets": 100,
        "volatilidadPellets": False
    }
}

test_aserrin_pellets_humedad = {
    "lot": {
        "category": "Aserrín",
        "species": "Pino",
        "volume": 100,
        "humidity": 8,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaPellets": True,
        "capacidadAlmacenamiento": 30,
        "precioPellets": 95,
        "volatilidadPellets": False
    }
}

test_aserrin_venta_directa = {
    "lot": {
        "category": "Aserrín",
        "species": "Pino",
        "volume": 250,
        "humidity": 15,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaPellets": False,
        "capacidadAlmacenamiento": 50,
        "precioPellets": 80,
        "volatilidadPellets": False
    }
}

test_aserrin_riesgo_financiero = {
    "lot": {
        "category": "Aserrín",
        "species": "Pino",
        "volume": 200,
        "humidity": 12,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaPellets": True,
        "capacidadAlmacenamiento": 25,
        "precioPellets": 120,  # Precio alto
        "volatilidadPellets": True  # Alta volatilidad
    }
}

test_aserrin_forzar_venta = {
    "lot": {
        "category": "Aserrín",
        "species": "Pino",
        "volume": 220,
        "humidity": 9,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaPellets": True,
        "capacidadAlmacenamiento": 5,  # Capacidad muy baja
        "precioPellets": 95,
        "volatilidadPellets": False
    }
}

# ==============================================================================
# TESTS PARA CHIPS (REGLAS 13-19)
# ==============================================================================

test_chip_pulpable = {
    "lot": {
        "category": "Chip",
        "species": "Eucalipto",
        "volume": 200,
        "humidity": 20,
        "chemicalContamination": False,
        "hasBark": False,  # Sin corteza = pulpable
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaBiomasa": False,
        "estadoCaldera": False,
        "stockBiomasa": True
    }
}

test_chip_no_pulpable_caldera = {
    "lot": {
        "category": "Chip",
        "species": "Pino",
        "volume": 150,
        "humidity": 18,
        "chemicalContamination": False,
        "hasBark": True,  # Con corteza = no pulpable
        "dimensions": {"length": 0, "width": 0}
    },
    "market": {
        "demandaBiomasa": True,
        "estadoCaldera": True,
        "stockBiomasa": False,  # Stock bajo
        "precioChips": 50,
        "volatilidadChips": False
    }
}

# ==============================================================================
# TESTS PARA RETAZOS (REGLAS 11-12, 20-23)
# ==============================================================================

test_retazo_finger_joint = {
    "lot": {
        "category": "Retazo",
        "species": "Pino",
        "volume": 80,
        "humidity": 15,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 70, "width": 8},  # Dimensiones grandes
        "defectType": None
    },
    "market": {
        "precioFinger": 180,
        "precioChips": 50
    }
}

test_retazo_tableros = {
    "lot": {
        "category": "Retazos",  # Plural
        "species": "Pino",
        "volume": 60,
        "humidity": 12,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 40, "width": 6}
    },
    "market": {}
}

test_madera_fallas_leves = {
    "lot": {
        "category": "Madera con Fallas",
        "species": "Eucalipto",
        "volume": 50,
        "humidity": 14,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 100, "width": 10},
        "defectType": "Curvatura Leve"
    },
    "market": {}
}

test_madera_fallas_graves = {
    "lot": {
        "category": "Madera con Fallas",
        "species": "Pino",
        "volume": 120,
        "humidity": 16,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 80, "width": 8},
        "defectType": "Grieta Profunda"
    },
    "market": {
        "precioChips": 45
    }
}

# ==============================================================================
# TESTS PARA LOGÍSTICA (REGLA 24)
# ==============================================================================

test_venta_en_planta = {
    "lot": {
        "category": "Retazo",
        "species": "Pino",
        "volume": 30,
        "humidity": 14,
        "chemicalContamination": False,
        "hasBark": False,
        "dimensions": {"length": 50, "width": 5}
    },
    "market": {
        "costoFlete": 25,  # Costo de flete >= margen
        "margenGanancia": 20
    }
}

# ==============================================================================
# EJECUTAR TODOS LOS TESTS
# ==============================================================================

if __name__ == "__main__":
    print("="*70)
    print(" SUITE COMPLETA DE PRUEBAS - SISTEMA EXPERTO ECOWOOD")
    print("="*70)
    
    results = []
    
    print("\n" + "="*70)
    print(" GRUPO 1: REGLAS PARA CORTEZA (01-05)")
    print("="*70)
    results.append(test_case("REGLA 01: Sustrato por alta demanda", 
                            test_corteza_sustrato, 
                            ["producir_sustrato"]))
    results.append(test_case("REGLA 02-04: Compostaje y jardinería", 
                            test_corteza_compostaje))
    
    print("\n" + "="*70)
    print(" GRUPO 2: REGLAS PARA ASERRÍN Y PELLETS (06-10)")
    print("="*70)
    results.append(test_case("REGLA 06: Pellets - Viabilidad por volumen", 
                            test_aserrin_pellets_volumen,
                            ["apto_pelletizacion"]))
    results.append(test_case("REGLA 07: Pellets - Viabilidad por humedad", 
                            test_aserrin_pellets_humedad,
                            ["apto_pelletizacion"]))
    results.append(test_case("REGLA 08: Venta directa de aserrín", 
                            test_aserrin_venta_directa,
                            ["vender_aserrin"]))
    results.append(test_case("REGLA 09: Bloqueo por riesgo financiero", 
                            test_aserrin_riesgo_financiero,
                            ["vender_aserrin"]))
    results.append(test_case("REGLA 10 (COMPUESTA): Forzar venta inmediata", 
                            test_aserrin_forzar_venta,
                            ["forzar_venta_inmediata", "apto_pelletizacion"]))
    
    print("\n" + "="*70)
    print(" GRUPO 3: REGLAS PARA CHIPS (13-19)")
    print("="*70)
    results.append(test_case("REGLA 16: Chip pulpable (limpio)", 
                            test_chip_pulpable,
                            ["chip_pulpable"]))
    results.append(test_case("REGLA 17-19 (COMPUESTA): Chip no pulpable para caldera", 
                            test_chip_no_pulpable_caldera,
                            ["chip_no_pulpable", "suministro_caldera"]))
    
    print("\n" + "="*70)
    print(" GRUPO 4: REGLAS PARA RETAZOS Y FINGER JOINT (11-12, 20-23)")
    print("="*70)
    results.append(test_case("REGLA 20-21 (COMPUESTA): Finger Joint", 
                            test_retazo_finger_joint,
                            ["producir_finger_joint", "apto_finger_joint"]))
    results.append(test_case("REGLA 11: Aptitud para tableros", 
                            test_retazo_tableros,
                            ["apto_venta_tableros"]))
    results.append(test_case("REGLA 22-23: Recuperación de fallas leves", 
                            test_madera_fallas_leves,
                            ["apto_segunda_calidad", "rectificar_reprocesar"]))
    results.append(test_case("REGLA 14: Fallas graves solo chips", 
                            test_madera_fallas_graves,
                            ["apto_solo_chips"]))
    
    print("\n" + "="*70)
    print(" GRUPO 5: REGLAS LOGÍSTICAS (24)")
    print("="*70)
    results.append(test_case("REGLA 24: Venta en planta por costo de flete", 
                            test_venta_en_planta,
                            ["vender_en_planta_descartar"]))
    
    # Resumen final
    total = len(results)
    passed = sum(results)
    failed = total - passed
    
    print("\n" + "="*70)
    print(" RESUMEN FINAL")
    print("="*70)
    print(f"  Total de tests:   {total}")
    print(f"  ✅ Pasaron:       {passed}")
    print(f"  ❌ Fallaron:      {failed}")
    print(f"  Tasa de éxito:   {(passed/total*100):.1f}%")
    print("="*70)
    
    if passed == total:
        print("\n🎉 ¡TODAS LAS REGLAS FUNCIONAN CORRECTAMENTE!")
        print("   Incluyendo las reglas compuestas que dependen de reglas parciales.")
    else:
        print("\n⚠ Algunos tests fallaron. Revisa los detalles arriba.")
    
    import sys
    sys.exit(0 if passed == total else 1)

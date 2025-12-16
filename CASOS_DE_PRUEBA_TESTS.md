# Casos de prueba (Unitarios + Integración)

Este documento describe, en formato de “casos”, qué valida la suite de tests del proyecto. Está basado directamente en:

- Unit tests Prolog: `backend/script/test_rules_unit.py`
- Integration tests (API): `backend/apps/subproductos/tests.py`

> Convención de salidas del motor:
> - **recommendations**: acciones recomendadas (`recomendar/1` en Prolog) → se espera `type = "recommendation"` (según el formateo actual del backend).
> - **partial**: conclusiones parciales (`parcial/1`) → se espera `type = "partial"`.
> - **priority**: prioridades (`prioridad/1`) → se espera `type = "priority"`.
>
> Nota: en los unit tests, se consulta directamente Prolog y se valida presencia/ausencia de átomos en `recomendar(X)`, `parcial(X)`, `prioridad(X)`.

---

## 1) Tests unitarios de reglas Prolog

**Objetivo:** verificar la semántica de cada regla del archivo `rules.pl` aislando el motor (sin HTTP, sin DB), mediante la aserción mínima de hechos y la consulta del predicado correspondiente.

**Metodología común (aplica a todos los unit tests):**

- Se crea un motor Prolog por test y se consulta `rules.pl`.
- Antes/después se ejecuta `retractall/1` sobre los predicados dinámicos para garantizar aislamiento.
- Cada test inserta hechos con `assertz(...)` y valida:
  - `recomendar(X)` contiene/no contiene un valor esperado, o
  - `parcial(X)` contiene un valor esperado, o
  - `prioridad(X)` contiene un valor esperado.

### R01 — Producir sustrato (caso positivo)

- **Nombre del test:** `test_R01_producir_sustrato`
- **Hechos de entrada:**
  - `tipo(corteza)`
  - `demanda_sustrato(alta)`
  - `especie(eucalipto)`
  - `demanda_compost(baja)`
- **Salida esperada:**
  - `recomendar(producir_sustrato)`

### R01 — No activar si pino + compost alto (caso negativo)

- **Nombre del test:** `test_R01_no_activa_si_pino_y_demanda_compost_alta`
- **Hechos de entrada:**
  - `tipo(corteza)`
  - `demanda_sustrato(alta)`
  - `especie(pino)`
  - `demanda_compost(alta)`
- **Salida esperada:**
  - **NO** debe aparecer `recomendar(producir_sustrato)`

### R02 — Producir compostaje

- **Nombre del test:** `test_R02_producir_compostaje`
- **Hechos de entrada:**
  - `tipo(corteza)`
  - `mercado_compost(verdadero)`
  - `contaminacion(ninguna)`
  - `demanda_compost(alta)`
- **Salida esperada:**
  - `recomendar(producir_compostaje)`

### R03 — Compostaje o sustrato acidófilo

- **Nombre del test:** `test_R03_compostaje_o_sustrato_acidofilo`
- **Hechos de entrada:**
  - `tipo(corteza)`
  - `especie(pino)`
  - `demanda_compost(alta)`
- **Salida esperada:**
  - `recomendar(compostaje_o_sustrato_acidofilo)`

### R04 — Almacenar temporalmente

- **Nombre del test:** `test_R04_almacenar_temporalmente`
- **Hechos de entrada:**
  - `tipo(corteza)`
  - `demanda_compost(baja)`
  - `espacio_compost(limitado)`
- **Salida esperada:**
  - `recomendar(almacenar_temporalmente)`

### R05 — Sustrato jardinería

- **Nombre del test:** `test_R05_sustrato_jardineria`
- **Hechos de entrada:**
  - `tipo(corteza)`
  - `demanda_jardineria(alta)`
- **Salida esperada:**
  - `recomendar(sustrato_jardineria)`

### R06 — Parcial: apto pelletización por volumen y demanda

- **Nombre del test:** `test_R06_parcial_apto_pelletizacion_por_volumen_y_demanda`
- **Hechos de entrada:**
  - `tipo(aserrin)`
  - `volumen(20)`
  - `demanda_pellets(alta)`
- **Salida esperada:**
  - `parcial(apto_pelletizacion)`

### R07 — Parcial: apto pelletización por humedad

- **Nombre del test:** `test_R07_parcial_apto_pelletizacion_por_humedad`
- **Hechos de entrada:**
  - `tipo(aserrin)`
  - `humedad(9)`
- **Salida esperada:**
  - `parcial(apto_pelletizacion)`

### R08 — Vender aserrín por baja demanda de pellets

- **Nombre del test:** `test_R08_vender_aserrin_por_baja_demanda`
- **Hechos de entrada:**
  - `tipo(aserrin)`
  - `volumen(200)`
  - `demanda_pellets(baja)`
- **Salida esperada:**
  - `recomendar(vender_aserrin)`

### R09 — Vender aserrín por riesgo financiero

- **Nombre del test:** `test_R09_vender_aserrin_por_riesgo_financiero`
- **Hechos de entrada:**
  - `tipo(aserrin)`
  - `precio_pellet(alto)`
  - `volatilidad_pellet(alta)`
- **Salida esperada:**
  - `recomendar(vender_aserrin)`

### R10 — Forzar venta inmediata por baja capacidad

- **Nombre del test:** `test_R10_forzar_venta_inmediata_por_baja_capacidad`
- **Hechos de entrada:**
  - `tipo(aserrin)`
  - `humedad(9)` *(dispara `parcial(apto_pelletizacion)` vía R07)*
  - `capacidad_almacenamiento(95)` *(ocupación alta = poco lugar para guardar)*
- **Salida esperada:**
  - `recomendar(forzar_venta_inmediata)`

### R11 — Parcial: apto venta tableros

- **Nombre del test:** `test_R11_parcial_apto_venta_tableros`
- **Hechos de entrada:**
  - `tipo(retazos)`
  - `volumen(60)`
  - `largo(40)` *(intencionalmente no cumple finger-joint)*
  - `ancho(6)`
  - `humedad(12)`
  - `especie(pino)`
- **Salida esperada:**
  - `parcial(apto_venta_tableros)`

### R12 — Prioridad: finger-joint o moldura

- **Nombre del test:** `test_R12_prioridad_finger_joint_o_moldura`
- **Hechos de entrada:**
  - `tipo(retazos)`
  - `largo(70)`
  - `precio_finger(200)`
  - `precio_chips_num(50)` *(umbral económico)*
- **Salida esperada:**
  - `prioridad(finger_joint_o_moldura)`

### R13 — Parcial: producir chips (volumen suficiente)

- **Nombre del test:** `test_R13_parcial_producir_chips`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(150)`
- **Salida esperada:**
  - `parcial(producir_chips)`

### R13B — No procesar chips (volumen insuficiente)

- **Nombre del test:** `test_R13B_no_procesar_chips`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(50)`
- **Salida esperada:**
  - `recomendar(no_procesar_chips)`

### R14 — Parcial: apto solo chips por falla grave

- **Nombre del test:** `test_R14_parcial_apto_solo_chips_por_falla_grave`
- **Hechos de entrada:**
  - `tipo(madera_fallas)`
  - `falla(grieta_profunda)`
- **Salida esperada:**
  - `parcial(apto_solo_chips)`

### R15 — Prioridad: asegurar venta por contrato

- **Nombre del test:** `test_R15_prioridad_asegurar_venta_contrato`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(120)`
  - `precio_chips(medio)`
  - `volatilidad_chips(baja)`
- **Salida esperada:**
  - `prioridad(asegurar_venta_contrato)`

### R16 — Parcial: chip pulpable

- **Nombre del test:** `test_R16_parcial_chip_pulpable`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(120)`
  - `corteza(no)`
  - `especie(pino)`
- **Salida esperada:**
  - `parcial(chip_pulpable)`

### R17 — Parcial: chip no pulpable

- **Nombre del test:** `test_R17_parcial_chip_no_pulpable`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(120)`
  - `corteza(si)`
- **Salida esperada:**
  - `parcial(chip_no_pulpable)`

### R18 — Suministro caldera (cuando stock bajo)

- **Nombre del test:** `test_R18_suministro_caldera`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(120)`
  - `corteza(si)` *(habilita chip no pulpable)*
  - `demanda_biomasa(alta)`
  - `stock_biomasa(bajo)`
- **Salida esperada:**
  - `recomendar(suministro_caldera)`

### R18B — No suministrar caldera (cuando stock suficiente)

- **Nombre del test:** `test_R18B_no_suministrar_caldera`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(120)`
  - `corteza(si)`
  - `stock_biomasa(suficiente)`
- **Salida esperada:**
  - `recomendar(no_suministrar_caldera)`

### R19 — Prioridad: suministrar chip a caldera

- **Nombre del test:** `test_R19_prioridad_suministrar_chip_caldera`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(120)`
  - `corteza(si)`
  - `caldera(encendida)`
  - `stock_biomasa(bajo)`
- **Salida esperada:**
  - `prioridad(suministrar_chip_caldera)`

### R19B — Vender chip pulpable

- **Nombre del test:** `test_R19B_vender_chip_pulpable`
- **Hechos de entrada:**
  - `tipo(chips)`
  - `volumen(120)`
  - `corteza(no)`
  - `especie(pino)`
  - `stock_biomasa(suficiente)`
- **Salida esperada:**
  - `recomendar(vender_chip_pulpable)`

### R21 — Parcial: apto finger-joint

- **Nombre del test:** `test_R21_parcial_apto_finger_joint`
- **Hechos de entrada:**
  - `tipo(despuntes)`
  - `largo(55)`
  - `ancho(6)`
  - `humedad(12)`
  - `especie(eucalipto)`
- **Salida esperada:**
  - `parcial(apto_finger_joint)`

### R20 — Producir finger-joint (con viabilidad económica y máquina)

- **Nombre del test:** `test_R20_producir_finger_joint`
- **Hechos de entrada:**
  - `tipo(retazos)`
  - `largo(55)`
  - `ancho(6)`
  - `humedad(12)`
  - `especie(pino)` *(o especie habilitada por la regla)*
  - `precio_finger(200)`
  - `precio_chips_num(50)`
  - `maq_finger(si)`
- **Salida esperada:**
  - `recomendar(producir_finger_joint)`

### R22 — Parcial: apto segunda calidad (si hay reprocesadora)

- **Nombre del test:** `test_R22_parcial_apto_segunda_calidad`
- **Hechos de entrada:**
  - `tipo(madera_fallas)`
  - `falla(nudo_estetico)`
  - `maq_reprocesadora(si)`
- **Salida esperada:**
  - `parcial(apto_segunda_calidad)`

### R23 — Prioridad: rectificar / reprocesar

- **Nombre del test:** `test_R23_prioridad_rectificar_reprocesar`
- **Hechos de entrada:**
  - `tipo(madera_fallas)`
  - `falla(curvatura_leve)`
- **Salida esperada:**
  - `prioridad(rectificar_reprocesar)`

### R24 — Vender en planta / descartar por logística (regla global)

- **Nombre del test:** `test_R24_vender_en_planta_descartar`
- **Hechos de entrada:**
  - `costo_flete(25)`
  - `margen_ganancia(20)`
- **Salida esperada:**
  - `recomendar(vender_en_planta_descartar)`

---

## 2) Tests de integración (API ↔ motor de inferencia ↔ persistencia)

**Objetivo:** demostrar “comunicación fluida y sin pérdida de datos” entre la API consumida por el frontend y el motor de inferencias en Prolog, verificando además que el backend guarda historial.

**Metodología común:**

- Se ejecuta un POST JSON contra el endpoint real del backend:
  - `reverse("subproducto-analyze")` (ruta `/api/subproductos/analyze/`)
- Validaciones comunes:
  - Status HTTP `200`
  - `success == True`
  - `debug_facts` es **idéntico** al payload enviado (roundtrip / no pérdida)
  - `recommendations` contiene resultados coherentes

### Integración 01 — Roundtrip + guardado en historial + coherencia básica (chips volumen bajo)

- **Nombre del test:** `test_integration_payload_roundtrip_and_history_saved`
- **Entrada (payload):**
  - **Lote**
    - `category: "Chips"`
    - `species: "Pino"`
    - `volume: 50` (volumen bajo)
    - `humidity: 20`
    - `chemicalContamination: False`
    - `dimensions: {length: "", width: ""}`
    - `defectType: "Curvatura Leve"`
    - `hasBark: True`
  - **Mercado / contexto** (valores varios; relevante: demanda biomasa True, caldera True, stock True, etc.)
- **Validaciones:**
  1) `debug_facts == payload` (no pérdida de datos)
  2) Debe aparecer `no_procesar_chips` dentro de los valores recomendados
     - Justificación: volumen < 100 dispara el caso “no procesar” (equivalente al criterio testado en unit R13B).
  3) Persistencia:
     - Se crea 1 registro en `AnalisisSubproducto`
     - Campos esperados:
       - `categoria == "Chips"`
       - `especie == "Pino"`
       - `volumen == 50.0`
       - `datos_entrada == payload`
       - `resultados` es lista no vacía

### Integración 02 — Aserrín con humedad baja: parcial apto pelletización

- **Nombre del test:** `test_integration_aserrin_partial_apto_pelletizacion`
- **Entrada (payload):**
  - **Lote**
    - `category: "Aserrín"`
    - `humidity: 9` (humedad baja)
    - `volume: 20`
    - `species: "Pino"`
  - **Mercado**
    - `demandaPellets: True` (alta)
    - (otros campos con valores neutros)
- **Validaciones:**
  - `debug_facts == payload`
  - En `recommendations`, debe existir el par `(type="partial", value="apto_pelletizacion")`
  - Justificación: equivale a R07 (apto por humedad), validando que el mapeo API→Prolog no rompe el disparo de la regla.

### Integración 03 — Madera con fallas: “Pudrición Parcial” se interpreta correctamente

- **Nombre del test:** `test_integration_madera_fallas_pudricion_parcial_roundtrip`
- **Entrada (payload):**
  - **Lote**
    - `category: "Madera con Fallas"`
    - `defectType: "Pudrición Parcial"`
    - `volume: 120`
    - `species: "Pino"`
    - `hasBark: False`
  - **Mercado** (neutro)
- **Validaciones:**
  - `debug_facts == payload`
  - Debe aparecer `(type="partial", value="apto_solo_chips")`
  - Justificación: prueba específicamente el caso “pudrición parcial” como entrada textual (normalización/mapeo) y que dispare la regla grave equivalente a R14.

### Integración 04 — Regla logística global R24 (costo flete vs margen)

- **Nombre del test:** `test_integration_logistica_global_R24`
- **Entrada (payload):**
  - **Lote**
    - `category: "Corteza"`
  - **Mercado**
    - `costoFlete: 25`
    - `margen_ganancia` (en API aparece como `margen`/derivado según implementación; en este test se fuerza la condición vía payload del endpoint)
    - `demandaSustrato: True`
    - (otros campos con valores neutros)
- **Validaciones:**
  - `debug_facts == payload`
  - Debe existir `vender_en_planta_descartar` dentro de los valores recomendados
  - Justificación: valida que una regla transversal (no dependiente de un subproducto específico) se aplica al flujo de integración.

---

## 3) Qué evidencia aporta al informe

- **Correctitud lógica (unit tests):** cada regla se valida con el mínimo conjunto de hechos necesarios, incluyendo casos positivos y al menos un caso negativo (R01).
- **Contrato extremo-a-extremo (integration tests):** el endpoint usado por el frontend recibe JSON, lo procesa con el motor, devuelve recomendaciones y además garantiza roundtrip (`debug_facts`) + persistencia en DB.
- **Riesgo cubierto (dato crítico):** “Pudrición Parcial” y otros strings de UI se interpretan correctamente por el motor (normalización).

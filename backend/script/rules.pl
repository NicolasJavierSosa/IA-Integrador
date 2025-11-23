% ==============================================================================
% Sistema Experto para la Industria Maderera - Base de Conocimiento
% ==============================================================================

% Definición de operadores para facilitar la lectura (opcional)
:- op(800, fx, if).
:- op(700, xfx, then).
:- op(300, xfy, or).
:- op(200, xfy, and).

% ==============================================================================
% Reglas para Sustrato para viveros
% ==============================================================================

% REGLA 01 (Viabilidad sustrato para viveros por Demanda)
regla(1,
    (tipo_subproducto('Corteza'), demanda_sustrato_local('Alta')),
    recomendacion_optima('Producir_Sustrato'),
    0.75).
% Justificación: La alta demanda local hace viable económicamente el sustrato de corteza.

% REGLA 02 (Viabilidad Compost Corteza (Refinada))
regla(2,
    (tipo_subproducto('Corteza'), mercado_local_compost('Verdadero'), contaminacion_quimica('Ninguna')),
    recomendacion_optima('Producir_Compostaje'),
    0.80).
% Justificación: Refina la REGLA 04, añadiendo la restricción de seguridad.

% REGLA 03 (Compostaje de Corteza de Pino)
regla(3,
    (tipo_subproducto('Corteza'), especie('Pino'), demanda_compost_local('Alta')),
    recomendacion_optima('Compostaje_o_Sustrato_Acidofilo'),
    0.80).
% Justificación: La corteza de pino es muy valorada para sustratos de jardinería por su acidez.

% REGLA 04 (Evaluación Compostaje Corteza)
regla(4,
    (tipo_subproducto('Corteza'), demanda_compost_local('Baja'), espacio_disponible_compostaje('Limitado')),
    recomendacion_optima('No_Compostar_Almacenar_Temporalmente'),
    0.70).
% Justificación: Cuando el mercado y el espacio no justifican el compostaje.

% REGLA 05 (Valorización Corteza Pino)
regla(5,
    (tipo_subproducto('Corteza'), demanda_jardineria('Alta')),
    recomendacion_optima('Sustrato_Jardineria'),
    0.85).
% Justificación: La corteza tiene buena acidez y estructura para sustratos ornamentales.

% ==============================================================================
% Reglas para Aserrín y pellets
% ==============================================================================

% REGLA 06 (Viabilidad Pelletización Propia por Volumen y demanda)
regla(6,
    (volumen_ton(V), V >= 200, tipo_subproducto('Aserrin'), demanda_mercado_local_pellets('Alta')),
    recomendacion_parcial('Apto_para_Pelletizacion_Propia'),
    0.80).
% Justificación: El volumen y la demanda es suficiente para justificar la línea de producción.

% REGLA 07 (Viabilidad Pelletización Propia por humedad y demanda)
regla(7,
    (humedad(H), H =< 10, tipo_subproducto('Aserrin'), demanda_mercado_local_pellets('Alta')),
    recomendacion_parcial('Apto_para_Pelletizacion_Propia'),
    0.80).
% Justificación: La humedad y la demanda es suficiente para justificar la línea de producción.

% REGLA 08 (Venta Aserrin)
regla(8,
    (volumen_ton(V), V >= 200, tipo_subproducto('Aserrin'), demanda_mercado_local_pellets('Baja')),
    recomendacion_optima('Vender_Aserrin'),
    0.70).
% Justificación: Si no hay mercado para pellets, la venta de aserrín es la mejor alternativa.

% REGLA 09 (Modificador por Volatilidad de Mercado - Riesgo)
regla(9,
    (precio_mercado_pellet('Alto'), volatilidad_precio_pellet_30dias('Alta')),
    modificar_fc(recomendacion('Producir_Pellets'), 0.7),
    1.0).
% Justificación: El precio es alto, pero riesgoso.

% REGLA 10 (Válvula de Escape)
regla(10,
    (recomendacion_parcial('Apto_Pellet'), capacidad_almacenamiento_pellet(C), C > 90),
    recomendacion_optima('Vender_Pellet'),
    0.85).
% Justificación: No hay dónde guardar los pellets.

% ==============================================================================
% Reglas para residuos de tipo Retazos
% ==============================================================================

% REGLA 11 (Aptitud Venta para Tableros)
regla(11,
    ((tipo_subproducto('Retazos') ; tipo_subproducto('Meollos_Roletes')), volumen_anual_ton(V), V >= 50),
    recomendacion_parcial('Apto_para_Venta_Tableros'),
    0.75).
% Justificación: Los recortes sólidos y roletes son materia prima directa para tableros.

% REGLA 12 (Uso Preferente de Retazos Grandes)
regla(12,
    (tipo_subproducto('Retazo'), dimension_largo_promedio_cm(L), L > 60),
    recomendacion_prioridad('Destinar_a_FingerJoint_o_Moldura'),
    0.85).
% Justificación: Prioriza material de mayor dimensión.

% ==============================================================================
% Reglas para Chips
% ==============================================================================

% REGLA 13 (Priorización Chips por Maquinaria Existente)
regla(13,
    (maquinaria_chipeadora_disponible('SI'), volumen_anual_ton(V), V >= 100),
    recomendacion_parcial('Priorizar_Produccion_Chips'),
    0.85).
% Justificación: La maquinaria ya está disponible (costo hundido).

% REGLA 14 (Descarte de Maderas Falladas)
regla(14,
    (tipo_subproducto('Madera_con_fallas'), (grado_falla('Grieta_profunda') ; grado_falla('Pudricion_parcial'))),
    recomendacion_parcial('Apto_Solo_Chips'),
    1.0).
% Justificación: Falla estructural.

% REGLA 15 (Modificador por Volatilidad de Mercado - Estabilidad)
regla(15,
    (precio_mercado_chips('Medio'), volatilidad_precio_chips_30dias('Baja')),
    modificar_fc(recomendacion('Producir_Chips'), 1.1),
    1.0).
% Justificación: Un precio medio pero estable es más deseable.

% REGLA 16 (Chip Pulpable)
regla(16,
    (tipo_subproducto('Chip'), contiene_corteza('No'), (especie('Pino') ; especie('Eucalipto'))),
    recomendacion_parcial('Chip_Pulpable'),
    0.90).
% Justificación: Chips limpios de especies fibrosas son aptos para pasta celulósica.

% REGLA 17 (Chip No Pulpable)
regla(17,
    (tipo_subproducto('Chip'), contiene_corteza('Si')),
    recomendacion_parcial('Chip_No_Pulpable'),
    0.95).
% Justificación: La corteza impide su uso en celulosa.

% REGLA 18 (Destino Prioritario de Chip No Pulpable)
regla(18,
    (recomendacion_parcial('Chip_No_Pulpable'), demanda_biomasa('Alta')),
    recomendacion_optima('Suministro_a_Caldera'),
    0.90).
% Justificación: Los chips no pulpables pueden usarse directamente como combustible.

% REGLA 19 (Demanda Diaria de Caldera)
regla(19,
    (caldera_encendida('Si'), demanda_termica_diaria_ton_chip(D), D >= 10),
    recomendacion_prioridad('Suministrar_Chip_a_Caldera'),
    1.0).
% Justificación: La caldera en funcionamiento requiere aporte continuo.

% ==============================================================================
% Reglas para Finger Joint
% ==============================================================================

% REGLA 20 (Viabilidad Económica Finger-Joint)
regla(20,
    (recomendacion_parcial('Apto_para_Finger_Joint'), precio_mercado_finger_joint_m3(PF), precio_mercado_chips_ton(PC), PF > (PC * 2.5), maquinaria_finger_joint_disponible('SI')),
    recomendacion_optima('Producir_Finger_Joint'),
    0.85).
% Justificación: Solo es rentable si su precio supera significativamente el de chips.

% REGLA 21 (Potencial de Finger-Joint)
regla(21,
    ((tipo_subproducto('Retazo') ; tipo_subproducto('Despunte')), dimension_largo_promedio_cm(L), L > 50, dimension_ancho_promedio_cm(A), A > 5, humedad(H), H < 18, (especie('Pino') ; especie('Eucalipto'))),
    recomendacion_parcial('Apto_para_Finger_Joint'),
    0.90).
% Justificación: Identifica material con dimensiones suficientes.

% REGLA 22 (Recuperación de Maderas Falladas)
regla(22,
    (tipo_subproducto('Madera_con_fallas'), (grado_falla('Curvatura_leve') ; grado_falla('Nudo_estetico')), maquinaria_reprocesadora_disponible('SI')),
    recomendacion_parcial('Apto_para_Segunda_Calidad'),
    0.70).
% Justificación: Madera recuperable.

% REGLA 23 (Uso Alternativo por Falla Leve)
regla(23,
    (tipo_subproducto('Madera_con_falla'), grado_falla('Curvatura_leve')),
    recomendacion_prioridad('Rectificar_y_Reprocesar'),
    0.70).
% Justificación: Evita descartar material recuperable.


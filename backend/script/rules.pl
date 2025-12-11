% ==============================================================================
% Sistema Experto EcoWood - Base de Conocimiento (Prolog)
% ==============================================================================

% 1. Definición de Predicados Dinámicos (Atributos del Sistema)
% Estos predicados representan los hechos que cambiarán con cada consulta.
:- dynamic tipo/1.
:- dynamic demanda_sustrato/1.
:- dynamic mercado_compost/1.

% Instucciones para permitir predicados no contiguos (Agrupados por tema, no por predicado)
:- discontiguous recomendar/1.
:- discontiguous parcial/1.
:- discontiguous prioridad/1.
:- dynamic contaminacion/1.
:- dynamic especie/1.
:- dynamic demanda_compost/1.
:- dynamic espacio_compost/1.
:- dynamic demanda_jardineria/1.
:- dynamic volumen/1.
:- dynamic demanda_pellets/1.
:- dynamic humedad/1.
:- dynamic precio_pellet/1.
:- dynamic volatilidad_pellet/1.
:- dynamic capacidad_almacenamiento/1.
:- dynamic largo/1.
:- dynamic ancho/1.
:- dynamic maq_chipeadora/1.
:- dynamic falla/1.
:- dynamic precio_chips/1.
:- dynamic volatilidad_chips/1.
:- dynamic corteza/1.
:- dynamic demanda_biomasa/1.
:- dynamic caldera/1.
:- dynamic stock_biomasa/1.
:- dynamic precio_finger/1.
:- dynamic maq_finger/1.
:- dynamic maq_reprocesadora/1.
:- dynamic costo_flete/1.
:- dynamic margen_ganancia/1.

% ==============================================================================
% REGLAS DE NEGOCIO
% ==============================================================================

% --- Reglas para Sustrato y Corteza ---

% REGLA 01: Producción de Sustrato por alta demanda (genérico, solo si no hay opción específica)
recomendar(producir_sustrato) :-
    tipo(corteza),
    demanda_sustrato(alta),
    % No activar si hay una recomendación más específica (R03 para Pino)
    \+ (especie(pino), demanda_compost(alta)).

% REGLA 02: Compostaje seguro (sin contaminación y con demanda)
recomendar(producir_compostaje) :-
    tipo(corteza),
    mercado_compost(verdadero),
    contaminacion(ninguna),
    demanda_compost(alta).

% REGLA 03: Compostaje específico para Pino (Acidófilo)
recomendar(compostaje_o_sustrato_acidofilo) :-
    tipo(corteza),
    especie(pino),
    demanda_compost(alta).

% REGLA 04: Almacenamiento temporal por falta de condiciones
recomendar(almacenar_temporalmente) :-
    tipo(corteza),
    demanda_compost(baja),
    espacio_compost(limitado).

% REGLA 05: Sustrato para jardinería
recomendar(sustrato_jardineria) :-
    tipo(corteza),
    demanda_jardineria(alta).

% --- Reglas para Aserrín y Pellets ---

% REGLA 06: Viabilidad industrial para pellets (Volumen)
parcial(apto_pelletizacion) :-
    volumen(V), V >= 200,
    tipo(aserrin),
    demanda_pellets(alta).

% REGLA 07: Viabilidad técnica para pellets (Humedad)
% Nota: Se mantiene como cláusula separada para permitir múltiples caminos a 'apto_pelletizacion'
parcial(apto_pelletizacion) :-
    humedad(H), H =< 10,
    tipo(aserrin).

% REGLA 08: Venta directa de aserrín (Baja demanda de pellets)
recomendar(vender_aserrin) :-
    volumen(V), V >= 200,
    tipo(aserrin),
    demanda_pellets(baja).

% REGLA 09: Bloqueo por riesgo financiero (Prioritaria)
% Si el precio del pellet está alto y hay alta volatilidad, mejor vender el aserrín directamente
recomendar(vender_aserrin) :-
    tipo(aserrin),
    precio_pellet(alto),
    volatilidad_pellet(alta).

% REGLA 10: Forzar venta por falta de stock (Regla de seguridad)
recomendar(forzar_venta_inmediata) :-
    parcial(apto_pelletizacion),
    capacidad_almacenamiento(C), C < 10.

% --- Reglas para Retazos ---

% REGLA 11: Aptitud para tableros (solo si NO califica para finger joint)
parcial(apto_venta_tableros) :-
    (tipo(retazos) ; tipo(meollos)),
    volumen(V), V >= 50,
    % NO califica para finger joint si falla alguna condición
    (
        \+ (largo(L), L > 50) ;  % Largo insuficiente
        \+ (ancho(A), A > 5) ;   % Ancho insuficiente
        \+ (humedad(H), H < 18) ; % Humedad alta
        \+ ((especie(pino) ; especie(eucalipto))) % Especie inadecuada
    ).

% REGLA 12: Prioridad por dimensiones grandes (solo si es económicamente viable)
prioridad(finger_joint_o_moldura) :-
    (tipo(retazos) ; tipo(despuntes)),
    largo(L), L > 60,
    % Validar viabilidad económica
    precio_finger(Pf),
    precio_chips_num(Pc),
    Pf > (Pc * 2.5).

% --- Reglas para Chips ---

% REGLA 13: Validación de volumen suficiente para procesamiento de chips
parcial(producir_chips) :-
    tipo(chips),
    volumen(V), V >= 100.

% REGLA 13B: Volumen insuficiente de chips
recomendar(no_procesar_chips) :-
    tipo(chips),
    volumen(V), V < 100.

% REGLA 14: Descarte de madera con fallas graves
parcial(apto_solo_chips) :-
    tipo(madera_fallas),
    (falla(grieta_profunda) ; falla(pudricion)).

% REGLA 15: Asegurar venta por estabilidad de mercado
% Si el precio está en rango medio-alto y el mercado es estable, asegurar venta por contrato
prioridad(asegurar_venta_contrato) :-
    parcial(producir_chips),
    (precio_chips(medio) ; precio_chips(alto)),
    volatilidad_chips(baja).

% REGLA 16: Chip Pulpable (Limpio y de especie correcta)
parcial(chip_pulpable) :-
    parcial(producir_chips),
    corteza(no),
    (especie(pino) ; especie(eucalipto)).

% REGLA 17: Chip No Pulpable (Sucio)
parcial(chip_no_pulpable) :-
    parcial(producir_chips),
    corteza(si).

% REGLA 18: Suministro a caldera (Chip sucio + Demanda alta + Stock bajo)
recomendar(suministro_caldera) :-
    parcial(chip_no_pulpable),
    demanda_biomasa(alta),
    stock_biomasa(bajo).

% REGLA 18B: No suministrar si stock es suficiente
recomendar(no_suministrar_caldera) :-
    parcial(chip_no_pulpable),
    stock_biomasa(suficiente).

% REGLA 19: Prioridad de abastecimiento energético
% Solo se activa si realmente hay necesidad urgente (caldera encendida + stock bajo)
% Y si el chip es NO pulpable (con corteza) ya que el pulpable tiene mejor destino (venta)
prioridad(suministrar_chip_caldera) :-
    parcial(chip_no_pulpable),
    caldera(encendida),
    stock_biomasa(bajo).

% REGLA 19B: Chip pulpable - mejor venderlo que usarlo en caldera
recomendar(vender_chip_pulpable) :-
    parcial(chip_pulpable),
    stock_biomasa(suficiente).

% --- Reglas Finger Joint y Logística ---

% REGLA 20: Viabilidad económica Finger Joint
recomendar(producir_finger_joint) :-
    parcial(apto_finger_joint),
    precio_finger(Pf),
    precio_chips_num(Pc),  % Usar precio numérico de chips
    Pf > (Pc * 2.5),
    maq_finger(si).

% REGLA 21: Aptitud técnica Finger Joint
parcial(apto_finger_joint) :-
    (tipo(retazos) ; tipo(despuntes)),
    largo(L), L > 50,
    ancho(A), A > 5,
    humedad(H), H < 18,
    (especie(pino) ; especie(eucalipto)).

% REGLA 22: Recuperación de segunda calidad
parcial(apto_segunda_calidad) :-
    tipo(madera_fallas),
    (falla(curvatura_leve) ; falla(nudo_estetico)),
    maq_reprocesadora(si).

% REGLA 23: Rectificación de fallas leves
prioridad(rectificar_reprocesar) :-
    tipo(madera_fallas),
    falla(curvatura_leve).

% REGLA 24: Viabilidad logística (Flete vs Margen)
recomendar(vender_en_planta_descartar) :-
    costo_flete(Cf),
    margen_ganancia(Mg),
    Cf >= Mg.

% ==============================================================================
% SET DE PRUEBAS (Descomentar para verificar)
% ==============================================================================

% Caso de Prueba: Lote de Retazos de Pino apto para Finger Joint
% ------------------------------------------------------------------------------
% tipo(retazo).
% largo(55).
% ancho(6).
% humedad(12).
% especie(pino).
% precio_finger(100).
% precio_chips(30).
% maq_finger(si).

% Consulta esperada:
% ?- recomendar(X).
% X = producir_finger_joint.

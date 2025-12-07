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

% REGLA 01: Producción de Sustrato por alta demanda
recomendar(producir_sustrato) :-
    tipo(corteza),
    demanda_sustrato(alta).

% REGLA 02: Compostaje seguro (sin contaminación)
recomendar(producir_compostaje) :-
    tipo(corteza),
    mercado_compost(verdadero),
    contaminacion(ninguna).

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
recomendar(vender_aserrin) :-
    precio_pellet(P), P > 110,  % Umbral de precio alto
    volatilidad_pellet(alta).

% REGLA 10: Forzar venta por falta de stock (Regla de seguridad)
recomendar(forzar_venta_inmediata) :-
    parcial(apto_pelletizacion),
    capacidad_almacenamiento(C), C < 10.

% --- Reglas para Retazos ---

% REGLA 11: Aptitud para tableros
parcial(apto_venta_tableros) :-
    (tipo(retazos) ; tipo(meollos)),
    volumen(V), V >= 50.

% REGLA 12: Prioridad por dimensiones grandes
prioridad(finger_joint_o_moldura) :-
    tipo(retazo),
    largo(L), L > 60.

% --- Reglas para Chips ---

% REGLA 13: Producción de chips por maquinaria disponible
parcial(producir_chips) :-
    maq_chipeadora(si),
    volumen(V), V >= 100.

% REGLA 14: Descarte de madera con fallas graves
parcial(apto_solo_chips) :-
    tipo(madera_fallas),
    (falla(grieta_profunda) ; falla(pudricion)).

% REGLA 15: Asegurar venta por estabilidad de mercado
prioridad(asegurar_venta_contrato) :-
    precio_chips(P), P > 30, P < 90, % Rango medio estimado
    volatilidad_chips(baja).

% REGLA 16: Chip Pulpable (Limpio y de especie correcta)
parcial(chip_pulpable) :-
    tipo(chip),
    corteza(no),
    (especie(pino) ; especie(eucalipto)).

% REGLA 17: Chip No Pulpable (Sucio)
parcial(chip_no_pulpable) :-
    tipo(chip),
    corteza(si).

% REGLA 18: Suministro a caldera (Chip sucio + Demanda)
recomendar(suministro_caldera) :-
    parcial(chip_no_pulpable),
    demanda_biomasa(alta).

% REGLA 19: Prioridad de abastecimiento energético
prioridad(suministrar_chip_caldera) :-
    caldera(encendida),
    stock_biomasa(bajo).

% --- Reglas Finger Joint y Logística ---

% REGLA 20: Viabilidad económica Finger Joint
recomendar(producir_finger_joint) :-
    parcial(apto_finger_joint),
    precio_finger(Pf),
    precio_chips(Pc),
    Pf > (Pc * 2.5),
    maq_finger(si).

% REGLA 21: Aptitud técnica Finger Joint
parcial(apto_finger_joint) :-
    (tipo(retazo) ; tipo(despunte)),
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

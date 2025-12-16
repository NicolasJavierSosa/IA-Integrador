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
:- dynamic precio_chips_num/1.
:- dynamic volatilidad_chips/1.
:- dynamic corteza/1.
:- dynamic demanda_biomasa/1.
:- dynamic caldera/1.
:- dynamic stock_biomasa/1.
:- dynamic precio_finger/1.
:- dynamic maq_finger/1.
:- dynamic maq_reprocesadora/1.
:- dynamic maq_pelletizadora/1.
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
    \+ demanda_sustrato(alta),
    contaminacion(ninguna).

% REGLA 03: Compostaje específico para Pino (Acidófilo)
recomendar(compostaje_o_sustrato_acidofilo) :-
    tipo(corteza),
    \+ demanda_sustrato(alta),
    \+ contaminacion(ninguna),
    especie(pino),
    demanda_compost(alta).

% REGLA 04: Almacenamiento temporal por falta de condiciones
recomendar(almacenar_temporalmente) :-
    tipo(corteza),
    \+ demanda_sustrato(alta),
    \+ contaminacion(ninguna),
    \+ (especie(pino), demanda_compost(alta)),
    demanda_compost(baja),
    espacio_compost(limitado).

% REGLA 05: Sustrato para jardinería
recomendar(sustrato_jardineria) :-
    tipo(corteza),
    \+ demanda_sustrato(alta),
    \+ contaminacion(ninguna),
    \+ (especie(pino), demanda_compost(alta)),
    \+ (demanda_compost(baja), espacio_compost(limitado)),
    demanda_jardineria(alta).

% --- Reglas para Aserrín y Pellets ---

% REGLA 06: Descarte por volumen insuficiente
recomendar(descartar_aserrin) :-
    tipo(aserrin),
    volumen(V), V < 5.

% REGLA 07: Apto para pelletización solo si hay pelletizadora y humedad < 9%
parcial(apto_pelletizacion) :-
    tipo(aserrin),
    volumen(V), V >= 5,
    maq_pelletizadora(si),
    humedad(H), H < 9.

% REGLA 10: Si está apto para pelletización y el almacenamiento de pellets está > 90% (muy lleno), forzar venta inmediata
recomendar(forzar_venta_inmediata) :-
    parcial(apto_pelletizacion),
    capacidad_almacenamiento(C), C > 90.

% Si está apto para pelletización y hay capacidad (<= 90%), almacenar pellets
recomendar(almacenar_pellet) :-
    parcial(apto_pelletizacion),
    capacidad_almacenamiento(C), C =< 90.

% Sin pelletizadora: decidir por demanda de pellets
% Si demanda pellets es alta, vender aserrín
recomendar(vender_aserrin) :-
    tipo(aserrin),
    volumen(V), V >= 5,
    maq_pelletizadora(no),
    demanda_pellets(alta).

% Si demanda pellets es baja, descartar aserrín
recomendar(descartar_aserrin) :-
    tipo(aserrin),
    volumen(V), V >= 5,
    maq_pelletizadora(no),
    demanda_pellets(baja).

% --- Reglas para Retazos ---

% REGLA 11: Aptitud para tableros
recomendar(apto_venta_tableros) :-
    tipo(retazos),
    volumen(V), V >= 50.

% REGLA 12: Candidato a Finger Joint por dimensiones grandes
parcial(candidato_finger_joint) :-
    tipo(retazos),
    largo(L), L > 60.

% --- Reglas para Chips ---

% REGLA 13: Validación de volumen suficiente para procesamiento de chips
% Nota: Para la rama CHIPS, el material ya está producido. Evitar salidas "producir_*".
parcial(chips_volumen_suficiente) :-
    tipo(chips),
    volumen(V), V >= 10.

% REGLA 13B: Volumen insuficiente de chips
recomendar(descartar_chips) :-
    tipo(chips),
    volumen(V), V < 10.

% REGLA 14: Descarte de madera con fallas graves
parcial(apto_solo_chips) :-
    tipo(madera_fallas),
    (falla(grieta_profunda) ; falla(pudricion) ; falla(pudricion_parcial)).

% REGLA 14C: Si solo sirve para chips y hay chipeadora disponible, producir chips
recomendar(producir_chips) :-
    parcial(apto_solo_chips),
    maq_chipeadora(si).

% REGLA 14D: Madera con fallas graves sin chipeadora.
% Si el stock de biomasa es crítico (bajo) => prioridad: suministrar a caldera.
% Si el stock es suficiente => descartar.
prioridad(suministrar_caldera) :-
    tipo(madera_fallas),
    (falla(grieta_profunda) ; falla(pudricion) ; falla(pudricion_parcial)),
    maq_chipeadora(no),
    stock_biomasa(bajo).

recomendar(descartar_material) :-
    tipo(madera_fallas),
    (falla(grieta_profunda) ; falla(pudricion) ; falla(pudricion_parcial)),
    maq_chipeadora(no),
    stock_biomasa(suficiente).

% REGLA 15: Asegurar venta por estabilidad de mercado (solo si NO hay urgencia energética)
% Si el precio está en rango medio-alto y el mercado es estable, asegurar venta por contrato
prioridad(asegurar_venta_contrato) :-
    parcial(chips_volumen_suficiente),
    stock_biomasa(suficiente),
    (precio_chips(medio) ; precio_chips(alto)),
    volatilidad_chips(baja).

% REGLA 16: Venta de chips pulpables (limpios y de especie correcta)
recomendar(vender_chip_pulpable) :-
    parcial(chips_volumen_suficiente),
    stock_biomasa(suficiente),
    corteza(no),
    (especie(pino) ; especie(eucalipto)).

% REGLA 17: Chip No Pulpable (Sucio)
parcial(chip_no_pulpable) :-
    parcial(chips_volumen_suficiente),
    corteza(si).

% REGLA 19: Si stock biomasa está crítico, enviar chips a caldera.
% (Bloquea decisiones de venta cuando hay urgencia energética)
prioridad(suministrar_chip_caldera) :-
    parcial(chips_volumen_suficiente),
    stock_biomasa(bajo).

% Regla de venta genérica (si hay volumen suficiente y stock biomasa suficiente)
recomendar(vender_chips) :-
    parcial(chips_volumen_suficiente),
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
    tipo(retazos),
    largo(L), L > 50,
    ancho(A), A > 5,
    humedad(H), H < 18,
    (especie(pino) ; especie(eucalipto)).

% REGLA 22: Recuperación de segunda calidad
parcial(apto_segunda_calidad) :-
    tipo(madera_fallas),
    (falla(curvatura_leve) ; falla(nudo_estetico)),
    maq_reprocesadora(si).

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

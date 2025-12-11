graph TD
    Root["INICIO: ¿Tipo de Subproducto?"] --> B_Corteza("Rama: CORTEZA")
    Root --> B_Aserrin("Rama: ASERRÍN")
    Root --> B_Solidos("Rama: RETAZOS / DESPUNTES")
    Root --> B_Chips("Rama: CHIPS")
    Root --> B_Fallas("Rama: MADERA CON FALLAS")

    %% ==========================================
    %% RAMA CORTEZA (Reglas R01-R05)
    %% ==========================================
    B_Corteza --> C1{"♦ R01: ¿Tipo = Corteza<br/>Y Demanda Sustrato = Alta?"}
    C1 -- SI --> C1_End["★ Recomendar: PRODUCIR SUSTRATO"]
    C1 -- NO --> C2{"♦ R02: ¿Tipo = Corteza<br/>Y Mercado Compost = Verdadero<br/>Y Contaminación = Ninguna?"}
    C2 -- SI --> C2_End["★ Recomendar: PRODUCIR COMPOSTAJE"]
    C2 -- NO --> C3{"♦ R03: ¿Tipo = Corteza<br/>Y Especie = Pino<br/>Y Demanda Compost = Alta?"}
    C3 -- SI --> C3_End["★ Recomendar: COMPOSTAJE/SUSTRATO ACIDÓFILO"]
    C3 -- NO --> C4{"♦ R04: ¿Tipo = Corteza<br/>Y Demanda Compost = Baja<br/>Y Espacio Compost = Limitado?"}
    C4 -- SI --> C4_End["★ Recomendar: ALMACENAR TEMPORALMENTE"]
    C4 -- NO --> C5{"♦ R05: ¿Tipo = Corteza<br/>Y Demanda Jardinería = Alta?"}
    C5 -- SI --> C5_End["★ Recomendar: SUSTRATO JARDINERÍA"]
    C5 -- NO --> C_Default["Sin recomendación específica"]

    %% ==========================================
    %% RAMA ASERRÍN (Reglas R06-R10)
    %% ==========================================
    B_Aserrin --> A6{"♦ R06: ¿Volumen >= 200<br/>Y Tipo = Aserrín<br/>Y Demanda Pellets = Alta?"}
    A6 -- SI --> A6_End["🔵 Parcial: APTO PELLETIZACIÓN"]
    A6 -- NO --> A7{"♦ R07: ¿Humedad <= 10%<br/>Y Tipo = Aserrín?"}
    A7 -- SI --> A7_End["🔵 Parcial: APTO PELLETIZACIÓN"]
    
    A7 -- NO --> A8{"♦ R08: ¿Volumen >= 200<br/>Y Tipo = Aserrín<br/>Y Demanda Pellets = Baja?"}
    A8 -- SI --> A8_End["★ Recomendar: VENDER ASERRÍN"]
    
    A8 -- NO --> A9{"♦ R09: ¿Tipo = Aserrín<br/>Y Precio Pellet = Alto<br/>Y Volatilidad Pellet = Alta?"}
    A9 -- SI --> A9_End["★ Recomendar: VENDER ASERRÍN<br/>(Riesgo financiero por mercado volátil)"]
    A9 -- NO --> A9_Skip["Condiciones normales"]
    
    A6_End --> A10{"♦ R10: ¿Parcial Apto Pelletización<br/>Y Capacidad Almacenamiento < 10%?"}
    A7_End --> A10
    A10 -- SI --> A10_End["★ Recomendar: FORZAR VENTA INMEDIATA"]
    A10 -- NO --> A10_Skip["No hay recomendación específica"]

    %% ==========================================
    %% RAMA SÓLIDOS (Reglas R11, R12, R20, R21)
    %% ==========================================
    B_Solidos --> S11{"♦ R11: ¿Tipo = Retazos O Meollos<br/>Y Volumen >= 50?"}
    S11 -- SI --> S11_End["🔵 Parcial: APTO VENTA TABLEROS"]
    
    S11 -- NO --> S12{"♦ R12: ¿Tipo = Retazo<br/>Y Largo > 60?"}
    S12 -- SI --> S12_End["🟡 Prioridad: FINGER JOINT O MOLDURA"]
    
    S12 -- NO --> S21{"♦ R21: ¿Tipo = Retazo O Despunte<br/>Y Largo > 50<br/>Y Ancho > 5<br/>Y Humedad < 18%<br/>Y Especie = Pino O Eucalipto?"}
    S21 -- SI --> S21_End["🔵 Parcial: APTO FINGER JOINT"]
    S21 -- NO --> S_Default["Sin recomendación específica"]
    
    S21_End --> S20{"♦ R20: ¿Parcial Apto Finger Joint<br/>Y Precio FJ > 2.5 × Precio Chips<br/>Y Maq Finger = SI?"}
    S20 -- SI --> S20_End["★ Recomendar: PRODUCIR FINGER JOINT"]
    S20 -- NO --> S20_Skip["No producir FJ"]

    %% ==========================================
    %% RAMA CHIPS (Reglas R13, R15-R19)
    %% ==========================================
    B_Chips --> CH13{"♦ R13: ¿Tipo = Chips<br/>Y Maq Chipeadora = SI<br/>Y Volumen >= 100?"}
    CH13 -- SI --> CH13_End["🔵 Parcial: PRODUCIR CHIPS"]
    CH13 -- NO --> CH13_Skip["No procesar chips"]
    
    CH13_End --> CH16{"♦ R16: ¿Tipo = Chips<br/>Y Corteza = NO<br/>Y Especie = Pino O Eucalipto?"}
    CH16 -- SI --> CH16_End["🔵 Parcial: CHIP PULPABLE"]
    
    CH13_End --> CH17{"♦ R17: ¿Tipo = Chips<br/>Y Corteza = SI?"}
    CH17 -- SI --> CH17_End["🔵 Parcial: CHIP NO PULPABLE"]
    
    CH17_End --> CH18{"♦ R18: ¿Parcial Chip No Pulpable<br/>Y Demanda Biomasa = Alta?"}
    CH18 -- SI --> CH18_End["★ Recomendar: SUMINISTRO CALDERA"]
    CH18 -- NO --> CH18_Skip["No suministrar"]
    
    CH13_End --> CH19{"♦ R19: ¿Tipo = Chips<br/>Y Caldera = Encendida<br/>Y Stock Biomasa = Bajo?"}
    CH19 -- SI --> CH19_End["🟡 Prioridad: SUMINISTRAR CHIP CALDERA"]
    CH19 -- NO --> CH19_Skip["No prioritario"]
    
    CH13_End --> CH15{"♦ R15: ¿Tipo = Chips<br/>Y Precio Chips = Medio o Alto<br/>Y Volatilidad Chips = Baja?"}
    CH15 -- SI --> CH15_End["🟡 Prioridad: ASEGURAR VENTA CONTRATO<br/>(Mercado estable con precio razonable)"]
    CH15 -- NO --> CH15_Skip["Precio bajo o volatilidad alta"]

    %% ==========================================
    %% RAMA MADERA CON FALLAS (Reglas R14, R22, R23)
    %% ==========================================
    B_Fallas --> F14{"♦ R14: ¿Tipo = Madera Fallas<br/>Y Falla = Grieta Profunda<br/>O Falla = Pudrición?"}
    F14 -- SI --> F14_End["🔵 Parcial: APTO SOLO CHIPS"]
    F14 -- NO --> F14_Skip["No aplicable"]
    
    B_Fallas --> F23{"♦ R23: ¿Tipo = Madera Fallas<br/>Y Falla = Curvatura Leve?"}
    F23 -- SI --> F23_End["🟡 Prioridad: RECTIFICAR REPROCESAR"]
    F23 -- NO --> F23_Skip["No aplicable"]
    
    B_Fallas --> F22{"♦ R22: ¿Tipo = Madera Fallas<br/>Y Falla = Curvatura Leve O Nudo Estético<br/>Y Maq Reprocesadora = SI?"}
    F22 -- SI --> F22_End["🔵 Parcial: APTO SEGUNDA CALIDAD"]
    F22 -- NO --> F22_Skip["No aplicable"]

    %% ==========================================
    %% REGLA FINAL GLOBAL (R24)
    %% ==========================================
    GlobalGate{"🛑 R24: REGLA LOGÍSTICA GLOBAL<br/>¿Costo Flete >= Margen Ganancia?"}
    GlobalGate -- SI --> Global_End["★ Recomendar: VENDER EN PLANTA O DESCARTAR"]

    %% Conexión de recomendaciones principales a R24
    C1_End -.-> GlobalGate
    C2_End -.-> GlobalGate
    C3_End -.-> GlobalGate
    C5_End -.-> GlobalGate
    A8_End -.-> GlobalGate
    A9_End -.-> GlobalGate
    A10_End -.-> GlobalGate
    S20_End -.-> GlobalGate
    CH18_End -.-> GlobalGate

    %% ==========================================
    %% LEYENDA DE TIPOS
    %% ==========================================
    %% ★ Verde = recomendar/1 (Recomendación Óptima)
    %% 🔵 Azul = parcial/1 (Viabilidad Parcial)
    %% 🟡 Amarillo = prioridad/1 (Acción Prioritaria)
    %% Estilos
    style C1_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    style C2_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    style C3_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    style C4_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    style C5_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    
    style A6_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    style A7_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    style A8_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    style A9_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    style A10_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    
    style S11_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    style S12_End fill:#ffc107,stroke:#d39e00,color:#000,stroke-width:2px
    style S21_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    style S20_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    
    style CH13_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    style CH16_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    style CH17_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    style CH15_End fill:#ffc107,stroke:#d39e00,color:#000,stroke-width:2px
    style CH18_End fill:#198754,stroke:#145c32,color:#fff,stroke-width:2px
    style CH19_End fill:#ffc107,stroke:#d39e00,color:#000,stroke-width:2px
    
    style F14_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    style F23_End fill:#ffc107,stroke:#d39e00,color:#000,stroke-width:2px
    style F22_End fill:#0dcaf0,stroke:#0aa2c0,color:#000,stroke-width:2px
    
    style Global_End fill:#dc3545,stroke:#000,stroke-width:3px,color:#fff,stroke-dasharray: 5 5
import os
import unittest

from pyswip import Prolog


def _rules_path() -> str:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "rules.pl").replace("\\", "/")


def _collect_atoms(query_results, var_name: str) -> set[str]:
    values: set[str] = set()
    for row in query_results:
        values.add(str(row[var_name]))
    return values


class PrologRulesUnitTests(unittest.TestCase):
    """Unit tests for Prolog rules in backend/script/rules.pl.

    Notes:
    - Uses a fresh SWI-Prolog engine per test case but the embedded DB can still
      persist across instances, so we explicitly retract dynamic facts.
    - These tests validate rule semantics by asserting minimal facts.
    """

    DYNAMIC_PREDICATES = [
        "tipo/1",
        "demanda_sustrato/1",
        "mercado_compost/1",
        "contaminacion/1",
        "especie/1",
        "demanda_compost/1",
        "espacio_compost/1",
        "demanda_jardineria/1",
        "volumen/1",
        "demanda_pellets/1",
        "humedad/1",
        "precio_pellet/1",
        "volatilidad_pellet/1",
        "capacidad_almacenamiento/1",
        "largo/1",
        "ancho/1",
        "maq_chipeadora/1",
        "falla/1",
        "precio_chips/1",
        "precio_chips_num/1",
        "volatilidad_chips/1",
        "corteza/1",
        "demanda_biomasa/1",
        "caldera/1",
        "stock_biomasa/1",
        "precio_finger/1",
        "maq_finger/1",
        "maq_reprocesadora/1",
        "maq_pelletizadora/1",
        "costo_flete/1",
        "margen_ganancia/1",
    ]

    def setUp(self):
        self.prolog = Prolog()
        self.prolog.consult(_rules_path())
        self._reset_facts()

    def _announce(self, rule_id: str, message: str):
        # Print progress info for screenshots while tests run.
        # Use flush=True to avoid buffering inside containers.
        # Can be disabled by setting RULE_TEST_ANNOUNCE=0 (useful when a custom
        # test runner prints its own per-test status lines).
        if os.environ.get("RULE_TEST_ANNOUNCE", "1") == "0":
            return
        print(f"\n[{rule_id}] {message}", flush=True)

    def tearDown(self):
        self._reset_facts()

    def _reset_facts(self):
        for pred in self.DYNAMIC_PREDICATES:
            name, arity_str = pred.split("/")
            arity = int(arity_str)
            vars_ = ",".join(["_"] * arity)
            list(self.prolog.query(f"retractall({name}({vars_}))"))

    def assertRecomendarContains(self, expected: str):
        values = _collect_atoms(self.prolog.query("recomendar(X)"), "X")
        self.assertIn(expected, values)

    def assertParcialContains(self, expected: str):
        values = _collect_atoms(self.prolog.query("parcial(X)"), "X")
        self.assertIn(expected, values)

    def assertPrioridadContains(self, expected: str):
        values = _collect_atoms(self.prolog.query("prioridad(X)"), "X")
        self.assertIn(expected, values)

    def assertRecomendarNotContains(self, forbidden: str):
        values = _collect_atoms(self.prolog.query("recomendar(X)"), "X")
        self.assertNotIn(forbidden, values)

    def test_R01_producir_sustrato(self):
        self._announce("R01", "Corteza + demanda sustrato alta => recomendar(producir_sustrato)")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("demanda_sustrato(alta)")
        self.assertRecomendarContains("producir_sustrato")

    def test_R02_producir_compostaje(self):
        self._announce("R02", "Corteza + sin contaminación (y NO R01) => producir_compostaje")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("demanda_sustrato(baja)")
        self.prolog.assertz("contaminacion(ninguna)")
        self.assertRecomendarContains("producir_compostaje")

    def test_R03_compostaje_o_sustrato_acidofilo(self):
        self._announce("R03", "Corteza + NO R01 + NO R02 + pino + demanda compost alta => compostaje_o_sustrato_acidofilo")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("demanda_sustrato(baja)")
        self.prolog.assertz("contaminacion(si)")
        self.prolog.assertz("especie(pino)")
        self.prolog.assertz("demanda_compost(alta)")
        self.assertRecomendarContains("compostaje_o_sustrato_acidofilo")

    def test_R04_almacenar_temporalmente(self):
        self._announce("R04", "Corteza + NO R01/R02/R03 + demanda compost baja + espacio limitado => almacenar_temporalmente")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("demanda_sustrato(baja)")
        self.prolog.assertz("contaminacion(si)")
        self.prolog.assertz("especie(eucalipto)")
        self.prolog.assertz("demanda_compost(baja)")
        self.prolog.assertz("espacio_compost(limitado)")
        self.assertRecomendarContains("almacenar_temporalmente")

    def test_R05_sustrato_jardineria(self):
        self._announce("R05", "Corteza + NO R01/R02/R03/R04 + demanda jardinería alta => sustrato_jardineria")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("demanda_sustrato(baja)")
        self.prolog.assertz("contaminacion(si)")
        self.prolog.assertz("especie(eucalipto)")
        self.prolog.assertz("demanda_compost(alta)")
        self.prolog.assertz("espacio_compost(disponible)")
        self.prolog.assertz("demanda_jardineria(alta)")
        self.assertRecomendarContains("sustrato_jardineria")

    def test_R06_descartar_aserrin_por_volumen_bajo(self):
        self._announce("R06", "Aserrín + volumen<5 => recomendar(descartar_aserrin)")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(4.9)")
        self.assertRecomendarContains("descartar_aserrin")

    def test_R07_parcial_apto_pelletizacion_requiere_pelletizadora_y_humedad_menor_9(self):
        self._announce("R07", "Aserrín + vol>=5 + pelletizadora + humedad<9 => parcial(apto_pelletizacion)")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(5)")
        self.prolog.assertz("maq_pelletizadora(si)")
        self.prolog.assertz("humedad(8.9)")
        self.assertParcialContains("apto_pelletizacion")

    def test_R07_no_apto_pelletizacion_si_humedad_igual_9(self):
        self._announce("R07", "Aserrín + pelletizadora + humedad=9 => NO parcial(apto_pelletizacion)")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(10)")
        self.prolog.assertz("maq_pelletizadora(si)")
        self.prolog.assertz("humedad(9)")
        values = _collect_atoms(self.prolog.query("parcial(X)"), "X")
        self.assertNotIn("apto_pelletizacion", values)

    def test_R10_forzar_venta_inmediata_si_almacenamiento_mayor_90(self):
        self._announce("R10", "Apto pelletización + capacidad>90% => forzar_venta_inmediata")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(10)")
        self.prolog.assertz("maq_pelletizadora(si)")
        self.prolog.assertz("humedad(8)")
        self.prolog.assertz("capacidad_almacenamiento(95)")
        self.assertRecomendarContains("forzar_venta_inmediata")

    def test_R10_almacenar_pellet_si_capacidad_menor_igual_90(self):
        self._announce("R10", "Apto pelletización + capacidad<=90% => almacenar_pellet")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(10)")
        self.prolog.assertz("maq_pelletizadora(si)")
        self.prolog.assertz("humedad(8)")
        self.prolog.assertz("capacidad_almacenamiento(80)")
        self.assertRecomendarContains("almacenar_pellet")

    def test_sin_pelletizadora_demanda_alta_vender_aserrin(self):
        self._announce("Aserrín", "Sin pelletizadora + demanda pellets alta => vender_aserrin")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(10)")
        self.prolog.assertz("maq_pelletizadora(no)")
        self.prolog.assertz("demanda_pellets(alta)")
        self.assertRecomendarContains("vender_aserrin")

    def test_sin_pelletizadora_demanda_baja_descartar_aserrin(self):
        self._announce("Aserrín", "Sin pelletizadora + demanda pellets baja => descartar_aserrin")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(10)")
        self.prolog.assertz("maq_pelletizadora(no)")
        self.prolog.assertz("demanda_pellets(baja)")
        self.assertRecomendarContains("descartar_aserrin")

    # Nota: se elimina la regla de riesgo financiero anterior (precio/volatilidad) porque el flujo final solicitado
    # prioriza disponibilidad de pelletizadora/capacidad y luego demanda si no hay máquina.

    def test_R11_recomendar_apto_venta_tableros(self):
        self._announce("R11", "Retazos + volumen>=50 => recomendar(apto_venta_tableros)")
        self.prolog.assertz("tipo(retazos)")
        self.prolog.assertz("volumen(60)")
        self.assertRecomendarContains("apto_venta_tableros")

    def test_R12_parcial_candidato_finger_joint(self):
        self._announce("R12", "Retazos + largo>60 => parcial(candidato_finger_joint)")
        self.prolog.assertz("tipo(retazos)")
        self.prolog.assertz("largo(70)")
        self.assertParcialContains("candidato_finger_joint")

    def test_R13_parcial_producir_chips(self):
        self._announce("R13", "Chips + volumen>=10 => parcial(chips_volumen_suficiente)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(10)")
        self.assertParcialContains("chips_volumen_suficiente")

    def test_R13B_descartar_chips(self):
        self._announce("R13B", "Chips + volumen<10 => recomendar(descartar_chips)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(5)")
        self.assertRecomendarContains("descartar_chips")

    def test_R14_parcial_apto_solo_chips_por_falla_grave(self):
        self._announce("R14", "Madera fallas + grieta_profunda/pudricion => parcial(apto_solo_chips)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(grieta_profunda)")
        self.assertParcialContains("apto_solo_chips")

    def test_R14C_recomendar_producir_chips_si_chipeadora_disponible(self):
        self._announce("R14C", "Apto solo chips + maq_chipeadora=si => recomendar(producir_chips)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(pudricion_parcial)")
        self.prolog.assertz("maq_chipeadora(si)")
        self.assertRecomendarContains("producir_chips")

    def test_R14C_no_recomendar_producir_chips_si_no_hay_chipeadora(self):
        self._announce("R14C", "Apto solo chips + maq_chipeadora=no => NO recomendar(producir_chips)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(pudricion_parcial)")
        self.prolog.assertz("maq_chipeadora(no)")
        self.assertRecomendarNotContains("producir_chips")

    def test_R14D_recomendar_descartar_material_si_no_hay_chipeadora(self):
        self._announce("R14D", "Grieta/pudrición parcial + sin chipeadora + stock suficiente => descartar_material")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(pudricion_parcial)")
        self.prolog.assertz("maq_chipeadora(no)")
        self.prolog.assertz("stock_biomasa(suficiente)")
        self.assertRecomendarContains("descartar_material")

    def test_R14D_prioridad_suministrar_caldera_si_stock_critico_y_sin_chipeadora(self):
        self._announce("R14D", "Falla grave + sin chipeadora + stock crítico(bajo) => prioridad(suministrar_caldera)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(grieta_profunda)")
        self.prolog.assertz("maq_chipeadora(no)")
        self.prolog.assertz("stock_biomasa(bajo)")
        self.assertPrioridadContains("suministrar_caldera")

    def test_R15_prioridad_asegurar_venta_contrato(self):
        self._announce("R15", "Chips + stock suficiente + precio medio/alto + volatilidad baja => prioridad(asegurar_venta_contrato)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("stock_biomasa(suficiente)")
        self.prolog.assertz("precio_chips(medio)")
        self.prolog.assertz("volatilidad_chips(baja)")
        self.assertPrioridadContains("asegurar_venta_contrato")

    def test_R16_parcial_chip_pulpable(self):
        self._announce("R16", "Chips + stock suficiente + sin corteza + especie pino/eucalipto => recomendar(vender_chip_pulpable)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("stock_biomasa(suficiente)")
        self.prolog.assertz("corteza(no)")
        self.prolog.assertz("especie(pino)")
        self.assertRecomendarContains("vender_chip_pulpable")

    def test_R17_parcial_chip_no_pulpable(self):
        self._announce("R17", "Chips + con corteza => parcial(chip_no_pulpable)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("corteza(si)")
        self.assertParcialContains("chip_no_pulpable")

    def test_R19_prioridad_suministrar_chip_caldera(self):
        self._announce("R19", "Chips + volumen>=10 + stock bajo => prioridad(suministrar_chip_caldera)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("stock_biomasa(bajo)")
        self.assertPrioridadContains("suministrar_chip_caldera")

    def test_R19_no_prioridad_caldera_si_stock_suficiente(self):
        self._announce("R19", "Chips + volumen>=10 + stock suficiente => NO prioridad(suministrar_chip_caldera)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("stock_biomasa(suficiente)")
        values = _collect_atoms(self.prolog.query("prioridad(X)"), "X")
        self.assertNotIn("suministrar_chip_caldera", values)

    def test_R19B_recomendar_vender_chips_si_stock_suficiente(self):
        self._announce("R19B", "Chips + volumen>=10 + stock suficiente => recomendar(vender_chips)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("stock_biomasa(suficiente)")
        self.assertRecomendarContains("vender_chips")

    def test_R21_parcial_apto_finger_joint(self):
        self._announce("R21", "Retazos + dims ok + humedad<18 + especie ok => parcial(apto_finger_joint)")
        self.prolog.assertz("tipo(retazos)")
        self.prolog.assertz("largo(55)")
        self.prolog.assertz("ancho(6)")
        self.prolog.assertz("humedad(12)")
        self.prolog.assertz("especie(eucalipto)")
        self.assertParcialContains("apto_finger_joint")

    def test_R20_producir_finger_joint(self):
        self._announce("R20", "Apto finger joint + economía viable + maq_finger=si => recomendar(producir_finger_joint)")
        # Disparar parcial apto_finger_joint + condición económica + maq disponible
        self.prolog.assertz("tipo(retazos)")
        self.prolog.assertz("largo(55)")
        self.prolog.assertz("ancho(6)")
        self.prolog.assertz("humedad(12)")
        self.prolog.assertz("especie(pino)")
        self.prolog.assertz("precio_finger(200)")
        self.prolog.assertz("precio_chips_num(50)")
        self.prolog.assertz("maq_finger(si)")
        self.assertRecomendarContains("producir_finger_joint")

    def test_R22_parcial_apto_segunda_calidad(self):
        self._announce("R22", "Madera fallas + curvatura/nudo + reprocesadora=si => parcial(apto_segunda_calidad)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(nudo_estetico)")
        self.prolog.assertz("maq_reprocesadora(si)")
        self.assertParcialContains("apto_segunda_calidad")

    def test_R24_vender_en_planta_descartar(self):
        self._announce("R24", "Costo flete >= margen ganancia => recomendar(vender_en_planta_descartar)")
        self.prolog.assertz("costo_flete(25)")
        self.prolog.assertz("margen_ganancia(20)")
        self.assertRecomendarContains("vender_en_planta_descartar")


if __name__ == "__main__":
    unittest.main()

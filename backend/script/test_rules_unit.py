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
        self.prolog.assertz("especie(eucalipto)")
        self.prolog.assertz("demanda_compost(baja)")
        self.assertRecomendarContains("producir_sustrato")

    def test_R01_no_activa_si_pino_y_demanda_compost_alta(self):
        self._announce("R01", "No recomendar producir_sustrato si especie=pino y demanda_compost=alta")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("demanda_sustrato(alta)")
        self.prolog.assertz("especie(pino)")
        self.prolog.assertz("demanda_compost(alta)")
        self.assertRecomendarNotContains("producir_sustrato")

    def test_R02_producir_compostaje(self):
        self._announce("R02", "Corteza + compost verdadero + sin contaminación + demanda alta => producir_compostaje")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("mercado_compost(verdadero)")
        self.prolog.assertz("contaminacion(ninguna)")
        self.prolog.assertz("demanda_compost(alta)")
        self.assertRecomendarContains("producir_compostaje")

    def test_R03_compostaje_o_sustrato_acidofilo(self):
        self._announce("R03", "Corteza + pino + demanda compost alta => compostaje_o_sustrato_acidofilo")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("especie(pino)")
        self.prolog.assertz("demanda_compost(alta)")
        self.assertRecomendarContains("compostaje_o_sustrato_acidofilo")

    def test_R04_almacenar_temporalmente(self):
        self._announce("R04", "Corteza + demanda compost baja + espacio limitado => almacenar_temporalmente")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("demanda_compost(baja)")
        self.prolog.assertz("espacio_compost(limitado)")
        self.assertRecomendarContains("almacenar_temporalmente")

    def test_R05_sustrato_jardineria(self):
        self._announce("R05", "Corteza + demanda jardinería alta => sustrato_jardineria")
        self.prolog.assertz("tipo(corteza)")
        self.prolog.assertz("demanda_jardineria(alta)")
        self.assertRecomendarContains("sustrato_jardineria")

    def test_R06_parcial_apto_pelletizacion_por_volumen_y_demanda(self):
        self._announce("R06", "Aserrín + volumen>=200 + demanda pellets alta => parcial(apto_pelletizacion)")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(250)")
        self.prolog.assertz("demanda_pellets(alta)")
        self.assertParcialContains("apto_pelletizacion")

    def test_R07_parcial_apto_pelletizacion_por_humedad(self):
        self._announce("R07", "Aserrín + humedad<=10 => parcial(apto_pelletizacion)")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("humedad(9)")
        self.assertParcialContains("apto_pelletizacion")

    def test_R08_vender_aserrin_por_baja_demanda(self):
        self._announce("R08", "Aserrín + volumen>=200 + demanda pellets baja => recomendar(vender_aserrin)")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("volumen(200)")
        self.prolog.assertz("demanda_pellets(baja)")
        self.assertRecomendarContains("vender_aserrin")

    def test_R09_vender_aserrin_por_riesgo_financiero(self):
        self._announce("R09", "Aserrín + precio_pellet=alto + volatilidad=alta => recomendar(vender_aserrin)")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("precio_pellet(alto)")
        self.prolog.assertz("volatilidad_pellet(alta)")
        self.assertRecomendarContains("vender_aserrin")

    def test_R10_forzar_venta_inmediata_por_baja_capacidad(self):
        self._announce("R10", "Parcial apto_pelletizacion + capacidad<10 => forzar_venta_inmediata")
        self.prolog.assertz("tipo(aserrin)")
        self.prolog.assertz("humedad(9)")  # activa parcial(apto_pelletizacion)
        self.prolog.assertz("capacidad_almacenamiento(5)")
        self.assertRecomendarContains("forzar_venta_inmediata")

    def test_R11_parcial_apto_venta_tableros(self):
        self._announce("R11", "Retazos + volumen>=50 y NO finger-joint => parcial(apto_venta_tableros)")
        self.prolog.assertz("tipo(retazos)")
        self.prolog.assertz("volumen(60)")
        self.prolog.assertz("largo(40)")  # falla condición de finger joint
        self.prolog.assertz("ancho(6)")
        self.prolog.assertz("humedad(12)")
        self.prolog.assertz("especie(pino)")
        self.assertParcialContains("apto_venta_tableros")

    def test_R12_prioridad_finger_joint_o_moldura(self):
        self._announce("R12", "Retazos/despuntes + largo>60 + economía viable => prioridad(finger_joint_o_moldura)")
        self.prolog.assertz("tipo(retazos)")
        self.prolog.assertz("largo(70)")
        self.prolog.assertz("precio_finger(200)")
        self.prolog.assertz("precio_chips_num(50)")
        self.assertPrioridadContains("finger_joint_o_moldura")

    def test_R13_parcial_producir_chips(self):
        self._announce("R13", "Chips + volumen>=100 => parcial(producir_chips)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(150)")
        self.assertParcialContains("producir_chips")

    def test_R13B_no_procesar_chips(self):
        self._announce("R13B", "Chips + volumen<100 => recomendar(no_procesar_chips)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(50)")
        self.assertRecomendarContains("no_procesar_chips")

    def test_R14_parcial_apto_solo_chips_por_falla_grave(self):
        self._announce("R14", "Madera fallas + grieta_profunda/pudricion => parcial(apto_solo_chips)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(grieta_profunda)")
        self.assertParcialContains("apto_solo_chips")

    def test_R14C_recomendar_chipear_material_si_chipeadora_disponible(self):
        self._announce("R14C", "Apto solo chips + maq_chipeadora=si => recomendar(chipear_material)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(pudricion_parcial)")
        self.prolog.assertz("maq_chipeadora(si)")
        self.assertRecomendarContains("chipear_material")

    def test_R14C_no_recomendar_chipear_material_si_no_hay_chipeadora(self):
        self._announce("R14C", "Apto solo chips + maq_chipeadora=no => NO recomendar(chipear_material)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(pudricion_parcial)")
        self.prolog.assertz("maq_chipeadora(no)")
        self.assertRecomendarNotContains("chipear_material")

    def test_R14D_recomendar_descartar_material_si_no_hay_chipeadora(self):
        self._announce("R14D", "Apto solo chips + maq_chipeadora=no => recomendar(descartar_material)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(pudricion_parcial)")
        self.prolog.assertz("maq_chipeadora(no)")
        self.assertRecomendarContains("descartar_material")

    def test_R15_prioridad_asegurar_venta_contrato(self):
        self._announce("R15", "Producir chips + precio medio/alto + volatilidad baja => prioridad(asegurar_venta_contrato)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("precio_chips(medio)")
        self.prolog.assertz("volatilidad_chips(baja)")
        self.assertPrioridadContains("asegurar_venta_contrato")

    def test_R16_parcial_chip_pulpable(self):
        self._announce("R16", "Chips + sin corteza + especie pino/eucalipto => parcial(chip_pulpable)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("corteza(no)")
        self.prolog.assertz("especie(pino)")
        self.assertParcialContains("chip_pulpable")

    def test_R17_parcial_chip_no_pulpable(self):
        self._announce("R17", "Chips + con corteza => parcial(chip_no_pulpable)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("corteza(si)")
        self.assertParcialContains("chip_no_pulpable")

    def test_R18_suministro_caldera(self):
        self._announce("R18", "Chip no pulpable + demanda biomasa alta + stock bajo => suministro_caldera")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("corteza(si)")
        self.prolog.assertz("demanda_biomasa(alta)")
        self.prolog.assertz("stock_biomasa(bajo)")
        self.assertRecomendarContains("suministro_caldera")

    def test_R18B_no_suministrar_caldera(self):
        self._announce("R18B", "Chip no pulpable + stock suficiente => no_suministrar_caldera")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("corteza(si)")
        self.prolog.assertz("stock_biomasa(suficiente)")
        self.assertRecomendarContains("no_suministrar_caldera")

    def test_R19_prioridad_suministrar_chip_caldera(self):
        self._announce("R19", "Chip no pulpable + caldera encendida + stock bajo => prioridad(suministrar_chip_caldera)")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("corteza(si)")
        self.prolog.assertz("caldera(encendida)")
        self.prolog.assertz("stock_biomasa(bajo)")
        self.assertPrioridadContains("suministrar_chip_caldera")

    def test_R19B_vender_chip_pulpable(self):
        self._announce("R19B", "Chip pulpable + stock suficiente => vender_chip_pulpable")
        self.prolog.assertz("tipo(chips)")
        self.prolog.assertz("volumen(120)")
        self.prolog.assertz("corteza(no)")
        self.prolog.assertz("especie(pino)")
        self.prolog.assertz("stock_biomasa(suficiente)")
        self.assertRecomendarContains("vender_chip_pulpable")

    def test_R21_parcial_apto_finger_joint(self):
        self._announce("R21", "Retazos/despuntes + dims ok + humedad<18 + especie ok => parcial(apto_finger_joint)")
        self.prolog.assertz("tipo(despuntes)")
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

    def test_R23_prioridad_rectificar_reprocesar(self):
        self._announce("R23", "Madera fallas + curvatura_leve => prioridad(rectificar_reprocesar)")
        self.prolog.assertz("tipo(madera_fallas)")
        self.prolog.assertz("falla(curvatura_leve)")
        self.assertPrioridadContains("rectificar_reprocesar")

    def test_R24_vender_en_planta_descartar(self):
        self._announce("R24", "Costo flete >= margen ganancia => recomendar(vender_en_planta_descartar)")
        self.prolog.assertz("costo_flete(25)")
        self.prolog.assertz("margen_ganancia(20)")
        self.assertRecomendarContains("vender_en_planta_descartar")


if __name__ == "__main__":
    unittest.main()

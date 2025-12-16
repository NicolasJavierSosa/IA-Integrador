from django.urls import reverse
from rest_framework.test import APITestCase

from apps.maquinaria.models import Maquinaria, TipoMaquinaria
from .models import AnalisisSubproducto


class SubproductosAnalyzeIntegrationTests(APITestCase):
	def _post_analyze(self, payload: dict):
		url = reverse("subproducto-analyze")
		return self.client.post(url, payload, format="json")

	def _values(self, response_json: dict) -> set[str]:
		return {r.get("value") for r in response_json.get("recommendations", [])}

	def _types_and_values(self, response_json: dict) -> set[tuple[str, str]]:
		return {(r.get("type"), r.get("value")) for r in response_json.get("recommendations", [])}

	def test_integration_payload_roundtrip_and_history_saved(self):
		payload = {
			"lot": {
				"category": "Chips",
				"species": "Pino",
				"volume": 50,
				"humidity": 20,
				"chemicalContamination": False,
				"dimensions": {"length": "", "width": ""},
				"defectType": "Curvatura Leve",
				"hasBark": True,
			},
			"market": {
				"demandaPellets": False,
				"precioPellets": "Medio",
				"volatilidadPellets": False,
				"precioChips": "Medio",
				"volatilidadChips": False,
				"demandaBiomasa": True,
				"estadoCaldera": True,
				"stockBiomasa": True,
				"costoFlete": 5,
				"precioFinger": 200,
				"capacidadAlmacenamiento": 50,
				"demandaCompost": False,
				"espacioCompost": False,
				"demandaSustrato": False,
			},
		}

		resp = self._post_analyze(payload)
		self.assertEqual(resp.status_code, 200)
		body = resp.json()
		self.assertTrue(body.get("success"))

		# 1) No pérdida de datos: el backend devuelve el payload recibido
		self.assertEqual(body.get("debug_facts"), payload)

		# 2) Motor de inferencia responde algo coherente
		self.assertIn("no_procesar_chips", self._values(body))

		# 3) Se guarda en historial
		self.assertEqual(AnalisisSubproducto.objects.count(), 1)
		item = AnalisisSubproducto.objects.first()
		self.assertEqual(item.categoria, "Chips")
		self.assertEqual(item.especie, "Pino")
		self.assertEqual(float(item.volumen), 50.0)
		self.assertEqual(item.datos_entrada, payload)
		self.assertIsInstance(item.resultados, list)
		self.assertGreater(len(item.resultados), 0)

	def test_integration_aserrin_partial_apto_pelletizacion(self):
		payload = {
			"lot": {
				"category": "Aserrín",
				"species": "Pino",
				"volume": 20,
				"humidity": 9,
				"chemicalContamination": False,
				"dimensions": {"length": "", "width": ""},
				"defectType": "Curvatura Leve",
				"hasBark": False,
			},
			"market": {
				"demandaPellets": True,
				"precioPellets": "Medio",
				"volatilidadPellets": False,
				"precioChips": "Bajo",
				"volatilidadChips": True,
				"demandaBiomasa": False,
				"estadoCaldera": False,
				"stockBiomasa": False,
				"costoFlete": 0,
				"precioFinger": 200,
				"capacidadAlmacenamiento": 50,
				"demandaCompost": False,
				"espacioCompost": False,
				"demandaSustrato": False,
			},
		}

		resp = self._post_analyze(payload)
		self.assertEqual(resp.status_code, 200)
		body = resp.json()
		self.assertTrue(body.get("success"))
		self.assertEqual(body.get("debug_facts"), payload)

		# Debe aparecer la viabilidad parcial de pelletización por humedad (R07)
		self.assertIn(("partial", "apto_pelletizacion"), self._types_and_values(body))

	def test_integration_madera_fallas_pudricion_parcial_roundtrip(self):
		payload = {
			"lot": {
				"category": "Madera con Fallas",
				"species": "Pino",
				"volume": 120,
				"humidity": 15,
				"chemicalContamination": False,
				"dimensions": {"length": "", "width": ""},
				"defectType": "Pudrición Parcial",
				"hasBark": False,
			},
			"market": {
				"demandaPellets": False,
				"precioPellets": "Medio",
				"volatilidadPellets": False,
				"precioChips": "Medio",
				"volatilidadChips": False,
				"demandaBiomasa": False,
				"estadoCaldera": False,
				"stockBiomasa": False,
				"costoFlete": 0,
				"precioFinger": 200,
				"capacidadAlmacenamiento": 50,
				"demandaCompost": False,
				"espacioCompost": False,
				"demandaSustrato": False,
			},
		}

		resp = self._post_analyze(payload)
		self.assertEqual(resp.status_code, 200)
		body = resp.json()
		self.assertTrue(body.get("success"))
		self.assertEqual(body.get("debug_facts"), payload)

		# Regla grave (R14) debe habilitar apto_solo_chips
		self.assertIn(("partial", "apto_solo_chips"), self._types_and_values(body))

	def test_integration_logistica_global_R24(self):
		payload = {
			"lot": {
				"category": "Corteza",
				"species": "Pino",
				"volume": 10,
				"humidity": 45,
				"chemicalContamination": False,
				"dimensions": {"length": "", "width": ""},
				"defectType": "Curvatura Leve",
				"hasBark": False,
			},
			"market": {
				"demandaPellets": False,
				"precioPellets": "Medio",
				"volatilidadPellets": False,
				"precioChips": "Bajo",
				"volatilidadChips": True,
				"demandaBiomasa": False,
				"estadoCaldera": False,
				"stockBiomasa": False,
				"costoFlete": 25,
				"precioFinger": 200,
				"capacidadAlmacenamiento": 50,
				"demandaCompost": False,
				"espacioCompost": False,
				"demandaSustrato": True,
			},
		}

		resp = self._post_analyze(payload)
		self.assertEqual(resp.status_code, 200)
		body = resp.json()
		self.assertTrue(body.get("success"))
		self.assertEqual(body.get("debug_facts"), payload)
		self.assertIn("vender_en_planta_descartar", self._values(body))

	def test_integration_finger_joint_depends_on_machine_type_availability(self):
		finger_type, _ = TipoMaquinaria.objects.get_or_create(
			codigo="finger_joint",
			defaults={"nombre": "Finger-Joint", "descripcion": ""},
		)
		m = Maquinaria.objects.create(nombre="Cualquier nombre", tipo_maquinaria=finger_type, disponible=True)

		payload = {
			"lot": {
				"category": "Retazos",
				"species": "Pino",
				"volume": 80,
				"humidity": 12,
				"chemicalContamination": False,
				"dimensions": {"length": 55, "width": 6},
				"defectType": "Curvatura Leve",
				"hasBark": False,
			},
			"market": {
				"demandaPellets": False,
				"precioPellets": "Medio",
				"volatilidadPellets": False,
				"precioChips": "Medio",
				"volatilidadChips": False,
				"demandaBiomasa": False,
				"estadoCaldera": False,
				"stockBiomasa": False,
				"costoFlete": 0,
				"precioFinger": 200,
				"capacidadAlmacenamiento": 50,
				"demandaCompost": False,
				"espacioCompost": False,
				"demandaSustrato": False,
			},
		}

		resp = self._post_analyze(payload)
		self.assertEqual(resp.status_code, 200)
		body = resp.json()
		self.assertTrue(body.get("success"))
		self.assertIn("producir_finger_joint", self._values(body))

		m.disponible = False
		m.save(update_fields=["disponible"])
		resp2 = self._post_analyze(payload)
		self.assertEqual(resp2.status_code, 200)
		body2 = resp2.json()
		self.assertTrue(body2.get("success"))
		self.assertNotIn("producir_finger_joint", self._values(body2))

	def test_integration_chipeadora_changes_output_by_type_not_name(self):
		chip_type, _ = TipoMaquinaria.objects.get_or_create(
			codigo="chipeadora",
			defaults={"nombre": "Chipeadora", "descripcion": ""},
		)
		m = Maquinaria.objects.create(nombre="Nombre cualquiera", tipo_maquinaria=chip_type, disponible=True)

		payload = {
			"lot": {
				"category": "Madera con Fallas",
				"species": "Pino",
				"volume": 120,
				"humidity": 15,
				"chemicalContamination": False,
				"dimensions": {"length": "", "width": ""},
				"defectType": "Pudrición Parcial",
				"hasBark": False,
			},
			"market": {
				"demandaPellets": False,
				"precioPellets": "Medio",
				"volatilidadPellets": False,
				"precioChips": "Medio",
				"volatilidadChips": False,
				"demandaBiomasa": False,
				"estadoCaldera": False,
				"stockBiomasa": False,
				"costoFlete": 0,
				"precioFinger": 200,
				"capacidadAlmacenamiento": 50,
				"demandaCompost": False,
				"espacioCompost": False,
				"demandaSustrato": False,
			},
		}

		resp = self._post_analyze(payload)
		self.assertEqual(resp.status_code, 200)
		body = resp.json()
		self.assertTrue(body.get("success"))
		# Con chipeadora disponible debe sugerir chipear material
		self.assertIn("chipear_material", self._values(body))

		m.disponible = False
		m.save(update_fields=["disponible"])
		resp2 = self._post_analyze(payload)
		self.assertEqual(resp2.status_code, 200)
		body2 = resp2.json()
		self.assertTrue(body2.get("success"))
		# Sin chipeadora disponible NO debe sugerir chipear material
		self.assertNotIn("chipear_material", self._values(body2))
		# Y debería sugerir descartar
		self.assertIn("descartar_material", self._values(body2))

	def test_integration_reprocesadora_changes_second_quality_recommendation(self):
		rep_type, _ = TipoMaquinaria.objects.get_or_create(
			codigo="reprocesadora",
			defaults={"nombre": "Reprocesadora", "descripcion": ""},
		)
		m = Maquinaria.objects.create(nombre="Cualquier nombre", tipo_maquinaria=rep_type, disponible=True)

		payload = {
			"lot": {
				"category": "Madera con Fallas",
				"species": "Pino",
				"volume": 120,
				"humidity": 15,
				"chemicalContamination": False,
				"dimensions": {"length": "", "width": ""},
				"defectType": "Nudo Estético",
				"hasBark": False,
			},
			"market": {
				"demandaPellets": False,
				"precioPellets": "Medio",
				"volatilidadPellets": False,
				"precioChips": "Medio",
				"volatilidadChips": False,
				"demandaBiomasa": False,
				"estadoCaldera": False,
				"stockBiomasa": False,
				"costoFlete": 0,
				"precioFinger": 200,
				"capacidadAlmacenamiento": 50,
				"demandaCompost": False,
				"espacioCompost": False,
				"demandaSustrato": False,
			},
		}

		resp = self._post_analyze(payload)
		self.assertEqual(resp.status_code, 200)
		body = resp.json()
		self.assertTrue(body.get("success"))
		self.assertIn("producir_segunda_calidad", self._values(body))

		m.disponible = False
		m.save(update_fields=["disponible"])
		resp2 = self._post_analyze(payload)
		self.assertEqual(resp2.status_code, 200)
		body2 = resp2.json()
		self.assertTrue(body2.get("success"))
		self.assertNotIn("producir_segunda_calidad", self._values(body2))
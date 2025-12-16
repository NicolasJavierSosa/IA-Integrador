import os
import subprocess
import json

from apps.maquinaria.models import Maquinaria

class PrologService:
    def analyze_data(self, data):
        """
        Executes the Prolog analysis in a separate process to prevent Segfaults.
        """
        try:
            def _norm(s: str) -> str:
                return (s or "").strip().lower().replace("-", "_").replace(" ", "_")

            def _canonical_type_code(codigo: str | None, nombre_tipo: str | None) -> str | None:
                # Primary: stable codigo
                code = _norm(codigo)
                if code:
                    return code

                # Fallback (still type-based, not machine-name-based): map known type names
                name = _norm(nombre_tipo)
                if not name:
                    return None
                if "chipe" in name:
                    return "chipeadora"
                if "reproces" in name:
                    return "reprocesadora"
                if "finger" in name:
                    return "finger_joint"
                if "caldera" in name:
                    return "caldera"
                if "pellet" in name or "pelet" in name:
                    return "pelletizadora"
                if "descorte" in name:
                    return "descortezadora"
                return None

            # Enrich engine input with machinery availability by *type*.
            # IMPORTANT: Never rely on Maquinaria.nombre; only TipoMaquinaria (codigo/nombre).
            available_type_codes: set[str] = set()
            for codigo, nombre_tipo in (
                Maquinaria.objects.filter(disponible=True)
                .values_list("tipo_maquinaria__codigo", "tipo_maquinaria__nombre")
                .distinct()
            ):
                canonical = _canonical_type_code(codigo, nombre_tipo)
                if canonical:
                    available_type_codes.add(canonical)

            engine_data = dict(data)
            engine_data["machines"] = {"available_types": sorted(available_type_codes)}

            # Path to the script
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            script_path = os.path.join(base_dir, 'script', 'run_analysis.py')
            
            # Run subprocess
            process = subprocess.run(
                ['python', script_path],
                input=json.dumps(engine_data),
                text=True,
                capture_output=True,
                check=False 
            )
            
            if process.returncode != 0:
                print(f"Subprocess Error: {process.stderr}")
                # Try to get error from stdout if available (e.g. JSON error)
                error_msg = process.stderr
                if process.stdout:
                     error_msg += f" | Output: {process.stdout}"
                raise Exception(f"Analysis script failed: {error_msg}")
                
            # Parse output
            return json.loads(process.stdout)
            
        except Exception as e:
            print(f"Error running Prolog analysis: {e}")
            raise e

prolog_service = PrologService()

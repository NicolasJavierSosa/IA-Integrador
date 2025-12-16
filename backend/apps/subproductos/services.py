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
            # Enrich engine input with machinery availability by *type* (stable code),
            # not by user-assigned machine name.
            available_type_codes = list(
                Maquinaria.objects.filter(
                    disponible=True,
                    tipo_maquinaria__codigo__isnull=False,
                )
                .values_list('tipo_maquinaria__codigo', flat=True)
                .distinct()
            )
            engine_data = dict(data)
            engine_data["machines"] = {"available_types": available_type_codes}

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

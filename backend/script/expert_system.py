from pyswip import Prolog
import os

class ExpertSystem:
    def __init__(self):
        self.prolog = Prolog()
        # Calculate absolute path to rules.pl
        current_dir = os.path.dirname(os.path.abspath(__file__))
        rules_path = os.path.join(current_dir, 'rules.pl')
        # Fix path for Prolog (forward slashes)
        rules_path = rules_path.replace('\\', '/')
        self.prolog.consult(rules_path)

    def consult(self, data):
        """
        Consults the Prolog knowledge base with user data.
        data: dict containing 'residuos', 'maquinaria', 'temporada' (optional)
        """
        recommendations = []
        
        # Clear previous dynamic facts if any (not using dynamic facts here, passing as args or assuming stateless for now)
        # Ideally, we should assert facts, run query, then retract facts.
        # For this implementation, we will check rules against the provided data.
        
        # Since the rules are defined as:
        # regla(ID, Condicion, Conclusion, FC).
        # And Condicion is a compound term.
        # We need to evaluate if the Condition is true based on input data.
        
        # Let's try a different approach: Assert facts based on input, then query 'regla'.
        
        # 1. Assert facts
        self._assert_facts(data)
        
        # 2. Query for recommendations
        # We look for optimal, partial, and priority recommendations
        
        # Query: regla(ID, Condicion, Conclusion, FC)
        # We need to check if Condicion is true.
        # In Prolog: regla(ID, Cond, Conc, FC), call(Cond).
        
        query = "regla(ID, Cond, Conc, FC), call(Cond)"
        
        try:
            results = list(self.prolog.query(query))
            
            for result in results:
                rec = {
                    'id': result['ID'],
                    'conclusion': str(result['Conc']), # Convert atom/term to string
                    'certainty': result['FC'],
                    # 'condition': str(result['Cond'])
                }
                recommendations.append(rec)
                
        except Exception as e:
            print(f"Error querying Prolog: {e}")
        finally:
            # 3. Retract facts to clean up for next request
            self._retract_facts(data)
            
        return recommendations

    def _assert_facts(self, data):
        # Assert residues
        # data['residuos'] list of dicts: {'tipo': 'Corteza', 'volumen': 100, ...}
        # But the rules expect specific predicates like:
        # tipo_subproducto('Corteza').
        # volumen_ton(200).
        # demanda_sustrato_local('Alta').
        
        # We need to map the input JSON to these predicates.
        # Let's assume the input data is a flat dictionary of facts for simplicity, 
        # or we iterate and assert.
        
        for key, value in data.items():
            if isinstance(value, str):
                self.prolog.assertz(f"{key}('{value}')")
            elif isinstance(value, (int, float)):
                self.prolog.assertz(f"{key}({value})")
            elif isinstance(value, list):
                # Handle lists if necessary, e.g. multiple residues?
                # The current rules seem to assume single context or we need to iterate.
                # For now, let's assume the input provides the context for one evaluation.
                pass

    def _retract_facts(self, data):
        for key, value in data.items():
            if isinstance(value, str):
                self.prolog.retractall(f"{key}('{value}')")
            elif isinstance(value, (int, float)):
                self.prolog.retractall(f"{key}({value})")


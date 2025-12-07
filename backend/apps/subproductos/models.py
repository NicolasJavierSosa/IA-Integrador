from django.db import models

class Temporada(models.Model):
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    def __str__(self):
        return f"Temporada {self.fecha_inicio} - {self.fecha_fin}"

class DemandaMercado(models.Model):
    nombre = models.CharField(max_length=100)
    subproducto = models.ForeignKey('Subproducto', on_delete=models.CASCADE)
    temporada = models.ForeignKey(Temporada, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Subproducto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

class AnalisisSubproducto(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    categoria = models.CharField(max_length=100)
    especie = models.CharField(max_length=100)
    volumen = models.FloatField(null=True, blank=True)
    recomendacion_principal = models.CharField(max_length=255)
    justificacion = models.TextField(blank=True)
    
    # Store complex data structures as JSON
    datos_entrada = models.JSONField(default=dict) # Stores lot and market data
    resultados = models.JSONField(default=list)    # Stores the full list of recommendations/rules

    def __str__(self):
        return f"Análisis {self.categoria} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['-fecha']
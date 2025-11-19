from django.db import models

class TipoResiduo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

class Especie(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

class LotesResiduos(models.Model):
    tipo_residuo = models.ForeignKey(TipoResiduo, on_delete=models.CASCADE)
    peso_kg = models.DecimalField(max_digits=10, decimal_places=2)
    humedad = models.DecimalField(max_digits=5, decimal_places=2, help_text="Porcentaje de humedad")
    especie = models.ForeignKey(Especie, on_delete=models.CASCADE, default=1)  # Asumir ID 1 para pino
    contaminacion = models.TextField(blank=True)
    fecha_ingreso = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lote {self.id} - {self.tipo_residuo.nombre} - {self.peso_kg} kg"
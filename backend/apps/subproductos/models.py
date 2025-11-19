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
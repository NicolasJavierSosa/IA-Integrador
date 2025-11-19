from django.db import models

class TipoMaquinaria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

class Maquinaria(models.Model):
    nombre = models.CharField(max_length=100)
    tipo_maquinaria = models.ForeignKey(TipoMaquinaria, on_delete=models.CASCADE)
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
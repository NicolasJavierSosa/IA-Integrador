import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const HistorialPredicciones = () => {
  // Estado simulado para las predicciones (en el futuro vendrá del backend)
  const [predicciones, setPredicciones] = useState([
    { 
      id: 1, 
      fecha: '2023-10-01', 
      descripcion: 'Predicción de ventas para octubre', 
      toneladaRetazos: 100,
      toneladaMaderasDetalles: 200,
      toneladasAserrin: 50,
      toneladaCostaneros: 150
    },
    { 
      id: 2, 
      fecha: '2023-11-01', 
      descripcion: 'Predicción de ventas para noviembre', 
      toneladaRetazos: 120,
      toneladaMaderasDetalles: 220,
      toneladasAserrin: 60,
      toneladaCostaneros: 170
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver al Panel de Control
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Historial de Predicciones</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-4">Lista de todas las predicciones registradas.</p>
          <ul className="space-y-3">
            {predicciones.map((pred) => (
              <li
                key={pred.id}
                className="p-4 border border-gray-200 rounded bg-gray-50"
              >
                <div className="mb-2">
                  <strong className="text-gray-800">{pred.fecha}</strong>: {pred.descripcion}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div><span className="font-medium">Retazos:</span> {pred.toneladaRetazos} t</div>
                  <div><span className="font-medium">Maderas Detalles:</span> {pred.toneladaMaderasDetalles} t</div>
                  <div><span className="font-medium">Aserrín:</span> {pred.toneladasAserrin} t</div>
                  <div><span className="font-medium">Costaneros:</span> {pred.toneladaCostaneros} t</div>
                </div>
              </li>
            ))}
          </ul>
          {predicciones.length === 0 && <p>No hay predicciones registradas.</p>}
        </div>
      </div>
    </div>
  );
};

export default HistorialPredicciones;
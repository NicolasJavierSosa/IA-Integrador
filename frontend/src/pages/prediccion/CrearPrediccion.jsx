import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CrearPrediccion = () => {
  const [formData, setFormData] = useState({
    descripcion: '',
    toneladaRetazos: '',
    toneladaMaderasDetalles: '',
    toneladasAserrin: '',
    toneladaCostaneros: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarPrediccion = () => {
    // Validar que al menos algunos campos estén llenos
    if (formData.descripcion.trim() || formData.toneladaRetazos || formData.toneladaMaderasDetalles || formData.toneladasAserrin || formData.toneladaCostaneros) {
      // Aquí se guardaría en el backend o contexto
      console.log('Nueva predicción:', formData);
      setFormData({
        descripcion: '',
        toneladaRetazos: '',
        toneladaMaderasDetalles: '',
        toneladasAserrin: '',
        toneladaCostaneros: ''
      });
      alert('Predicción creada exitosamente');
    } else {
      alert('Por favor, ingresa al menos una descripción o cantidad.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver al Panel de Control
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Nueva Predicción de Ventas</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-4">Ingresa los datos para crear una nueva predicción de ventasde subproductos.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                name="descripcion"
                placeholder="Ej: Ventas Q4 2024"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tonelada de Retazos</label>
              <input
                type="number"
                name="toneladaRetazos"
                placeholder="0"
                value={formData.toneladaRetazos}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tonelada de Maderas con Detalles</label>
              <input
                type="number"
                name="toneladaMaderasDetalles"
                placeholder="0"
                value={formData.toneladaMaderasDetalles}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Toneladas de Aserrín</label>
              <input
                type="number"
                name="toneladasAserrin"
                placeholder="0"
                value={formData.toneladasAserrin}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tonelada de Costaneros</label>
              <input
                type="number"
                name="toneladaCostaneros"
                placeholder="0"
                value={formData.toneladaCostaneros}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
          </div>
          <button
            onClick={agregarPrediccion}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Crear Predicción
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearPrediccion;
import React, { useState } from 'react';
import { ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// Estructura de datos y lógica del negocio
const initialPredicciones = [
  { id: 1, fecha: '2023-10-01', descripcion: 'Predicción de ventas para octubre', valor: 500 },
  { id: 2, fecha: '2023-11-01', descripcion: 'Predicción de ventas para noviembre', valor: 600 },
];

const Home = () => {
  const [predicciones, setPredicciones] = useState(initialPredicciones);
  const [nuevaPrediccion, setNuevaPrediccion] = useState('');
  const [vistaActual, setVistaActual] = useState('prediccion'); // 'prediccion' o 'historial'

  // Definición de las secciones para el sidebar
  const secciones = {
    prediccion: {
      titulo: 'Crear Predicción de Ventas',
      icono: <ChartBarIcon className="h-6 w-6" />,
    },
    historial: {
      titulo: 'Historial de Predicciones',
      icono: <DocumentTextIcon className="h-6 w-6" />,
    },
  };

  const agregarPrediccion = () => {
    if (nuevaPrediccion.trim()) {
      const nueva = {
        id: predicciones.length + 1,
        fecha: new Date().toISOString().split('T')[0],
        descripcion: nuevaPrediccion,
        valor: Math.floor(Math.random() * 1000) + 100, // Simulado
      };
      // Agregamos al principio para que se vea inmediatamente
      setPredicciones([nueva, ...predicciones]); 
      setNuevaPrediccion('');
    }
  };

  // --- 1. Vista de Creación de Predicción (Tailwind UI Look) ---
  const RenderPrediccion = () => (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Crear Nueva Predicción
      </h2>
      <p className="text-gray-600 mb-6">
        Define la descripción de la próxima predicción de ventas de madera.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Input */}
        <input
          type="text"
          placeholder="Descripción, ej: Ventas Q4 2024"
          value={nuevaPrediccion}
          onChange={(e) => setNuevaPrediccion(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
        />
        {/* Botón */}
        <button
          onClick={agregarPrediccion}
          className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Crear Predicción
        </button>
      </div>
    </div>
  );

  // --- 2. Vista de Historial de Predicciones (Lista de datos) ---
  const RenderHistorial = () => (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Historial de Predicciones
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Revisa las predicciones pasadas y su valor estimado en m³.
        </p>
      </div>

      <ul className="divide-y divide-gray-200">
        {predicciones.length > 0 ? (
          predicciones.map((pred) => (
            <li key={pred.id} className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {pred.descripcion}
                  </p>
                  <p className="mt-1 flex items-center text-sm text-gray-500">
                    Fecha: {pred.fecha}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                    {pred.valor} m³
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="p-4 text-gray-500">No hay predicciones registradas.</p>
        )}
      </ul>
    </div>
  );

  // Renderizado condicional del contenido
  const renderContenido = () => {
    switch (vistaActual) {
      case 'prediccion':
        return <RenderPrediccion />;
      case 'historial':
        return <RenderHistorial />;
      default:
        return <div className="text-center p-10 text-gray-500">Selecciona una opción del menú lateral para comenzar.</div>;
    }
  };

  // --- Layout Principal (Sidebar + Contenido) con clases de Tailwind ---
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-white">🌳 Aserradero App</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {Object.keys(secciones).map((key) => {
                const item = secciones[key];
                const isActive = vistaActual === key;
                
                const baseClasses = "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition duration-150 ease-in-out";
                const activeClasses = "bg-gray-900 text-white";

                return (
                  <a
                    key={key}
                    onClick={() => setVistaActual(key)}
                    className={`${baseClasses} ${isActive ? activeClasses : ''}`}
                  >
                    {/* Ícono */}
                    <span className="mr-3 flex-shrink-0 h-6 w-6 text-gray-300 group-hover:text-gray-300">
                        {item.icono}
                    </span>
                    {item.titulo}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {/* Encabezado del contenido */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
              {secciones[vistaActual].titulo}
            </h1>
          </div>
          
          {/* Área del Contenido */}
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {renderContenido()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

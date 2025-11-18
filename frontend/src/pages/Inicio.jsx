import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Inicio = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">🌳 Sistema del Aserradero</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Panel de Control</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card para Crear Predicción */}
            <Link
              to="/crear-prediccion"
              className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Crear Predicción de Ventas</h3>
                    <p className="text-gray-500">Genera una nueva predicción basada en datos históricos.</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card para Historial de Predicciones */}
            <Link
              to="/historial"
              className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Historial de Predicciones</h3>
                    <p className="text-gray-500">Revisa todas las predicciones realizadas anteriormente.</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inicio;

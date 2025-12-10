import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import {
    ClockIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    DocumentTextIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const Historial = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/historial/');
            if (!response.ok) throw new Error('Error al cargar historial');
            const data = await response.json();
            setHistoryData(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredData = historyData.filter(item =>
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recomendacion_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.especie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Historial de Consultas</h2>
                    <p className="text-slate-400">Registro de todas las recomendaciones generadas por el sistema.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchHistory}
                        className="p-2 bg-navy-700 hover:bg-navy-600 text-slate-300 rounded-lg transition-colors"
                        title="Actualizar"
                    >
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List / Table Section */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Search Bar */}
                    <div className="bg-navy-800 p-4 rounded-xl border border-navy-700 flex gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar por categoría, especie o recomendación..."
                                className="w-full bg-navy-900 text-white pl-10 pr-4 py-2 rounded-lg border border-navy-600 focus:border-accent-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-navy-700 hover:bg-navy-600 text-slate-300 rounded-lg transition-colors">
                            <FunnelIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Filtros</span>
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-navy-900/50 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Fecha</th>
                                        <th className="p-4 font-semibold">Material</th>
                                        <th className="p-4 font-semibold">Volumen</th>
                                        <th className="p-4 font-semibold">Recomendación</th>
                                        <th className="p-4 font-semibold text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500">
                                                Cargando historial...
                                            </td>
                                        </tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500">
                                                No se encontraron registros.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className={`hover:bg-navy-700/50 transition-colors cursor-pointer ${selectedItem?.id === item.id ? 'bg-navy-700/80' : ''}`}
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                <td className="p-4 text-slate-300 text-sm whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4 text-slate-500" />
                                                        {formatDate(item.fecha)}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-white">{item.categoria}</div>
                                                    <div className="text-xs text-slate-500">{item.especie}</div>
                                                </td>
                                                <td className="p-4 text-slate-300 text-sm">
                                                    {item.volumen} Ton
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                                                        {item.recomendacion_principal}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button className="text-accent-400 hover:text-accent-300">
                                                        <ChevronRightIcon className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Detail View (Side Panel) */}
                <div className="lg:col-span-1">
                    {selectedItem ? (
                        <Card title="Detalle del Análisis" className="sticky top-6 animate-fadeIn">
                            <div className="space-y-6">
                                <div className="pb-4 border-b border-navy-700">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Recomendación Principal</p>
                                    <h3 className="text-lg font-bold text-white leading-tight">
                                        {selectedItem.recomendacion_principal}
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Datos de Entrada</p>
                                        <div className="bg-navy-900 rounded-lg p-3 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Categoría:</span>
                                                <span className="font-medium text-slate-200">{selectedItem.categoria}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Especie:</span>
                                                <span className="font-medium text-slate-200">{selectedItem.especie}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Humedad:</span>
                                                <span className="font-medium text-slate-200">{selectedItem.datos_entrada?.lot?.humidity}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Volumen:</span>
                                                <span className="font-medium text-slate-200">{selectedItem.volumen} Ton</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Reglas Activadas</p>
                                        <div className="space-y-2">
                                            {selectedItem.resultados?.map((res, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-sm p-2 bg-navy-900 border border-navy-700 rounded">
                                                    <DocumentTextIcon className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-slate-300 leading-tight">
                                                        {res.value?.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="h-64 rounded-xl border-2 border-dashed border-navy-700 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                            <DocumentTextIcon className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-sm">Selecciona un registro de la tabla para ver el detalle completo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Historial;

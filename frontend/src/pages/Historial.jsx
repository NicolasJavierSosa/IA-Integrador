import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const Historial = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const historyData = [
        {
            id: 'TRX-2024-089',
            date: '2024-03-15 14:30',
            operator: 'Juan Pérez',
            material: 'Corteza - Pino',
            volume: '250 Ton',
            result: 'PRODUCIR PELLETS',
            status: 'Completado',
            details: {
                humidity: '12%',
                contamination: 'No',
                marketPrice: 'Alto',
                rules: ['R06: Volumen > 200', 'R07: Humedad < 15%']
            }
        },
        {
            id: 'TRX-2024-088',
            date: '2024-03-15 11:15',
            operator: 'Maria Garcia',
            material: 'Aserrín - Eucalipto',
            volume: '120 Ton',
            result: 'VENTA DIRECTA',
            status: 'Completado',
            details: {
                humidity: '45%',
                contamination: 'No',
                marketPrice: 'Medio',
                rules: ['R02: Volumen < 150', 'R04: Demanda Alta']
            }
        },
        {
            id: 'TRX-2024-087',
            date: '2024-03-14 16:45',
            operator: 'Carlos Ruiz',
            material: 'Chips - Mixto',
            volume: '500 Ton',
            result: 'SUMINISTRAR CALDERA',
            status: 'Alerta',
            details: {
                humidity: '60%',
                contamination: 'Sí',
                marketPrice: 'Bajo',
                rules: ['R01: Contaminación Detectada']
            }
        },
        {
            id: 'TRX-2024-086',
            date: '2024-03-14 09:20',
            operator: 'Juan Pérez',
            material: 'Despuntes - Pino',
            volume: '80 Ton',
            result: 'CHIPEADO',
            status: 'Completado',
            details: {
                humidity: '18%',
                contamination: 'No',
                marketPrice: 'Alto',
                rules: ['R08: Dimensiones Irregulares']
            }
        },
        {
            id: 'TRX-2024-085',
            date: '2024-03-13 15:10',
            operator: 'Ana López',
            material: 'Corteza - Pino',
            volume: '300 Ton',
            result: 'PRODUCIR PELLETS',
            status: 'Completado',
            details: {
                humidity: '14%',
                contamination: 'No',
                marketPrice: 'Alto',
                rules: ['R06: Volumen > 200', 'R07: Humedad < 15%']
            }
        }
    ];

    const filteredData = historyData.filter(item =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.operator.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Historial de Consultas</h2>
                    <p className="text-slate-400">Registro completo de análisis realizados por el Sistema Experto.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={ArrowDownTrayIcon}>Exportar</Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 p-1">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, Material o Operador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                        />
                    </div>
                    <Button variant="ghost" icon={FunnelIcon}>Filtros Avanzados</Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">ID Transacción</th>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Operador</th>
                                <th className="p-4">Material</th>
                                <th className="p-4">Resultado</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-50">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-mono text-slate-600 font-medium">{item.id}</td>
                                    <td className="p-4 text-slate-600">{item.date}</td>
                                    <td className="p-4 text-slate-800 font-medium">{item.operator}</td>
                                    <td className="p-4 text-slate-600">{item.material}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-navy-50 text-navy-700 font-bold text-xs">
                                            {item.result}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge
                                            status={item.status}
                                            type="badge"
                                            color={item.status === 'Alerta' ? 'red' : 'green'}
                                        />
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="text-accent-600 hover:text-accent-700 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        No se encontraron resultados para su búsqueda.
                    </div>
                )}
            </Card>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                        <div className="bg-navy-800 p-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                Detalle de Transacción
                            </h3>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">ID Referencia</p>
                                    <p className="text-xl font-mono font-bold text-slate-800">{selectedItem.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Fecha</p>
                                    <p className="text-sm font-bold text-slate-700">{selectedItem.date}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Material</p>
                                    <p className="font-bold text-slate-800">{selectedItem.material}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Volumen</p>
                                    <p className="font-bold text-slate-800">{selectedItem.volume}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Humedad</p>
                                    <p className="font-bold text-slate-800">{selectedItem.details.humidity}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Contaminación</p>
                                    <p className={`font-bold ${selectedItem.details.contamination === 'Sí' ? 'text-red-600' : 'text-green-600'}`}>
                                        {selectedItem.details.contamination}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Reglas Aplicadas</p>
                                <div className="space-y-2">
                                    {selectedItem.details.rules.map((rule, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded border border-slate-100">
                                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                            {rule}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Resultado Final</p>
                                <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-center">
                                    <p className="text-lg font-black text-green-700">{selectedItem.result}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <Button onClick={() => setSelectedItem(null)}>Cerrar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Historial;

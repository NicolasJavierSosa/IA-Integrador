import React from 'react';
import Card from '../components/ui/Card';
import Input, { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Mercado = () => {
    const products = [
        { id: 1, name: 'Chips de Pino (Limpios)', unit: 'Ton', price: 18000, trend: 'Estable' },
        { id: 2, name: 'Aserrín Seco', unit: 'Ton', price: 9200, trend: 'Estable' },
        { id: 3, name: 'Costeros (Leña)', unit: 'Ton', price: 6500, trend: 'Baja' },
        { id: 4, name: 'Pellets Premium (Bolsa 15kg)', unit: 'Unidad', price: 4500, trend: 'Sube' },
        { id: 5, name: 'Viruta de Eucalipto', unit: 'Ton', price: 11000, trend: 'Sube' },
        { id: 6, name: 'Corteza Triturada', unit: 'm³', price: 3200, trend: 'Estable' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Cotizaciones de Mercado</h2>
                    <p className="text-slate-400">Gestión de precios de referencia para subproductos madereros.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                    <div className="text-[10px] text-slate-500 text-right leading-tight">
                        ÚLTIMA SINCRONIZACIÓN<br />
                        <span className="font-bold text-slate-800">Hoy, 09:41 AM</span>
                    </div>
                    <ArrowPathIcon className="w-4 h-4 text-slate-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Table */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Search Bar */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar producto (ej: Chips, Pellet)..."
                                className="w-full bg-white rounded-lg pl-10 pr-4 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                        </div>
                        <Select
                            options={[{ value: 'todos', label: 'Todos' }]}
                            className="w-32"
                            // Override styles for white background
                            style={{ backgroundColor: 'white', color: '#1e293b', borderColor: '#e2e8f0' }}
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">PRODUCTO / MATERIAL</th>
                                    <th className="px-6 py-3">UNIDAD</th>
                                    <th className="px-6 py-3 text-right">PRECIO MERCADO ($)</th>
                                    <th className="px-6 py-3 text-center">TENDENCIA</th>
                                    <th className="px-6 py-3 text-center">ACCIÓN</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {product.name}
                                            <div className="text-xs text-slate-400 font-normal">Biomasa / Celulosa</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{product.unit}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-800">
                                            $ {product.price.toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={product.trend} type="pill" />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-slate-400 hover:text-accent-600 transition-colors">
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
                            <button className="text-xs font-medium text-accent-600 hover:text-accent-700">
                                Ver historial completo
                            </button>
                        </div>
                    </div>

                    {/* Chart (Mock) */}
                    <Card title="Índice General de Biomasa (30 días)" className="bg-white border-slate-200">
                        {/* Override title color since Card uses white text by default for dark theme, but here we want light theme card */}
                        {/* Actually, let's just use a custom div to match the design exactly which is white background */}
                        <div className="flex items-end gap-2 h-32 mt-4 px-4">
                            {[40, 45, 42, 50, 48, 55, 60, 58, 65, 70, 68, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-100 rounded-t-sm hover:bg-accent-100 transition-colors relative group" style={{ height: `${h}%` }}>
                                    {i === 11 && <div className="absolute inset-0 bg-accent-600/80 rounded-t-sm"></div>}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Update Form */}
                <div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-6">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-accent-50 rounded-lg mr-3">
                                <PencilSquareIcon className="w-5 h-5 text-accent-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Actualizar Valor</h3>
                                <p className="text-xs text-slate-500">Modificar cotización actual</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">Producto</label>
                                <input type="text" value="Chips de Pino (Limpios)" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">Precio Actual ($)</label>
                                <input type="text" value="18000" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">Tendencia Observada</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Sube', 'Igual', 'Baja'].map((t) => (
                                        <button key={t} className={`py-2 rounded-lg text-xs font-medium border ${t === 'Igual' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full justify-center mt-4">Guardar Cambios</Button>

                            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <p className="text-[10px] text-amber-700 leading-tight">
                                    Nota: Los cambios impactarán directamente en el cálculo de rentabilidad del Sistema Experto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mercado;

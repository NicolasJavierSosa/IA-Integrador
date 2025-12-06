import React, { useState } from 'react';
import { Select } from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import { CurrencyDollarIcon, TruckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Mercado = () => {
    // State for Section A: Precios y Economía
    const [marketData, setMarketData] = useState({
        pelletsPrice: 'Medio',
        pelletsVolatility: false,
        chipsPrice: 'Medio',
        chipsVolatility: false,
        fingerJointPrice: 0,
        freightCost: 0
    });

    // State for Section B: Demandas Locales
    const [demands, setDemands] = useState({
        sustrato: true,
        compost: false,
        pellets: true,
        biomasa: false
    });

    // State for Section C: Estado de la Planta
    const [plantStatus, setPlantStatus] = useState({
        caldera: true,
        stockBiomasa: true, // true = Suficiente, false = Crítico
        almacenamientoPellets: 75,
        espacioCompostaje: true // true = Disponible, false = Limitado
    });

    const handleMarketChange = (field, value) => {
        setMarketData(prev => ({ ...prev, [field]: value }));
    };

    const handleDemandChange = (field, value) => {
        setDemands(prev => ({ ...prev, [field]: value }));
    };

    const handlePlantChange = (field, value) => {
        setPlantStatus(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Mercado y Operaciones</h2>
                <p className="text-slate-400">Gestión de precios, demandas y estado de la planta.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sección A: Precios y Economía */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <CurrencyDollarIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800">Precios y Economía</h3>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Precio Mercado Pellets</label>
                            <Select
                                value={marketData.pelletsPrice}
                                onChange={(e) => handleMarketChange('pelletsPrice', e.target.value)}
                                options={[
                                    { value: 'Alto', label: 'Alto' },
                                    { value: 'Medio', label: 'Medio' },
                                    { value: 'Bajo', label: 'Bajo' }
                                ]}
                            />
                        </div>

                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="text-sm text-slate-600">Volatilidad Precio Pellets</span>
                            <Switch
                                checked={marketData.pelletsVolatility}
                                onChange={(val) => handleMarketChange('pelletsVolatility', val)}
                                label={marketData.pelletsVolatility ? 'Alta' : 'Baja'}
                                activeColor="bg-red-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Precio Mercado Chips</label>
                            <Select
                                value={marketData.chipsPrice}
                                onChange={(e) => handleMarketChange('chipsPrice', e.target.value)}
                                options={[
                                    { value: 'Alto', label: 'Alto' },
                                    { value: 'Medio', label: 'Medio' },
                                    { value: 'Bajo', label: 'Bajo' }
                                ]}
                            />
                        </div>

                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="text-sm text-slate-600">Volatilidad Precio Chips</span>
                            <Switch
                                checked={marketData.chipsVolatility}
                                onChange={(val) => handleMarketChange('chipsVolatility', val)}
                                label={marketData.chipsVolatility ? 'Alta' : 'Baja'}
                                activeColor="bg-red-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Precio Mercado Finger Joint</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-400">$</span>
                                <input
                                    type="number"
                                    className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-4 py-2 text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                                    value={marketData.fingerJointPrice}
                                    onChange={(e) => handleMarketChange('fingerJointPrice', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Costo Flete Promedio</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-400">$</span>
                                <input
                                    type="number"
                                    className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-4 py-2 text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                                    value={marketData.freightCost}
                                    onChange={(e) => handleMarketChange('freightCost', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección B: Demandas Locales */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <TruckIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800">Demandas Locales</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Demanda Sustrato/Viveros</span>
                            <Switch
                                checked={demands.sustrato}
                                onChange={(val) => handleDemandChange('sustrato', val)}
                                label={demands.sustrato ? 'Alta' : 'Baja'}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Demanda Compost</span>
                            <Switch
                                checked={demands.compost}
                                onChange={(val) => handleDemandChange('compost', val)}
                                label={demands.compost ? 'Alta' : 'Baja'}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Demanda Pellets</span>
                            <Switch
                                checked={demands.pellets}
                                onChange={(val) => handleDemandChange('pellets', val)}
                                label={demands.pellets ? 'Alta' : 'Baja'}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Demanda Biomasa</span>
                            <Switch
                                checked={demands.biomasa}
                                onChange={(val) => handleDemandChange('biomasa', val)}
                                label={demands.biomasa ? 'Alta' : 'Baja'}
                            />
                        </div>
                    </div>
                </div>

                {/* Sección C: Estado de la Planta */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <BuildingOfficeIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800">Estado de la Planta</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Estado de Caldera</span>
                            <Switch
                                checked={plantStatus.caldera}
                                onChange={(val) => handlePlantChange('caldera', val)}
                                label={plantStatus.caldera ? 'Encendida' : 'Apagada'}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Stock Biomasa Actual</span>
                            <Switch
                                checked={plantStatus.stockBiomasa}
                                onChange={(val) => handlePlantChange('stockBiomasa', val)}
                                label={plantStatus.stockBiomasa ? 'Suficiente' : 'Crítico'}
                                activeColor="bg-green-500"
                                inactiveColor="bg-red-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-700">Capacidad Almac. Pellets</label>
                                <span className="text-sm font-bold text-slate-600">{plantStatus.almacenamientoPellets}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-600"
                                value={plantStatus.almacenamientoPellets}
                                onChange={(e) => handlePlantChange('almacenamientoPellets', e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-medium text-slate-700">Espacio Compostaje</span>
                            <Switch
                                checked={plantStatus.espacioCompostaje}
                                onChange={(val) => handlePlantChange('espacioCompostaje', val)}
                                label={plantStatus.espacioCompostaje ? 'Disponible' : 'Limitado'}
                                inactiveColor="bg-amber-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mercado;

import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input, { Select } from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import { CurrencyDollarIcon, TruckIcon, FireIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const Mercado = () => {
    // Initial state from localStorage or defaults
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('marketData');
        return saved ? JSON.parse(saved) : {
            precioPellets: 'Medio',
            volatilidadPellets: false,
            precioChips: 'Bajo',
            volatilidadChips: false,
            precioFinger: '',
            costoFlete: '',
            demandaSustrato: true,
            demandaCompost: false,
            demandaPellets: true,
            demandaBiomasa: true,
            estadoCaldera: true,
            stockBiomasa: false, // false = Crítico, true = Suficiente
            capacidadAlmacenamiento: 80,
            espacioCompost: true
        };
    });

    // Save to localStorage whenever formData changes
    useEffect(() => {
        localStorage.setItem('marketData', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h2 className="text-2xl font-bold text-white">Mercado y Planta</h2>
                <p className="text-slate-400">Configure las variables del entorno para el Motor de Inferencia.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section A: Precios y Economía */}
                <Card title="Precios y Economía" icon={CurrencyDollarIcon}>
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Mercado de Pellets</h4>
                            <div className="space-y-4">
                                <Select
                                    label="Precio Mercado Pellets"
                                    value={formData.precioPellets}
                                    onChange={(e) => handleChange('precioPellets', e.target.value)}
                                    options={[
                                        { value: 'Alto', label: 'Alto (> $5000)' },
                                        { value: 'Medio', label: 'Medio ($3000-$5000)' },
                                        { value: 'Bajo', label: 'Bajo (< $3000)' }
                                    ]}
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Volatilidad Alta</span>
                                    <Switch
                                        checked={formData.volatilidadPellets}
                                        onChange={(val) => handleChange('volatilidadPellets', val)}
                                        label={formData.volatilidadPellets ? 'Sí' : 'No'}
                                        activeColor="bg-red-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Mercado de Chips</h4>
                            <div className="space-y-4">
                                <Select
                                    label="Precio Mercado Chips"
                                    value={formData.precioChips}
                                    onChange={(e) => handleChange('precioChips', e.target.value)}
                                    options={[
                                        { value: 'Alto', label: 'Alto' },
                                        { value: 'Medio', label: 'Medio' },
                                        { value: 'Bajo', label: 'Bajo' }
                                    ]}
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Volatilidad Alta</span>
                                    <Switch
                                        checked={formData.volatilidadChips}
                                        onChange={(val) => handleChange('volatilidadChips', val)}
                                        label={formData.volatilidadChips ? 'Sí' : 'No'}
                                        activeColor="bg-red-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Precio Finger Joint"
                                placeholder="0.00"
                                type="number"
                                value={formData.precioFinger}
                                onChange={(e) => handleChange('precioFinger', e.target.value)}
                            />
                            <Input
                                label="Costo Flete Promedio"
                                placeholder="0.00"
                                type="number"
                                value={formData.costoFlete}
                                onChange={(e) => handleChange('costoFlete', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Section B: Demandas Locales */}
                <Card title="Demandas Locales" icon={TruckIcon}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Demanda Sustrato/Viveros</span>
                            <Switch
                                checked={formData.demandaSustrato}
                                onChange={(val) => handleChange('demandaSustrato', val)}
                                label={formData.demandaSustrato ? 'Alta' : 'Baja'}
                            />
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Demanda Compost</span>
                            <Switch
                                checked={formData.demandaCompost}
                                onChange={(val) => handleChange('demandaCompost', val)}
                                label={formData.demandaCompost ? 'Alta' : 'Baja'}
                            />
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Demanda Pellets</span>
                            <Switch
                                checked={formData.demandaPellets}
                                onChange={(val) => handleChange('demandaPellets', val)}
                                label={formData.demandaPellets ? 'Alta' : 'Baja'}
                            />
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Demanda Biomasa (Energía)</span>
                            <Switch
                                checked={formData.demandaBiomasa}
                                onChange={(val) => handleChange('demandaBiomasa', val)}
                                label={formData.demandaBiomasa ? 'Alta' : 'Baja'}
                            />
                        </div>
                    </div>
                </Card>

                {/* Section C: Estado de la Planta */}
                <Card title="Estado de la Planta" icon={FireIcon}>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Estado de Caldera</span>
                            <Switch
                                checked={formData.estadoCaldera}
                                onChange={(val) => handleChange('estadoCaldera', val)}
                                label={formData.estadoCaldera ? 'Encendida' : 'Apagada'}
                                activeColor="bg-orange-500"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Stock Biomasa Actual</span>
                            <Switch
                                checked={formData.stockBiomasa}
                                onChange={(val) => handleChange('stockBiomasa', val)}
                                label={formData.stockBiomasa ? 'Suficiente' : 'Crítico'}
                                activeColor="bg-green-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-700">Capacidad Almacenamiento Pellets</label>
                                <span className="text-sm font-bold text-accent-600">{formData.capacidadAlmacenamiento}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.capacidadAlmacenamiento}
                                onChange={(e) => handleChange('capacidadAlmacenamiento', e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-600"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Vacío (0%)</span>
                                <span>Lleno (100%)</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <ArchiveBoxIcon className="w-5 h-5 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">Espacio Compostaje</span>
                            </div>
                            <Switch
                                checked={formData.espacioCompost}
                                onChange={(val) => handleChange('espacioCompost', val)}
                                label={formData.espacioCompost ? 'Disponible' : 'Limitado'}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Mercado;

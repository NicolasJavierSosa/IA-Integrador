import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input, { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SparklesIcon, TrophyIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const SistemaExperto = () => {
    const [purity, setPurity] = useState(53);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Análisis de Subproductos</h2>
                <p className="text-slate-400">Ingrese las especificaciones del material para recibir recomendaciones del motor de reglas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form */}
                <div className="lg:col-span-2">
                    <Card title="Parámetros del Material" className="h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Select
                                label="Tipo de Subproducto"
                                options={[{ value: 'chips', label: 'Chips / Astillas' }]}
                            />
                            <Select
                                label="Especie de Madera"
                                options={[{ value: 'pino', label: 'Pino (Conífera)' }]}
                            />
                            <Input label="Humedad del Producto" placeholder="Ej: 12" unit="%" />
                            <Input label="Humedad Ambiente" placeholder="Ej: 40" unit="%" />
                            <div className="flex items-end gap-2">
                                <Input label="Peso Estimado" placeholder="0.00" className="flex-1" />
                                <Select options={[{ value: 'ton', label: 'ton' }]} className="w-20" />
                            </div>
                            <Input label="Dimensiones Promedio" placeholder="Ej: 5x2x10 cm (Opcional)" />
                        </div>

                        <div className="mb-8 p-4 bg-navy-900 rounded-lg border border-navy-700">
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-medium text-slate-400">Pureza / Nivel de Limpieza</label>
                                <span className="text-xs font-bold text-white">{purity}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={purity}
                                onChange={(e) => setPurity(e.target.value)}
                                className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-accent-600"
                            />
                            <div className="flex justify-between mt-1">
                                <span className="text-[10px] text-slate-500">Muy contaminado</span>
                                <span className="text-[10px] text-slate-500">Puro / Limpio</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="ghost">Limpiar</Button>
                            <Button icon={SparklesIcon}>Analizar y Recomendar</Button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Recommendations */}
                <div className="space-y-6">
                    {/* Main Recommendation */}
                    <div className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">RECOMENDACIÓN PRINCIPAL</p>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 pr-12">Materia Prima para Aglomerados</h3>

                            <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-navy-800 w-3/4"></div>
                                </div>
                                <span className="text-xs font-bold text-green-600">75% de Coincidencia con Reglas</span>
                            </div>
                        </div>
                        <TrophyIcon className="absolute top-4 right-4 w-16 h-16 text-slate-100" />
                    </div>

                    {/* Suggested Actions */}
                    <Card>
                        <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                            <SparklesIcon className="w-4 h-4 mr-2 text-accent-500" />
                            Acciones Sugeridas
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start text-sm text-slate-400">
                                <span className="mr-2 text-accent-500">›</span>
                                Apto para relleno de tableros de partículas.
                            </li>
                            <li className="flex items-start text-sm text-slate-400">
                                <span className="mr-2 text-accent-500">›</span>
                                Verificar granulometría estándar.
                            </li>
                            <li className="flex items-start text-sm text-slate-400">
                                <span className="mr-2 text-accent-500">›</span>
                                Uso secundario: Compostaje industrial.
                            </li>
                        </ul>
                    </Card>

                    {/* Market Data Alert */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex items-start">
                            <ArrowTrendingUpIcon className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                            <div>
                                <h5 className="text-sm font-bold text-amber-500 mb-1">Dato de Mercado</h5>
                                <p className="text-xs text-amber-200/80 leading-relaxed">
                                    El precio de la tonelada para este uso subió un 5% esta semana.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SistemaExperto;

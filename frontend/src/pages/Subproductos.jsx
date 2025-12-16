import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input, { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Switch from '../components/ui/Switch';
import {
    SparklesIcon,
    TrophyIcon,
    ArrowTrendingUpIcon,
    BeakerIcon,
} from '@heroicons/react/24/outline';

const Subproductos = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        category: 'Corteza',
        species: 'Pino',
        volume: '',
        humidity: 45,
        chemicalContamination: false,
        dimensions: { length: '', width: '' },
        defectType: 'Curvatura Leve',
        hasBark: false
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDimensionChange = (dim, value) => {
        setFormData(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [dim]: value }
        }));
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Get Market Data from LocalStorage
            const marketData = JSON.parse(localStorage.getItem('marketData') || '{}');

            // 2. Prepare Payload
            const payload = {
                lot: formData,
                market: marketData
            };

            // 3. Call API
            const response = await fetch('http://localhost:8000/api/subproductos/analyze/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor (${response.status}): ${errorText}`);
            }

            const data = await response.json();

            // 4. Process Results and Navigate to Sistema Experto
            if (data.success && data.recommendations.length > 0) {
                // Find the optimal recommendation (or the first one)
                const optimal = data.recommendations.find(r => r.type === 'optimal') || data.recommendations[0];

                // Prepare complete analysis data
                const analysisData = {
                    recommendation: optimal.value.replace(/_/g, ' ').toUpperCase(),
                    type: optimal.type === 'optimal' ? 'gain' : 'cost',
                    justification: "Análisis basado en las reglas de negocio activas.",
                    rules: data.recommendations.map(r => ({
                        id: r.type.toUpperCase(),
                        name: r.desc,
                        desc: r.value
                    })),
                    market: {
                        price: marketData.precioPellets || 'N/A',
                        demand: marketData.demandaPellets ? 'Alta' : 'Baja',
                        volatility: marketData.volatilidadPellets ? 'Alta' : 'Baja'
                    },
                    actions: [
                        "Verificar condiciones operativas.",
                        "Registrar lote en el sistema.",
                        "Ejecutar recomendación."
                    ],
                    inputData: {
                        category: formData.category,
                        species: formData.species,
                        volume: formData.volume,
                        humidity: formData.humidity,
                        chemicalContamination: formData.chemicalContamination,
                        dimensions: formData.dimensions,
                        defectType: formData.defectType,
                        hasBark: formData.hasBark
                    },
                    timestamp: new Date().toISOString()
                };

                // Navigate to Sistema Experto with the analysis data
                navigate('/sistema-experto', { state: { analysisData } });
            } else {
                setError("No se encontró una recomendación clara para este caso.");
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "Error de conexión: Asegúrese de que el backend esté corriendo.");
        } finally {
            setLoading(false);
        }
    };

    const renderDynamicFields = () => {
        switch (formData.category) {
            case 'Corteza':
            case 'Corteza+Aserrín':
                return (
                    <div className="bg-navy-700/50 p-4 rounded-lg border border-navy-600 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <BeakerIcon className="w-5 h-5 text-slate-400" />
                                <span className="text-sm font-medium text-slate-300">Contaminación Química</span>
                            </div>
                            <Switch
                                checked={formData.chemicalContamination}
                                onChange={(val) => handleChange('chemicalContamination', val)}
                                label={formData.chemicalContamination ? 'Sí' : 'No'}
                                activeColor="bg-red-500"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 ml-7">
                            Indique si el material ha sido tratado con preservantes o pinturas.
                        </p>
                    </div>
                );

            case 'Retazos':
                return (
                    <div className="bg-navy-700/50 p-4 rounded-lg border border-navy-600 animate-fadeIn space-y-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Dimensiones Promedio</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Largo (cm)"
                                placeholder="0.00"
                                type="number"
                                value={formData.dimensions.length}
                                onChange={(e) => handleDimensionChange('length', e.target.value)}
                            />
                            <Input
                                label="Ancho (cm)"
                                placeholder="0.00"
                                type="number"
                                value={formData.dimensions.width}
                                onChange={(e) => handleDimensionChange('width', e.target.value)}
                            />
                        </div>
                    </div>
                );

            case 'Madera con Fallas':
                return (
                    <div className="bg-navy-700/50 p-4 rounded-lg border border-navy-600 animate-fadeIn">
                        <Select
                            label="Tipo de Falla Predominante"
                            value={formData.defectType}
                            onChange={(e) => handleChange('defectType', e.target.value)}
                            options={[
                                { value: 'Curvatura Leve', label: 'Curvatura Leve' },
                                { value: 'Nudo Estético', label: 'Nudo Estético' },
                                { value: 'Grieta Profunda', label: 'Grieta Profunda' },
                                { value: 'Pudrición Parcial', label: 'Pudrición Parcial' }
                            ]}
                        />
                    </div>
                );

            case 'Chips':
                return (
                    <div className="bg-navy-700/50 p-4 rounded-lg border border-navy-600 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-300">¿Contiene Corteza?</span>
                            <Switch
                                checked={formData.hasBark}
                                onChange={(val) => handleChange('hasBark', val)}
                                label={formData.hasBark ? 'Sí' : 'No'}
                                activeColor="bg-amber-500"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Análisis de Subproductos</h2>
                <p className="text-slate-400">Ingrese las especificaciones del material para recibir recomendaciones.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form */}
                <div className="lg:col-span-2">
                    <Card title="Especificaciones del Lote" className="h-full">
                        <div className="space-y-6">
                            {/* Common Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="Categoría Subproducto"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    options={[
                                        { value: 'Corteza', label: 'Corteza' },
                                        { value: 'Aserrín', label: 'Aserrín' },
                                        { value: 'Retazos', label: 'Retazos' },
                                        { value: 'Madera con Fallas', label: 'Madera con Fallas' },
                                        { value: 'Chips', label: 'Chips' },
                                        { value: 'Corteza+Aserrín', label: 'Corteza + Aserrín' }
                                    ]}
                                />
                                <Select
                                    label="Especie"
                                    value={formData.species}
                                    onChange={(e) => handleChange('species', e.target.value)}
                                    options={[
                                        { value: 'Pino', label: 'Pino' },
                                        { value: 'Eucalipto', label: 'Eucalipto' },
                                        { value: 'Otras', label: 'Otras' }
                                    ]}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Input
                                        label="Volumen del Lote"
                                        placeholder="0.00"
                                        type="number"
                                        value={formData.volume}
                                        onChange={(e) => handleChange('volume', e.target.value)}
                                        unit="Ton"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-slate-300">Humedad</label>
                                        <span className="text-sm font-bold text-accent-600">{formData.humidity}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.humidity}
                                        onChange={(e) => handleChange('humidity', e.target.value)}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                        <span>Seco (0%)</span>
                                        <span>Saturado (100%)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Fields Section */}
                            <div className="pt-4 border-t border-navy-700">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                                    Parámetros Específicos: {formData.category}
                                </h3>
                                {renderDynamicFields()}
                            </div>

                            {error && (
                                <div className="p-3 bg-red-900/20 text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="ghost" onClick={() => setFormData({
                                    category: 'Corteza', species: 'Pino', volume: '', humidity: 45,
                                    chemicalContamination: false, dimensions: { length: '', width: '' },
                                    defectType: 'Curvatura Leve', hasBark: false
                                })}>
                                    Limpiar
                                </Button>
                                <Button
                                    icon={loading ? undefined : SparklesIcon}
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                >
                                    {loading ? 'Analizando...' : 'Analizar Lote'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Info Panel */}
                <div className="space-y-6">
                    <div className="bg-navy-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">RECOMENDACIÓN PRINCIPAL</p>
                            <h3 className="text-xl font-bold text-white mb-4 pr-12">
                                {formData.category === 'Chips' ? 'Celulosa / Papel' :
                                    formData.category === 'Corteza' ? 'Combustible Caldera' :
                                        'Evaluando...'}
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 bg-navy-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent-500 w-3/4"></div>
                                </div>
                                <span className="text-xs font-bold text-green-400">Alta Coincidencia</span>
                            </div>
                        </div>
                        <TrophyIcon className="absolute top-4 right-4 w-16 h-16 text-navy-700" />
                    </div>

                    <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex items-start">
                            <ArrowTrendingUpIcon className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                            <div>
                                <h5 className="text-sm font-bold text-amber-500 mb-1">Dato de Mercado</h5>
                                <p className="text-xs text-amber-200/80 leading-relaxed">
                                    Alta demanda de {formData.category} en la región esta semana.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subproductos;

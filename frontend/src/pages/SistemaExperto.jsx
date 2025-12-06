import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input, { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Switch from '../components/ui/Switch';
import {
    SparklesIcon,
    TrophyIcon,
    ArrowTrendingUpIcon,
    BeakerIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    ChartBarIcon,
    LightBulbIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const SistemaExperto = () => {
    const [showResult, setShowResult] = useState(false);
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

    // Mock Result Data
    const mockResult = {
        recommendation: "PRODUCIR PELLETS",
        type: "gain", // gain = green, cost = orange
        justification: "Se detectó una oportunidad de alto valor agregado. El lote cumple con la humedad técnica requerida (no gasta energía en secado) y existe una demanda de mercado activa que garantiza la venta.",
        rules: [
            { id: "R06", name: "Factibilidad Industrial", desc: "Volumen > 200tn" },
            { id: "R07", name: "Factibilidad Técnica", desc: "Humedad < 10%" },
            { id: "R09", name: "Seguridad de Mercado", desc: "Precio Alto + Volatilidad Baja" }
        ],
        market: {
            price: "ALTO",
            demand: "ALTA",
            volatility: "BAJA"
        },
        actions: [
            "Derivar tolva a la Pelletizadora A.",
            "Registrar lote en stock de productos terminados.",
            "Etiquetar lote como Calidad Premium."
        ]
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDimensionChange = (dim, value) => {
        setFormData(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [dim]: value }
        }));
    };

    const handleAnalyze = () => {
        // In a real app, this would call the backend
        setShowResult(true);
        window.scrollTo(0, 0);
    };

    const renderDynamicFields = () => {
        switch (formData.category) {
            case 'Corteza':
            case 'Corteza+Aserrín':
                return (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <BeakerIcon className="w-5 h-5 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">Contaminación Química</span>
                            </div>
                            <Switch
                                checked={formData.chemicalContamination}
                                onChange={(val) => handleChange('chemicalContamination', val)}
                                label={formData.chemicalContamination ? 'Sí' : 'No'}
                                activeColor="bg-red-500"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 ml-7">
                            Indique si el material ha sido tratado con preservantes o pinturas.
                        </p>
                    </div>
                );

            case 'Retazos':
            case 'Despuntes':
                return (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn space-y-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Dimensiones Promedio</h4>
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
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn">
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
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">¿Contiene Corteza?</span>
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

    if (showResult) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowResult(false)}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Resultado del Análisis</h2>
                        <p className="text-slate-400">Informe generado por el Motor de Inferencia.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel 1: Recomendación Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-8 shadow-lg border-l-8 border-green-500 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                                        Recomendación Óptima
                                    </span>
                                </div>
                                <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
                                    {mockResult.recommendation}
                                </h1>
                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                    <CheckCircleIcon className="w-6 h-6" />
                                    <span>Opción de Alta Rentabilidad Identificada</span>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-50 to-transparent opacity-50"></div>
                        </div>

                        {/* Panel 2: Justificación Lógica */}
                        <Card title="Lógica del Experto (El Por Qué)" icon={LightBulbIcon}>
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <p className="text-slate-700 leading-relaxed italic">
                                        "{mockResult.justification}"
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <ClipboardDocumentCheckIcon className="w-5 h-5 text-accent-600" />
                                        Reglas Clave Activadas
                                    </h4>
                                    <div className="space-y-2">
                                        {mockResult.rules.map((rule) => (
                                            <div key={rule.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                                <span className="px-2 py-1 bg-navy-100 text-navy-700 text-xs font-bold rounded">
                                                    {rule.id}
                                                </span>
                                                <div className="flex-1">
                                                    <span className="text-sm font-bold text-slate-700">{rule.name}</span>
                                                    <span className="text-sm text-slate-500 mx-2">|</span>
                                                    <span className="text-sm text-slate-500">{rule.desc}</span>
                                                </div>
                                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Panel 3: Contexto de Mercado */}
                        <Card title="Factores Externos" icon={ChartBarIcon}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm text-slate-600">Precio Pellet</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                        {mockResult.market.price}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm text-slate-600">Demanda Local</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                        {mockResult.market.demand}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm text-slate-600">Volatilidad</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                        {mockResult.market.volatility}
                                    </span>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-2">
                                    <ExclamationTriangleIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    <p className="text-[10px] text-blue-700 leading-tight">
                                        El sistema validó que no existen riesgos financieros a corto plazo.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Panel 4: Acciones Sugeridas */}
                        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 text-white">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5 text-accent-400" />
                                Acciones Inmediatas
                            </h3>
                            <div className="space-y-4">
                                {mockResult.actions.map((action, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-xs font-bold border border-accent-500/30">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            {action}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-lg transition-colors text-sm">
                                Confirmar y Ejecutar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                                        { value: 'Retazos', label: 'Retazos / Meollos' },
                                        { value: 'Despuntes', label: 'Despuntes' },
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
                                <div className="relative">
                                    <Input
                                        label="Volumen del Lote"
                                        placeholder="0.00"
                                        type="number"
                                        value={formData.volume}
                                        onChange={(e) => handleChange('volume', e.target.value)}
                                    />
                                    <span className="absolute right-3 top-[38px] text-sm text-slate-400">Ton</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-slate-700">Humedad</label>
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
                            <div className="pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                                    Parámetros Específicos: {formData.category}
                                </h3>
                                {renderDynamicFields()}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="ghost" onClick={() => setFormData({
                                    category: 'Corteza', species: 'Pino', volume: '', humidity: 45,
                                    chemicalContamination: false, dimensions: { length: '', width: '' },
                                    defectType: 'Curvatura Leve', hasBark: false
                                })}>
                                    Limpiar
                                </Button>
                                <Button icon={SparklesIcon} onClick={handleAnalyze}>Analizar Lote</Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Recommendations (Static for now, but reactive to form in future) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">RECOMENDACIÓN PRINCIPAL</p>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 pr-12">
                                {formData.category === 'Chips' ? 'Celulosa / Papel' :
                                    formData.category === 'Corteza' ? 'Combustible Caldera' :
                                        'Evaluando...'}
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-navy-800 w-3/4"></div>
                                </div>
                                <span className="text-xs font-bold text-green-600">Alta Coincidencia</span>
                            </div>
                        </div>
                        <TrophyIcon className="absolute top-4 right-4 w-16 h-16 text-slate-100" />
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
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

export default SistemaExperto;

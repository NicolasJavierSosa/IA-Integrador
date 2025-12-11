import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
    SparklesIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    ChartBarIcon,
    LightBulbIcon,
    ClipboardDocumentCheckIcon,
    InformationCircleIcon,
    CubeIcon,
    BeakerIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

const SistemaExperto = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if we received analysis data from navigation
        if (location.state?.analysisData) {
            setResultData(location.state.analysisData);
            setLoading(false);
        } else {
            // Try to fetch the latest analysis from backend
            fetchLatestAnalysis();
        }
    }, [location]);

    const fetchLatestAnalysis = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/historial/');
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const latest = data[0]; // Already ordered by -fecha
                    
                    // Transform backend data to display format
                    setResultData({
                        recommendation: latest.recomendacion_principal,
                        type: 'gain',
                        justification: latest.justificacion,
                        rules: latest.resultados.map(r => ({
                            id: r.type?.toUpperCase() || 'RULE',
                            name: r.desc || 'Regla de negocio',
                            desc: r.value || ''
                        })),
                        market: latest.datos_entrada?.market || {
                            price: 'N/A',
                            demand: 'N/A',
                            volatility: 'N/A'
                        },
                        actions: [
                            "Verificar condiciones operativas.",
                            "Registrar lote en el sistema.",
                            "Ejecutar recomendación."
                        ],
                        inputData: latest.datos_entrada?.lot || {
                            category: latest.categoria,
                            species: latest.especie,
                            volume: latest.volumen
                        },
                        timestamp: latest.fecha
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching latest analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <SparklesIcon className="w-12 h-12 text-accent-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Cargando análisis...</p>
                </div>
            </div>
        );
    }

    if (!resultData) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <InformationCircleIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No hay análisis disponible</h2>
                    <p className="text-slate-400 mb-6">
                        Realice un análisis de lote para ver los resultados aquí.
                    </p>
                    <Link to="/subproductos">
                        <Button icon={SparklesIcon}>
                            Analizar Nuevo Lote
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Section with timestamp */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/subproductos">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Resultado del Análisis</h2>
                        <p className="text-slate-400">Informe generado por el Motor de Inferencia</p>
                    </div>
                </div>
                {resultData.timestamp && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(resultData.timestamp).toLocaleString('es-ES')}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Results */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Panel 1: Recomendación Principal */}
                    <div className="bg-navy-800 rounded-xl p-8 shadow-lg border-l-8 border-green-500 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold uppercase tracking-wider">
                                    Recomendación Óptima
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
                                {resultData.recommendation}
                            </h1>
                            <div className="flex items-center gap-2 text-green-400 font-medium">
                                <CheckCircleIcon className="w-6 h-6" />
                                <span>Opción de Alta Rentabilidad Identificada</span>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-900/20 to-transparent opacity-50"></div>
                    </div>

                    {/* Panel 2: Input Data Summary */}
                    {resultData.inputData && (
                        <Card title="Datos de Entrada del Lote" icon={CubeIcon}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-navy-900 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Categoría</p>
                                    <p className="text-sm font-bold text-white">{resultData.inputData.category}</p>
                                </div>
                                <div className="bg-navy-900 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Especie</p>
                                    <p className="text-sm font-bold text-white">{resultData.inputData.species}</p>
                                </div>
                                {resultData.inputData.volume && (
                                    <div className="bg-navy-900 p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Volumen</p>
                                        <p className="text-sm font-bold text-white">{resultData.inputData.volume} Ton</p>
                                    </div>
                                )}
                                {resultData.inputData.humidity !== undefined && (
                                    <div className="bg-navy-900 p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Humedad</p>
                                        <p className="text-sm font-bold text-white">{resultData.inputData.humidity}%</p>
                                    </div>
                                )}
                                {resultData.inputData.chemicalContamination !== undefined && (
                                    <div className="bg-navy-900 p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Contaminación</p>
                                        <p className="text-sm font-bold text-white">
                                            {resultData.inputData.chemicalContamination ? 'Sí' : 'No'}
                                        </p>
                                    </div>
                                )}
                                {resultData.inputData.defectType && (
                                    <div className="bg-navy-900 p-3 rounded-lg col-span-2">
                                        <p className="text-xs text-slate-500 mb-1">Tipo de Falla</p>
                                        <p className="text-sm font-bold text-white">{resultData.inputData.defectType}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Panel 3: Justificación Lógica */}
                    <Card title="Lógica del Sistema Experto" icon={LightBulbIcon}>
                        <div className="space-y-6">
                            <div className="bg-navy-900 p-4 rounded-lg border border-navy-700">
                                <p className="text-slate-300 leading-relaxed italic">
                                    "{resultData.justification}"
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-accent-600" />
                                    Reglas y Recomendaciones Activadas
                                </h4>
                                <div className="space-y-2">
                                    {resultData.rules && resultData.rules.length > 0 ? (
                                        resultData.rules.map((rule, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-navy-900 border border-navy-700 rounded-lg shadow-sm hover:border-accent-600/50 transition-colors">
                                                <span className="px-2 py-1 bg-navy-700 text-white text-xs font-bold rounded">
                                                    {rule.id}
                                                </span>
                                                <div className="flex-1">
                                                    <span className="text-sm font-bold text-slate-300">{rule.name}</span>
                                                    {rule.desc && (
                                                        <>
                                                            <span className="text-sm text-slate-500 mx-2">|</span>
                                                            <span className="text-sm text-slate-400">{rule.desc}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm">No hay reglas detalladas disponibles.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Context & Actions */}
                <div className="space-y-6">
                    {/* Panel 4: Contexto de Mercado */}
                    <Card title="Factores de Mercado" icon={ChartBarIcon}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-navy-900 rounded-lg">
                                <span className="text-sm text-slate-400">Precio Pellet</span>
                                <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-bold rounded-full">
                                    {resultData.market.price}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-navy-900 rounded-lg">
                                <span className="text-sm text-slate-400">Demanda Local</span>
                                <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-bold rounded-full">
                                    {resultData.market.demand}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-navy-900 rounded-lg">
                                <span className="text-sm text-slate-400">Volatilidad</span>
                                <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full">
                                    {resultData.market.volatility}
                                </span>
                            </div>
                            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg flex gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <p className="text-[10px] text-blue-300 leading-tight">
                                    El sistema validó que no existen riesgos financieros a corto plazo.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Panel 5: Acciones Sugeridas */}
                    <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 text-white">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-accent-400" />
                            Acciones Sugeridas
                        </h3>
                        <div className="space-y-4">
                            {resultData.actions.map((action, index) => (
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
                        <div className="space-y-3 mt-6">
                            <button className="w-full py-3 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-lg transition-colors text-sm">
                                Confirmar y Ejecutar
                            </button>
                            <Link to="/subproductos" className="block">
                                <button className="w-full py-2 bg-navy-700 hover:bg-navy-600 text-slate-300 font-medium rounded-lg transition-colors text-sm">
                                    Analizar Nuevo Lote
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SistemaExperto;

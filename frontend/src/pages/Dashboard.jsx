import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import {
    ComputerDesktopIcon,
    CurrencyDollarIcon,
    BoltIcon,
    ClockIcon,
    ArrowRightIcon,
    SparklesIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
    // Mock Data for KPIs
    const kpis = [
        {
            label: 'Maquinaria Operativa',
            value: '8/10',
            subtext: '2 en Mantenimiento',
            icon: ComputerDesktopIcon,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: 'stable'
        },
        {
            label: 'Precio Pellet (Ref)',
            value: '$4,500',
            subtext: 'Tendencia al Alza',
            icon: CurrencyDollarIcon,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            trend: 'up'
        },
        {
            label: 'Eficiencia Planta',
            value: '92%',
            subtext: 'Últimas 24hs',
            icon: BoltIcon,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            trend: 'up'
        }
    ];

    // Mock Data for Activity Feed
    const activities = [
        {
            id: 1,
            type: 'analysis',
            title: 'Análisis de Lote #2024-089',
            desc: 'Recomendación generada: PRODUCIR PELLETS',
            time: 'Hace 15 min',
            icon: SparklesIcon,
            iconColor: 'text-accent-500',
            bg: 'bg-accent-500/10'
        },
        {
            id: 2,
            type: 'alert',
            title: 'Alerta de Mantenimiento',
            desc: 'Sierra Sin Fin #02 reportó vibración inusual.',
            time: 'Hace 2 horas',
            icon: ExclamationTriangleIcon,
            iconColor: 'text-red-500',
            bg: 'bg-red-500/10'
        },
        {
            id: 3,
            type: 'market',
            title: 'Actualización de Mercado',
            desc: 'El precio de Chips de Pino subió un 5%.',
            time: 'Hace 4 horas',
            icon: CurrencyDollarIcon,
            iconColor: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            id: 4,
            type: 'system',
            title: 'Copia de Seguridad',
            desc: 'Backup de base de reglas completado con éxito.',
            time: 'Hace 6 horas',
            icon: CheckCircleIcon,
            iconColor: 'text-slate-500',
            bg: 'bg-slate-100'
        }
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
                    <p className="text-slate-400">Resumen operativo del sistema EcoWood.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Última Actualización</p>
                    <p className="text-sm text-white font-bold flex items-center justify-end gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        En Tiempo Real
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-navy-800 rounded-xl p-6 border border-navy-700 shadow-lg hover:border-navy-600 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${kpi.bg}`}>
                                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                            </div>
                            {kpi.trend === 'up' && <span className="text-green-500 text-xs font-bold">↗ +5%</span>}
                            {kpi.trend === 'down' && <span className="text-red-500 text-xs font-bold">↘ -2%</span>}
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{kpi.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{kpi.value}</h3>
                            <p className="text-xs text-slate-500 mt-1">{kpi.subtext}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Actividad Reciente" icon={ClockIcon}>
                        <div className="space-y-6">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex gap-4 group">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center`}>
                                        <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                                    </div>
                                    <div className="flex-1 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-accent-600 transition-colors">
                                                {activity.title}
                                            </h4>
                                            <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                            {activity.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                            <Link to="/historial">
                                <button className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center justify-center gap-2 mx-auto">
                                    Ver Historial Completo
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Sidebar: Quick Actions & Status */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Acciones Rápidas</h3>
                        <p className="text-accent-100 text-sm mb-6">Accesos directos a las funciones más utilizadas.</p>

                        <div className="space-y-3">
                            <Link to="/sistema-experto" className="block">
                                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-left flex items-center gap-3 transition-colors">
                                    <SparklesIcon className="w-5 h-5" />
                                    <span className="font-medium text-sm">Analizar Nuevo Lote</span>
                                </button>
                            </Link>
                            <Link to="/maquinarias" className="block">
                                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-left flex items-center gap-3 transition-colors">
                                    <WrenchScrewdriverIcon className="w-5 h-5" />
                                    <span className="font-medium text-sm">Gestionar Equipos</span>
                                </button>
                            </Link>
                            <Link to="/mercado" className="block">
                                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-left flex items-center gap-3 transition-colors">
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                    <span className="font-medium text-sm">Actualizar Precios</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-navy-900 rounded-xl p-6 border border-navy-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Estado del Sistema</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Base de Conocimiento</span>
                                <StatusBadge status="Online" type="dot" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Motor de Inferencia</span>
                                <StatusBadge status="Online" type="dot" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">API Gateway</span>
                                <StatusBadge status="Online" type="dot" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Base de Datos</span>
                                <StatusBadge status="Online" type="dot" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

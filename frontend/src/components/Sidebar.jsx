import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Squares2X2Icon,
    ChartBarIcon,
    CubeIcon,
    WrenchScrewdriverIcon,
    SparklesIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: Squares2X2Icon, section: 'PRINCIPAL' },
        { name: 'Info de Mercado', href: '/mercado', icon: ChartBarIcon, section: 'PRINCIPAL' },
        { name: 'ABM Subproductos', href: '/subproductos', icon: CubeIcon, section: 'GESTIÓN' },
        { name: 'ABM Maquinarias', href: '/maquinarias', icon: WrenchScrewdriverIcon, section: 'GESTIÓN' },
        { name: 'Realizar una recomendacion', href: '/sistema-experto', icon: SparklesIcon, section: 'INTELIGENCIA' },
        { name: 'Historial Análisis', href: '/historial', icon: ClockIcon, section: 'INTELIGENCIA' },
    ];

    // Group navigation by section
    const sections = navigation.reduce((acc, item) => {
        if (!acc[item.section]) {
            acc[item.section] = [];
        }
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <div className="flex flex-col w-64 h-screen bg-navy-800 border-r border-navy-700 text-slate-300">
            {/* Logo */}
            <div className="flex items-center px-6 h-16 border-b border-navy-700">
                <CubeIcon className="w-8 h-8 text-accent-500 mr-2" />
                <div>
                    <h1 className="text-lg font-bold text-white leading-none">EcoWood Sys</h1>
                    <span className="text-xs text-slate-500">Gestión Industrial v2.1</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                {Object.entries(sections).map(([sectionName, items]) => (
                    <div key={sectionName} className="mb-6">
                        <h3 className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {sectionName}
                        </h3>
                        <ul className="space-y-1">
                            {items.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.href}
                                            className={`flex items-center px-6 py-2 text-sm font-medium transition-colors duration-150 ${isActive
                                                ? 'bg-accent-500/10 text-accent-500 border-r-2 border-accent-500'
                                                : 'text-slate-400 hover:text-white hover:bg-navy-700'
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-accent-500' : 'text-slate-500'}`} />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* User Profile (Mock) */}
            <div className="p-4 border-t border-navy-700">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center text-white font-bold text-xs">
                        JD
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Juan Diaz</p>
                        <p className="text-xs text-slate-500">Ing. de Planta</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

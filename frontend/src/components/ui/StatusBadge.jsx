import React from 'react';

const StatusBadge = ({ status, type = 'dot' }) => {
    // Status mapping
    const styles = {
        operativa: { color: 'text-green-500', bg: 'bg-green-500', label: 'OPERATIVA' },
        mantenimiento: { color: 'text-red-500', bg: 'bg-red-500', label: 'MANTENIMIENTO' },
        detenida: { color: 'text-slate-500', bg: 'bg-slate-500', label: 'DETENIDA' },
        estable: { color: 'text-blue-400', bg: 'bg-blue-400', label: 'Estable' },
        sube: { color: 'text-green-400', bg: 'bg-green-400', label: 'Sube' },
        baja: { color: 'text-red-400', bg: 'bg-red-400', label: 'Baja' },
    };

    const config = styles[status.toLowerCase()] || styles.detenida;

    if (type === 'dot') {
        return (
            <div className="flex items-center">
                <span className={`text-xs font-bold mr-2 ${config.color}`}>{config.label}</span>
                <span className={`w-2 h-2 rounded-full ${config.bg}`}></span>
            </div>
        );
    }

    if (type === 'pill') {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-10 ${config.bg.replace('bg-', 'bg-')} ${config.color}`}>
                {config.label}
            </span>
        );
    }

    return null;
};

export default StatusBadge;

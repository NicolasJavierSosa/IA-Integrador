import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import StatusBadge from '../components/ui/StatusBadge';
import { maquinariaService, tipoMaquinariaService } from '../services/maquinariaService';
import {
    PlusIcon,
    FunnelIcon,
    ComputerDesktopIcon,
    WrenchScrewdriverIcon,
    BoltIcon,
    ScissorsIcon,
    TruckIcon,
    ArchiveBoxIcon,
    TrashIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Maquinarias = () => {
    const [machines, setMachines] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({ search: '', type: '' });
    const [newMachine, setNewMachine] = useState({
        nombre: '',
        tipo_maquinaria_id: '',
        disponible: true
    });

    // Fetch data on mount and when filters change
    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.type) params.tipo_maquinaria = filters.type;

            const [machinesData, typesData] = await Promise.all([
                maquinariaService.list(params),
                tipoMaquinariaService.list()
            ]);
            setMachines(machinesData);
            setTypes(typesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await maquinariaService.create(newMachine);
            setShowModal(false);
            setNewMachine({ nombre: '', tipo_maquinaria_id: '', disponible: true });
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Error creating machine:', error);
            alert('Error al crear la máquina');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta máquina?')) {
            try {
                await maquinariaService.delete(id);
                fetchData(); // Refresh list
            } catch (error) {
                console.error('Error deleting machine:', error);
            }
        }
    };

    const handleToggleStatus = async (e, machine) => {
        e.stopPropagation();
        try {
            await maquinariaService.update(machine.id, { disponible: !machine.disponible });
            fetchData(); // Refresh list to reflect changes
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado de la máquina');
        }
    };

    // Stats calculation
    const stats = [
        {
            label: 'Total Equipos',
            value: machines.length,
            icon: ComputerDesktopIcon,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Operativas',
            value: machines.filter(m => m.disponible).length,
            icon: BoltIcon,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            label: 'En Mantenimiento',
            value: machines.filter(m => !m.disponible).length,
            icon: WrenchScrewdriverIcon,
            color: 'text-red-500',
            bg: 'bg-red-500/10'
        },
    ];

    // Helper to get icon based on type name (simple mapping)
    const getIconForType = (typeName) => {
        const lower = typeName?.toLowerCase() || '';
        if (lower.includes('sierra')) return ScissorsIcon;
        if (lower.includes('camion') || lower.includes('monto')) return TruckIcon;
        if (lower.includes('secado')) return ArchiveBoxIcon;
        return BoltIcon; // Default
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Parque de Maquinaria</h2>
                    <p className="text-slate-400">Gestione el inventario y estado operativo de los equipos.</p>
                </div>
                <div className="flex gap-3">
                    <Button icon={PlusIcon} onClick={() => setShowModal(true)}>Nueva Máquina</Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-navy-800 p-4 rounded-xl border border-navy-700 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Buscar por nombre..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="w-full md:w-64">
                    <Select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        options={[
                            { value: '', label: 'Todos los tipos' },
                            ...types.map(t => ({ value: t.id, label: t.nombre }))
                        ]}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-navy-800 rounded-xl border border-navy-700 p-6 flex items-center">
                        <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center text-slate-500 py-12">Cargando equipos...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {machines.map((machine) => (
                        <div key={machine.id} className={`bg-navy-800 rounded-xl p-6 border-l-4 ${machine.disponible ? 'border-green-500' : 'border-red-500'} relative group`}>
                            <button
                                onClick={() => handleDelete(machine.id)}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>

                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-navy-900 text-slate-300`}>
                                    {React.createElement(getIconForType(machine.tipo_maquinaria?.nombre), { className: "w-6 h-6" })}
                                </div>
                                <StatusBadge status={machine.disponible ? 'Operativa' : 'Mantenimiento'} type="dot" />
                            </div>

                            <h3 className="font-bold text-white mb-1">{machine.nombre}</h3>
                            <p className="text-xs text-slate-400 mb-6">{machine.tipo_maquinaria?.nombre || 'Sin Tipo'}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-navy-700">
                                <span className="text-xs font-medium text-slate-400">Estado:</span>
                                <button
                                    onClick={(e) => handleToggleStatus(e, machine)}
                                    className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none cursor-pointer z-10 ${machine.disponible ? 'bg-green-500' : 'bg-slate-600'}`}
                                    title={machine.disponible ? "Desactivar" : "Activar"}
                                >
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${machine.disponible ? 'left-6' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-navy-800 rounded-xl border border-navy-700 p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Nueva Máquina</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input
                                label="Nombre del Equipo"
                                placeholder="Ej: Sierra Sin Fin #02"
                                value={newMachine.nombre}
                                onChange={(e) => setNewMachine({ ...newMachine, nombre: e.target.value })}
                                required
                            />

                            <Select
                                label="Tipo de Maquinaria"
                                value={newMachine.tipo_maquinaria_id}
                                onChange={(e) => setNewMachine({ ...newMachine, tipo_maquinaria_id: e.target.value })}
                                required
                                options={[
                                    { value: '', label: 'Seleccionar tipo...' },
                                    ...types.map(t => ({ value: t.id, label: t.nombre }))
                                ]}
                            />

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="disponible"
                                    checked={newMachine.disponible}
                                    onChange={(e) => setNewMachine({ ...newMachine, disponible: e.target.checked })}
                                    className="w-4 h-4 rounded border-navy-600 bg-navy-900 text-accent-600 focus:ring-accent-500"
                                />
                                <label htmlFor="disponible" className="text-sm text-slate-300">
                                    Equipo Operativo
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
                                <Button type="submit">Guardar Equipo</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maquinarias;

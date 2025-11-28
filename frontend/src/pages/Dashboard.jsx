import React from 'react';
import Card from '../components/ui/Card';

const Dashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Bienvenido a EcoWood Sys">
                    <p className="text-slate-400">
                        Seleccione una opción del menú lateral para comenzar.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

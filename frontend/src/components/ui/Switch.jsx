import React from 'react';

const Switch = ({ checked, onChange, label, activeColor = 'bg-green-500', inactiveColor = 'bg-slate-300' }) => {
    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none cursor-pointer ${checked ? activeColor : inactiveColor}`}
            >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${checked ? 'left-6' : 'left-1'}`}></div>
            </button>
            {label && <span className="text-sm text-slate-600">{label}</span>}
        </div>
    );
};

export default Switch;

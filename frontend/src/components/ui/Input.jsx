import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, className = '', unit, ...props }) => {
    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="mb-1.5 text-xs font-medium text-slate-400">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    className="w-full bg-navy-900 border border-navy-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    {...props}
                />
                {unit && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 text-xs">{unit}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Select = ({ label, options, value, onChange, className = '', ...props }) => {
    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="mb-1.5 text-xs font-medium text-slate-400">
                    {label}
                </label>
            )}
            <select
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors appearance-none"
                value={value}
                onChange={onChange}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Input;

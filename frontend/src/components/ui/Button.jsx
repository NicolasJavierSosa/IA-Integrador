import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    icon: Icon,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-accent-600 hover:bg-accent-500 text-white focus:ring-accent-500",
        secondary: "bg-navy-700 hover:bg-navy-600 text-white focus:ring-navy-500",
        outline: "border border-navy-600 text-slate-300 hover:bg-navy-800 focus:ring-navy-500",
        ghost: "text-slate-400 hover:text-white hover:bg-navy-800",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
        </button>
    );
};

export default Button;

import React from 'react';

const Card = ({ children, className = '', title, action }) => {
    return (
        <div className={`bg-navy-800 rounded-xl border border-navy-700 shadow-sm ${className}`}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-navy-700 flex justify-between items-center">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;

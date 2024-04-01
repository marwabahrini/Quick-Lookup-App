import React from 'react';

interface ButtonProps {
    onClick: () => void;
    disabled: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, className }) => {
    return (
        <button
            className={`bg-gray-900 text-white font-semibold py-2 px-4 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            Show information
        </button>
    );
};

export default Button;

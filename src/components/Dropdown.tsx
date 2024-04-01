import React from 'react';

interface DropdownProps {
    label: string;
    options: { label: string; value: string }[];
    onSelect: (selectedOption: string | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(event.target.value === '' ? null : event.target.value);
    };

    return (
        <div className="relative">
            <label className="block text-gray-700 mt-2 mb-2">{label}</label>
            <div className="relative">
                <select
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-gray-500"
                    onChange={handleChange}
                >
                    <option value="">Select {label}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <img src="/arrow-down.svg" alt="arrow down" className="h-3"/>
                </div>
            </div>
        </div>
    );
};

export default Dropdown;

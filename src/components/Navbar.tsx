import React from 'react';

const Navbar: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-20 bg-gray-900 text-white mb-12">
            <img src="/logo.png" alt="Logo" className="h-14" />
        </div>
    );
};

export default Navbar;

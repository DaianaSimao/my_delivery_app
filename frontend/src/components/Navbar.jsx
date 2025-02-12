import React from 'react';
import Logout from './Logout';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">My App</h1>
        <Logout />
      </div>
    </nav>
  );
};

export default Navbar;
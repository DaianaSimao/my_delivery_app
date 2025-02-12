import React from 'react';
import axios from 'axios';

const Logout = () => {
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('http://localhost:3000/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remover o token do localStorage
      localStorage.removeItem('token');

      // Exibir mensagem de sucesso
      alert('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
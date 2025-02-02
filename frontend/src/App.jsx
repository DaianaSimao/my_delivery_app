import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fazendo uma requisição GET para a API do Rails
    axios.get('http://localhost:3000/hello')  // Substitua pela URL da sua API Rails
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-red-600 mb-4">React + Tailwind + Rails API</h1>
        <p className="text-xl text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export default App;


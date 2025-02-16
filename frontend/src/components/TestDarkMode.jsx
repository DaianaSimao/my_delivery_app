// src/components/TestDarkMode.jsx
import React from 'react';

const TestDarkMode = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4">
      <p className="text-black dark:text-red-500"> {/* Use uma cor contrastante para teste */}
        Este texto deve ficar VERMELHO no dark mode.
      </p>
    </div>
  );
};

export default TestDarkMode;
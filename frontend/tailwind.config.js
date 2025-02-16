module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: [
    "./node_modules/flowbite/**/*.js" // Se estiver usando Flowbite
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [ require('flowbite/plugin')],
};

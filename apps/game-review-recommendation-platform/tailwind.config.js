const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/**/*.{html,ts}',  // Adjust for your project structure
    './libs/**/*.{html,ts}',  // Include library files if applicable
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

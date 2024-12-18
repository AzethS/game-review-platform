module.exports = {
  content: [
    './apps/**/*.{html,ts}', // Scan app files for Tailwind classes
    './libs/**/*.{html,ts}', // Include library files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

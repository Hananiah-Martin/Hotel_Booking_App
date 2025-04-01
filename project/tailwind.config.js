export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          200: '#FF7D68', // Light coral for focus rings
          500: '#FF5A5F', // Airbnb coral for button
          600: '#E04E53', // Hover state
        },
        gold: {
          200: '#D4AF37', // Subtle gold border
        },
        airbnb: {
          primary: '#FF385C',
          secondary: '#222222',
          light: '#717171',
        }
      }
    },
  },
  plugins: [],
}
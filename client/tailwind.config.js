/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FFFAF0',
          100: '#FFF7E6', // Canvas / Page Background: Vanilla Cream
          200: '#FDEFD2',
          300: '#FCE6BD',
        },
        rosewood: {
          50: '#FDF6F7',
          100: '#F9ECEE',
          200: '#F3D4D8',
          300: '#E7B2B8',
          400: '#D58C95',
          500: '#B46A72', // Primary Buttons & Key Call-to-Actions
          600: '#9F565E', // Deeper hover
          700: '#86434B',
          800: '#6E363D',
          900: '#5B2F34',
        },
        blush: {
          50: '#FEF8F9',
          100: '#FDF1F4',
          200: '#FBE2E8',
          300: '#F7C8D3', // Blush Petal: Soft borders & pastel pills
          400: '#F0A3B5',
          500: '#E47992',
        },
        tint: {
          DEFAULT: '#F3E8DE', // Faint border tint
          border: '#F3E8DE',
        },
        sage: {
          50: '#F7F8F4',
          100: '#EFF2E9',
          200: '#DEE4D2',
          300: '#C7D2B6',
          400: '#A8B58A', // Sage Leaf: Secondary badges, success, active highlights
          500: '#8E9E6D',
          600: '#717F53',
          700: '#56613F',
        },
        misty: {
          50: '#F4F6F8',
          100: '#E7ECF0',
          200: '#D3DCE4',
          300: '#A9B7C6', // Misty Sky: Secondary accent & subtle borders
          400: '#899BAF',
          500: '#6C8098',
        },
        lagoon: {
          50: '#F2F4F7',
          100: '#E1E6EB',
          200: '#C3CCD6',
          300: '#9EACBD',
          400: '#5F7285',
          500: '#425363',
          600: '#354352',
          700: '#2D3A47', // Midnight Lagoon: Main headings, body text
          800: '#232E3A',
          900: '#1B242E',
          950: '#121920',
        },
      },
    },
  },
  plugins: [],
}

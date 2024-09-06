/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-grey': '#eeeeee', 
        'med-grey': '#cccccc', 
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.white'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.light-grey'),
            },
            p: {
              color: theme('colors.med-grey'),
            },
            a: {
              color: theme('colors.light-grey'),
            },
            strong: {
              color: theme('colors.light-grey'),
            },
            code: {
              color: theme('colors.med-grey'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],

}

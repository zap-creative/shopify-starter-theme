const isProduction = process.env.NODE_ENV === 'production';
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

module.exports = {
  purge: {
    content: [
      './theme/**/*.liquid',
      './src/**/*.svelte',
    ],
    enabled: isProduction
  },
  corePlugins: {},
  plugins: [
    typography(),
    forms(),
  ],
  theme: {
    screens: {
      'sm': {
        min: '480px',
      },
      'tablet': {
        min: '640px',
      },
      'desktop': {
        min: '768px',
      },
      'widescreen': {
        min: '1216px',
      },
      'fullhd': {
        min: '1664px',
      },
      'sm-only': {
        min: '480px',
        max: '639px',
      },
      'tablet-only': {
        min: '640px',
        max: '767px',
      },
      'desktop-only': {
        min: '768px',
        max: '1215px',
      },
      'widescreen-only': {
        min: '1216px',
        max: '1663px',
      },
      'fullhd-only': {
        min: '1664px',
      },
      'widescreen-down': {
        max: '1663px',
      },
      'desktop-down': {
        max: '1215px',
      },
      'tablet-down': {
        max: '767px',
      },
      'sm-down': {
        max: '639px',
      },
      'touch': {
        raw: '(hover: none) and (pointer: coarse)'
      },
    },
  },
};

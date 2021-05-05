const isProduction = process.env.NODE_ENV === 'production';
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

const sans = ['-apple-system', 'BlinkMacSystemFont', 'Avenir\\ Next', 'Avenir', 'Segoe\\ UI', 'Helvetica\\ Neue', 'Helvetica', 'Ubuntu', 'Roboto', 'Noto', 'Arial', 'sans-serif'];
const serif = ['Iowan\\ Old\\ Style', 'Apple\\ Garamond', 'Baskerville', 'Times\\ New\\ Roman', 'Droid\\ Serif', 'Times', 'Source\\ Serif\\ Pro', 'serif', 'Apple\\ Color\\ Emoji', 'Segoe\\ UI\\ Emoji', 'Segoe\\ UI\\ Symbol'];
const mono = ['Menlo', 'Consolas', 'Monaco', 'Liberation\\ Mono', 'Lucida\\ Console', 'monospace'];

module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './theme/**/!(*.svg).liquid',
      './src/**/*.{js,svelte}',
    ],
    enabled: isProduction
  },
  corePlugins: {},
  plugins: [
    typography(),
    forms(),
  ],
  theme: {
    extend: {
      boxShadow: {
        inner: 'inset 0 0 12px 2px rgba(0, 0, 0, 0.06)',
      },
      container: {
        center: true,
      },
    },
    fontFamily: {
      'sans': sans,
      'serif': serif,
      'mono': mono,
      'heading': ['var(--cn-ff-header)', ...serif],
      'body': ['var(--cn-ff-body)', ...sans],
    },
    screens: {
      'small': {
        min: '528px',
      },
      'tablet': {
        min: '768px',
      },
      'desktop': {
        min: '1008px',
      },
      'widescreen': {
        min: '1344px',
      },
      'fullhd': {
        min: '1680px',
      },
      'small-only': {
        min: '528px',
        max: '767px',
      },
      'tablet-only': {
        min: '768px',
        max: '1007px',
      },
      'desktop-only': {
        min: '1008px',
        max: '1343px',
      },
      'widescreen-only': {
        min: '1344px',
        max: '1679px',
      },
      'widescreen-down': {
        max: '1679px',
      },
      'desktop-down': {
        max: '1343px',
      },
      'tablet-down': {
        max: '1007px',
      },
      'mobile': {
        max: '767px',
      },
      'touch': {
        raw: '(hover: none) and (pointer: coarse)'
      },
    },
  },
};

const isProduction = process.env.NODE_ENV === 'production';

const path = require('path');
const read = require('read-yaml');
const BrowserSync = require('browser-sync');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const {getSSLKeyPath, getSSLCertPath} = require('./utilities');

const config = read.sync('config.yml');
const storeURL = config.development.store;
const themeID = config.development.theme_id;

module.exports = (env) => ({
  mode: isProduction ? 'production' : 'development',
  entry: {
    theme: './src/js/theme.js',
    home: './src/js/home.js',
    cart: './src/js/cart.js',
    collection: './src/js/collection.js',
    customers: './src/js/customers.js',
    password: './src/js/password.js',
    product: './src/js/product.js',
    search: './src/js/search.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkhash:5].bundle.js',
    path: path.resolve(__dirname, 'theme/assets'),
  },
  optimization: {
    splitChunks: {
      // Shopify does not allow "~"
      automaticNameDelimiter: '-',
      cacheGroups: {
        defaultVendors: {
          filename: 'vendor.[chunkhash:5].bundle.js',
        },
      },
    },
  },
  watchOptions: {
    ignored: [path.resolve(__dirname, 'node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          /node_modules/
        ],
        use: [
          { loader: 'svelte-loader',
            options: { 
              emitCss: false,
              hotReload: false,
              preprocess: require('svelte-preprocess')({
                postcss: true,
                babel: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        loose: true,
                        // No need for babel to resolve modules
                        modules: false,
                        targets: {
                          // ! Very important. Target es6+
                          esmodules: true,
                        },
                      },
                    ],
                  ],
                },
              }),
              compilerOptions: {
                cssHash: ({ hash, css }) => `svelte-shopify-${hash(css)}`,
              },
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          /node_modules/
        ],
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          /node_modules/
        ],
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: false, // Don't resolve url(), all assets end up in assets directory
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          /node_modules/
        ],
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: false,
              url: false // Don't resolve url(), all assets end up in assets directory
            },
          },
          { loader: 'postcss-loader',
            options: {
              sourceMap: false,
            }
          },
          { loader: 'sass-loader',
            options: {
              sourceMap: false,
            }
          },
        ],
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          /node_modules/,
          /theme/
        ],
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          outputPath: '../snippets/', // path.resolve() doesn't seem to work correctly
          spriteFilename: 'sprites.svg.liquid',
        }
      },
    ],
  },
  stats: { children: false },
  plugins: [
    // Visualize size of webpack output files
    // 'static' mode works better with BrowserSync
    // and Themekit deploy
    new BundleAnalyzerPlugin({
      analyzerMode: env === 'analyze' ? 'static' : 'disabled',
      reportFilename: '../../report.html',
    }),
    
    // Only remove the bundle files generated,
    // other Shopify theme assets will end that should
    // not be lost
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['*.bundle.js'],
    }),

    // Extract CSS to external file to keep JS files smaller
    new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),

    // Extract SVG graphics to a single sprite
    new SpriteLoaderPlugin({ 
      plainSprite: true,
      spriteAttrs: {
        hidden: true,
        style: 'display: none;'
      }
    }),

    new BrowserSyncPlugin({
      https: {key: getSSLKeyPath(), cert: getSSLCertPath()},
      port: 3000,
      proxy: {
        target: `https://${storeURL}?preview_theme_id=${themeID}`,
        middleware: [
          ((req, res, next) => {
            // Add url paramaters for Shopify theme preview.
            // ?_fd=0 prevents domain forwarding, ?pb=0 hides 
            // the Shopify preview bar
            const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
            const queryStringComponents = ['_ab=0&_fd=0&_sc=1&pb=0'];
            req.url += prefix + queryStringComponents.join('&');
            next();
          }),
        ],
        proxyRes: [
          (proxyRes) => {
            // disable HSTS
            delete proxyRes.headers['strict-transport-security'];
          },
        ],
      },
      notify: false,
      files: [{
        // theme-ready.tmp is touched by theme-kit after 
        // uploaded to Shopify, so the browser is ready to refresh.
        match: ['theme-ready.tmp'],
        fn: async (event, file) => {
          if (event == 'change') {
            const bs = BrowserSync.get('bs-webpack-plugin');
            bs.reload(); 
          }
        },
      }],
      // Move snippet injection to </body>,
      // Shopify content_for_header causes injection to load
      // in head and break scripts
      snippetOptions: {
        rule: {
          match: /<\/body>/i,
          fn: (snippet, match) => {
            return snippet + match;
          },
        },
      },
    },
    {
      reload: false,
    }),
  ],
});

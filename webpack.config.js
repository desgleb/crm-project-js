const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// noinspection JSUnresolvedReference
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName =
              module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/) ??
              'package';
            return `npm.${packageName[1].replace('@', '')}`;
          },
        },
      },
    },
  };

  if (isProd) {
    config.minimizer = [
      '...',
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
        },
        generator: [
          {
            preset: 'webp',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  lossless: true,
                },
              },
            },
          },
        ],
      }),
    ];
  }

  return config;
};

const filename = (ext) => {
  let name;
  switch (ext) {
    case 'css':
      isDev
        ? (name = `styles/[name].${ext}`)
        : (name = `styles/[name].[contenthash].${ext}`);
      break;
    case 'js':
      isDev
        ? (name = `scripts/[name].${ext}`)
        : (name = `scripts/[name].[contenthash].${ext}`);
      break;
    default:
      isDev ? (name = `[name].${ext}`) : (name = `[name].[contenthash].${ext}`);
  }

  return name;
};

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      favicon: './favicon.png',
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
      chunkFilename: filename('css'),
    }),
  ];

  // noinspection JSCheckFunctionSignatures
  isDev ? base.push(new ESLintWebpackPlugin()) : false;

  isProd ? base.push(new BundleAnalyzerPlugin()) : false;

  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devServer: {
    port: 5000,
    hot: isDev,
    static: true,
  },
  devtool: isDev ? 'source-map' : false,
  entry: {
    main: './js/index.js',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
        generator: {
          filename: isDev
            ? 'images/[name][ext]'
            : 'images/[name][contenthash][ext]',
        },
      },
      {
        test: /\.(woff|woff2)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
        generator: {
          filename: isDev
            ? 'fonts/[name][ext]'
            : 'fonts/[name][contenthash][ext]',
        },
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
    ],
  },
  optimization: optimization(),
  output: {
    clean: true,
    crossOriginLoading: 'anonymous',
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: plugins(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@js': path.resolve(__dirname, 'src/js'),
      '@helpers': path.resolve(__dirname, 'src/js/helpers'),
      '@img': path.resolve(__dirname, 'src/img'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@svg': path.resolve(__dirname, 'src/icons'),
    },
  },
  target: isDev ? 'web' : 'browserslist',
};

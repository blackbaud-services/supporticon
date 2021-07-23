const path = require('path')
const camelCase = require('lodash/camelCase')
const upperFirst = require('lodash/upperFirst')
const { version } = require('./package.json')
const { styles, theme } = require('./styleguide.styles')

module.exports = {
  title: `Supporticon ${version}`,
  template: {
    favicon: 'https://www.blackbaud.com/favicon.ico'
  },
  styleguideDir: 'styleguide/components',
  serverPort: 3000,
  usageMode: 'expand',
  styles,
  theme,
  getComponentPathLine: componentPath => {
    const dirname = path.dirname(componentPath, '.js')
    const name = dirname.split('/').slice(-1)[0]
    const componentName = upperFirst(camelCase(name))
    return (
      'import ' + componentName + " from 'supporticon/components/" + name + "'"
    )
  },
  styleguideComponents: {
    Logo: path.join(__dirname, 'lib/components/logo')
  },
  sections: [
    {
      name: '',
      content: 'source/components/readme.md'
    },
    {
      name: 'Leaderboards',
      components: () => [
        path.resolve(__dirname, 'source/components/leaderboard', 'index.js'),
        path.resolve(
          __dirname,
          'source/components/fitness-leaderboard',
          'index.js'
        )
      ]
    },
    {
      name: 'Search',
      components: () => [
        path.resolve(__dirname, 'source/components/page-search', 'index.js')
      ]
    },
    {
      name: 'Metrics',
      components: () => [
        path.resolve(
          __dirname,
          'source/components/donation-ticker',
          'index.js'
        ),
        path.resolve(__dirname, 'source/components/progress-bar', 'index.js'),
        path.resolve(
          __dirname,
          'source/components/fitness-progress-bar',
          'index.js'
        ),
        path.resolve(__dirname, 'source/components/total-distance', 'index.js'),
        path.resolve(
          __dirname,
          'source/components/total-donations',
          'index.js'
        ),
        path.resolve(__dirname, 'source/components/total-duration', 'index.js'),
        path.resolve(
          __dirname,
          'source/components/total-elevation',
          'index.js'
        ),
        path.resolve(
          __dirname,
          'source/components/total-funds-raised',
          'index.js'
        ),
        path.resolve(
          __dirname,
          'source/components/total-supporters',
          'index.js'
        )
      ]
    },
    {
      name: 'Authentication',
      components: () => [
        path.resolve(__dirname, 'source/components/login-form', 'index.js'),
        path.resolve(
          __dirname,
          'source/components/provider-oauth-button',
          'index.js'
        ),
        path.resolve(
          __dirname,
          'source/components/reset-password-form',
          'index.js'
        ),
        path.resolve(__dirname, 'source/components/signup-form', 'index.js'),
        path.resolve(
          __dirname,
          'source/components/single-sign-on-link',
          'index.js'
        ),
        path.resolve(
          __dirname,
          'source/components/jg-connect-form',
          'index.js'
        ),
      ]
    },
    {
      name: 'Forms',
      components: () => [
        path.resolve(__dirname, 'source/components/address-search', 'index.js'),
        path.resolve(__dirname, 'source/components/charity-search', 'index.js'),
        path.resolve(
          __dirname,
          'source/components/create-fitness-form',
          'index.js'
        ),
        path.resolve(
          __dirname,
          'source/components/create-page-form',
          'index.js'
        ),
        path.resolve(
          __dirname,
          'source/components/create-post-form',
          'index.js'
        ),
        path.resolve(
          __dirname,
          'source/components/create-team-form',
          'index.js'
        ),
        path.resolve(
          __dirname,
          'source/components/join-team-form',
          'index.js'
        )
      ]
    }
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      ]
    }
  }
}

const path = require('path')
const camelCase = require('lodash/camelCase')
const upperFirst = require('lodash/upperFirst')
const { version } = require('./package.json')

module.exports = {
  title: `Supporticon | ${version}`,
  template: './styleguide.template.html',
  styleguideDir: 'styleguide/components',
  getComponentPathLine: (componentPath) => {
    const dirname = path.dirname(componentPath, '.js')
    const name = dirname.split('/').slice(-1)[0]
    const componentName = upperFirst(camelCase(name))
    return 'import ' + componentName + ' from \'supporticon/components/' + name + '\''
  },
  sections: [
    {
      name: 'Components',
      components: () => ([
        path.resolve(__dirname, 'source/components/leaderboard', 'index.js'),
        path.resolve(__dirname, 'source/components/page-search', 'index.js')
      ])
    },
    {
      name: 'Metrics',
      components: () => ([
        path.resolve(__dirname, 'source/components/total-donations', 'index.js'),
        path.resolve(__dirname, 'source/components/total-funds-raised', 'index.js'),
        path.resolve(__dirname, 'source/components/total-supporters', 'index.js')
      ])
    }
  ],
  updateWebpackConfig: (webpackConfig) => {
    webpackConfig.module.loaders.push(
     {
       test: /\.jsx?$/,
       include: path.join(__dirname, 'source'),
       loader: 'babel'
     },
     {
       test: /\.css$/,
       include: path.join(__dirname, 'node_modules', 'minimal.css'),
       loader: 'style!css?modules&importLoaders=1'
     }
   )

   webpackConfig.entry.push(path.join(__dirname, 'node_modules/minimal.css/minimal.css'))

   return webpackConfig
  }
}

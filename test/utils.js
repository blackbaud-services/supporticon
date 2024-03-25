const find = require('lodash/find')
const Enzyme = require('enzyme')
const Adapter = require('@cfaester/enzyme-adapter-react-18')

Enzyme.configure({ adapter: new Adapter.default() });

module.exports = {
  findRule: (rules, id) => {
    return find(rules, (rule) => rule.id === id)
  },

  getMountedElement: (el, selector) => {
    const wrapper = mount(el)
    return wrapper.find(selector)
  }
}

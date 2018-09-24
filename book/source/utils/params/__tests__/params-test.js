import { required } from '..'

describe('Utils | Params', () => {
  it('throws if a required error is missing', () => {
    const myFunction = (param = required()) => param
    const test = () => myFunction()
    expect(test).to.throw
  })

  it('does not throw if a required param is passed', () => {
    const myFunction = (param = required()) => param
    const test = () => myFunction(5)
    expect(test()).to.eql(5)
  })
})

import { stripTags } from '..'

describe('Utils | HTML', () => {
  describe('stripTags', () => {
    it('strips tags', () => {
      const test = () => stripTags('<p>Hello World</p>')
      expect(test()).to.eql('Hello World')
    })

    it('strips tags (more advanced)', () => {
      const test = () =>
        stripTags(`
        <article>
          <h1>Article Title</h1>
          <main>
            <p>Article <em>body</em> with a <a href="https://example.com" target="_blank">link</a>.</p>
          </main>
        </article>
      `)
      expect(test()).to.eql('Article Title Article body with a link.')
    })

    it('does not throw is no arg is passed', () => {
      const test = () => stripTags()
      expect(test()).to.eql('')
    })
  })
})

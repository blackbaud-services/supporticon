import { stripTags } from '..';

describe('Utils | HTML', () => {
  describe('stripTags', () => {
    it('strips tags', () => {
      const test = () => stripTags('<p>Hello World</p>');
      expect(test()).to.eql('Hello World');
    });

    it('strips tags (more advanced)', () => {
      const test = () =>
        stripTags(`
        <article>
          <h1>Article Title</h1>
          <main>
            <p>Article <em>body</em> with a <a href="https://example.com" target="_blank">link</a>.</p>
          </main>
        </article>
      `);
      expect(test()).to.eql('Article Title Article body with a link.');
    });

    it('preserves newlines from tags', () => {
      const test = () => stripTags('<p>Hello</p><p><a href="#">World</a></p>', true);
      expect(test()).to.eql('Hello\n\nWorld');
    });

    it('preserves newlines from input', () => {
      const test = () =>
        stripTags(
          `Lorem
ipsum`,
          true
        );
      expect(test()).to.eql('Lorem\nipsum');
    });

    it('does not throw is no arg is passed', () => {
      const test = () => stripTags();
      expect(test()).to.eql('');
    });
  });
});

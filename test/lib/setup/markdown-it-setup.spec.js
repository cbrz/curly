const sut = require('../../../lib/setup/markdown-it-setup');


describe('lib/setup/markdown-it-setup.js', function() {
  describe('setup()', function() {
    it('should return an object', function() {
      const result = sut.setup();
      expect(result).to.be.an('Object');
    });

    it('should render content to html', function() {
      const markdown = '# test header\n*test bold*\n';
      const expected = '<h1>test header</h1>\n<p><em>test bold</em></p>\n';

      const md = sut.setup();
      const result = md.render(markdown);
      expect(result).to.equal(expected);
    });
  });
});


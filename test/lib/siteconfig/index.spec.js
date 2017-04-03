const sut = require('../../../lib/siteconfig');

describe('lib/siteconfig', function() {
  it('should return an object with a parse function', function() {
    const result = sut.default;
    expect(result).to.be.an('Object');
    expect(result).to.include.key('parse');
  });

  describe('parse()', function() {
    beforeEach(function() {
      mockFs({
        '/path/to/dir': {
          'config.yaml': '' +
            'site:\n' +
            '  author: authortest\n',
        },
      });
    });

    afterEach(function() {
      mockFs.restore();
    });

    it('should parse a file and add to siteconfig', function() {
      const result = sut.parse('/path/to/dir', '/path/to/dir/config.yaml');
      expect(result.site.author).to.equal('authortest');
    });
  });
});


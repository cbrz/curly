const sut = require('../../../lib/setup/handlebars-setup');


describe('lib/setup/handlebars-setup.js', function() {
  describe('setup()', function() {
    it('should return an object', function() {
      const result = sut.setup();
      expect(result).to.be.an('Object');
    });

    it('should contain a helpers key', function() {
      const result = sut.setup();
      expect(result).to.include.key('helpers');
    });

    it('should contain a partials key', function() {
      const result = sut.setup();
      expect(result).to.include.key('partials');
    });

    it('should contain a template key', function() {
      const result = sut.setup();
      expect(result).to.include.key('template');
    });
  });
});

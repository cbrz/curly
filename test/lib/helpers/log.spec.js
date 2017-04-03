const sut = require('../../../lib/helpers/log');


describe('lib/helpers/log.js', function() {
  describe('log', function() {
    it('should return an object with defined log levels', function() {
      const result = sut.logger();
      expect(result).to.be.an('Object');
    });

    it('should return an object with key debug', function() {
      const result = sut.logger();
      expect(result).to.include.key('debug');
    });

    it('should return an object with key verbose', function() {
      const result = sut.logger();
      expect(result).to.include.key('verbose');
    });

    it('should return an object with key info', function() {
      const result = sut.logger();
      expect(result).to.include.key('info');
    });

    it('should return an object with key warn', function() {
      const result = sut.logger();
      expect(result).to.include.key('warn');
    });

    it('should return an object with key error', function() {
      const result = sut.logger();
      expect(result).to.include.key('error');
    });

    it('should return an object with key critical', function() {
      const result = sut.logger();
      expect(result).to.include.key('critical');
    });
  });
});

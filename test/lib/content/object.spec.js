const sut = require('../../../lib/content/object');


describe('lib/content/object', function() {
  describe('object', function() {
    it('should be an object', function() {
      const result = Object.assign({}, sut.default);
      expect(result).to.be.an('Object');
    });

    it('should have a null body', function() {
      const result = Object.assign({}, sut.default);
      expect(result.body).to.equal(null);
    });

    it('should have a date of Date.parse(0)', function() {
      const result = Object.assign({}, sut.default);
      expect(result.date).to.equal(Date.parse(0));
    });

    it('should have an empty array called children', function() {
      const result = Object.assign({}, sut.default);
      expect(result.children.length).to.equal(0);
    });

    it('should have an url with a value of "/"', function() {
      const result = Object.assign({}, sut.default);
      expect(result.url).to.equal('/');
    });

    it('should have a key named "childrenAsPages"', function() {
      const result = Object.assign({}, sut.default);
      expect(result).to.include.key('childrenAsPages');
    });

    it('should return different children values', function() {
      const resultA = Object.assign({}, sut.default);
      const resultB = Object.assign({}, sut.default);

      resultA.children = ['child'];
      expect(resultA.children.length).to.equal(1);
      expect(resultB.children.length).to.equal(0);
    });
  });
});

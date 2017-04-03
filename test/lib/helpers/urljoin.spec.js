const sut = require('../../../lib/helpers/urljoin');


describe('lib/helpers/urljoin', function() {
  it('should return a string', function() {
    const result = sut.urljoin('test', 'url', 'maker');
    expect(result).to.be.an('String');
  });

  it('should return a "/test/url/maker/"', function() {
    const result = sut.urljoin('test', 'url', 'maker');
    expect(result).to.equal('/test/url/maker/');
  });

  it('should return an array', function() {
    const result = sut.urljoin('test', 'url', 'maker');
    expect(result).to.have.string('/');
  });

  it('should begin with a "/"', function() {
    const result = sut.urljoin('test', 'url', 'maker');
    expect(result.charAt(0)).to.equal('/');
  });

  it('should end with a "/"', function() {
    const result = sut.urljoin('test', 'url', 'maker');
    expect(result.slice(-1)).to.equal('/');
  });

  it('should only contain "/" with an empty array', function() {
    const result = sut.urljoin();
    expect(result).to.equal('/');
  });
});

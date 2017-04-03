const sut = require('../../../lib/content/pagemaker');
const contentobject = require('../../helpers/contentobject-setup');


describe('lib/content/pagemaker', function() {
  const contentparent = contentobject.setup({url: '/post/'});
  const contentchildren = [
    contentobject.setup({url: '/child_01'}),
    contentobject.setup({url: '/child_02'}),
    contentobject.setup({url: '/child_03'}),
  ];
  contentparent.children = contentchildren;

  // object tests
  it('should return an array', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result).to.be.an('Array');
  });

  it('should return an array with length 3', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result.length).to.equal(3);
  });

  // correctness tests
  it('should return an array with max of 3 for all elements', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    result.forEach((r) => {
      expect(r.page.max).to.equal(3);
    });
  });

  it('should return current of 2 for middle', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[1].page.current).to.equal(2);
  });

  it('should return previous of 1 for middle', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[1].page.previous).to.equal(1);
  });

  it('should return previousurl of "/post/" for middle', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[1].page.previousurl).to.equal('/post/');
  });

  it('should return next of 3 for middle', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[1].page.next).to.equal(3);
  });

  it('should return nexturl of "/post/page/3/" for middle', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[1].page.nexturl).to.equal('/post/page/3/');
  });

  it('should return previous of null for first', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[0].page.previous).to.equal(null);
  });

  it('should return previousurl of null for first', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[0].page.previousurl).to.equal(null);
  });

  it('should return next of null for last', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[2].page.next).to.equal(null);
  });

  it('should return nexturl of null for last', function() {
    const result = sut.pagemaker(contentparent.url, 1, contentchildren);
    expect(result[2].page.nexturl).to.equal(null);
  });
});

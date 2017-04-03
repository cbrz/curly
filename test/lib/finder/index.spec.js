const sut = require('../../../lib/finder');

describe('lib/content/finder/index.js', function() {
  beforeEach(function() {
    mockFs({
      '/path/to/content': {
        'index.md': 'index',
        'index.swo': 'vim',
        'path': {
          'index.md': 'index',
          'index.swo': 'vim',
          'post_one.md': 'post_one',
          'post_two.md': 'post_two',
        },
        'ignore': {
          'ignore_one.md': 'ignoreme',
        },
        'about': {
          'index.md': 'index',
          'index.swo': 'vim',
        },
        'draft': {},
      },
    });
  });

  afterEach(function() {
    mockFs.restore();
  });

  describe('find()', function() {
    it('should return an array of file paths with all files', function(done) {
      const expected = [
        '/path/to/content/index.md',
        '/path/to/content/path/index.md',
        '/path/to/content/path/post_one.md',
        '/path/to/content/path/post_two.md',
        '/path/to/content/ignore/ignore_one.md',
        '/path/to/content/about/index.md',
      ];

      sut.find('/path/to/content')
        .then((result) => {
          expect(result.sort()).to.deep.equal(expected.sort());
          done();
        }).catch(done);
    });

    it('should return a value using callback for files', function(done) {
      const expected = 6;

      sut.find('/path/to/content', (data) => {
        return data.reduce((agg, value) => {
          agg = agg+1;
          return agg;
        }, 0);
      })
      .then((result) => {
        expect(result).to.equal(expected);
        done();
      }).catch(done);
    });
  });

  describe('findIndexFiles()', function() {
    it('should return an array of file paths with index.md files',
        function(done) {
          const expected = [
            '/path/to/content/index.md',
            '/path/to/content/path/index.md',
            '/path/to/content/about/index.md',
          ];

          sut.findIndexFiles('/path/to/content')
            .then((result) => {
              expect(result.sort()).to.deep.equal(expected.sort());
              done();
            }).catch(done);
        });

    it('should return an array execpt ignored directories', function(done) {
        const ignore = [
          '/path/to/content/ignore/',
        ];
        const expected = [
          '/path/to/content/index.md',
          '/path/to/content/path/index.md',
          '/path/to/content/about/index.md',
        ];

        sut.findIndexFiles('/path/to/content', ignore)
          .then((result) => {
            expect(result.sort()).to.deep.equal(expected.sort());
            done();
          }).catch(done);
    });

    it('should return an empty array of file paths', function(done) {
      const expected = [];

      sut.findIndexFiles('/path/to/content/draft')
        .then((result) => {
          expect(result).to.deep.equal(expected);
          done();
        }).catch(done);
    });

    it('should return a value using callback for files', function(done) {
      const expected = 3;

      sut.findIndexFiles('/path/to/content', null, (data) => {
        return data.reduce((agg, value) => {
          agg = agg+1;
          return agg;
        }, 0);
      })
      .then((result) => {
        expect(result).to.equal(expected);
        done();
      }).catch(done);
    });
  });

  describe('findFiles()', function() {
    it('should return an array of file paths with non-index.md files',
        function(done) {
          const expected = [
            '/path/to/content/path/post_one.md',
            '/path/to/content/path/post_two.md',
            '/path/to/content/ignore/ignore_one.md',
          ];

          sut.findFiles('/path/to/content')
            .then((result) => {
              expect(result.sort()).to.deep.equal(expected.sort());
              done();
            }).catch(done);
        });

    it('should return an array except ignored directories', function(done) {
      const ignore = [
        '/path/to/content/ignore/',
      ];

      const expected = [
        '/path/to/content/path/post_one.md',
        '/path/to/content/path/post_two.md',
      ];

      sut.findFiles('/path/to/content', ignore)
        .then((result) => {
          expect(result.sort()).to.deep.equal(expected.sort());
          done();
        }).catch(done);
    });

    it('should return an empty array of file paths', function(done) {
      const expected = [];

      sut.findFiles('/path/to/content/draft')
        .then((result) => {
          expect(result).to.deep.equal(expected);
          done();
        }).catch(done);
    });

    it('should return a value using callback for files', function(done) {
      const expected = 3;

      sut.findFiles('/path/to/content', null, (data) => {
        return data.reduce((agg, value) => {
          agg = agg+1;
          return agg;
        }, 0);
      })
      .then((result) => {
        expect(result).to.equal(expected);
        done();
      }).catch(done);
    });
  });
});

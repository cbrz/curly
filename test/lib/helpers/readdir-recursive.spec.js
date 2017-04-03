const sut = require('../../../lib/helpers/readdir-recursive');
describe('lib/helpers/readdir-recursive.js', function() {
  beforeEach(function() {
    mockFs({
      '/path/to/dir': {
        'file1': 'file one',
        'file2': 'file two',
        'extradir': {
          'file3': 'file three',
          'file4': 'file four',
        },
        'emptydir': {},
      },
    });
  });

  afterEach(function() {
    mockFs.restore();
  });

  it('should return an array of all of the file paths', function(done) {
    const expected = [
      '/path/to/dir/emptydir',
      '/path/to/dir/extradir',
      '/path/to/dir/extradir/file3',
      '/path/to/dir/extradir/file4',
      '/path/to/dir/file1',
      '/path/to/dir/file2',
    ];
    sut.default('/path/to/dir')
      .then(function(result) {
        expect(result.sort()).to.deep.equal(expected.sort());
        done();
      }).catch(done);
  });

  it('should return an empty array', function(done) {
    const expected = [];
    sut.default('/path/to/dir/emptydir')
      .then(function(result) {
        expect(result).to.deep.equal(expected);
        expect(result.length).to.equal(0);
        done();
      }).catch(done);
  });

  describe('sync()', function() {
    it('should return an array of file paths', function() {
      const expected = [
        '/path/to/dir/emptydir',
        '/path/to/dir/extradir',
        '/path/to/dir/extradir/file3',
        '/path/to/dir/extradir/file4',
        '/path/to/dir/file1',
        '/path/to/dir/file2',
      ];

      const result = sut.sync('/path/to/dir');
      expect(result.sort()).to.deep.equal(expected.sort());
    });

    it('should return an empty array', function() {
      const expected = [];

      const result = sut.sync('/path/to/dir/emptydir');
      expect(result).to.deep.equal(expected);
      expect(result.length).to.equal(0);
    });
  });
});

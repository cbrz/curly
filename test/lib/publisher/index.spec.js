const fs = require('fs-promise');

const sut = require('../../../lib/publisher');
const siteconfigSetup = require('../../helpers/siteconfig-setup');
const contentobjectSetup = require('../../helpers/contentobject-setup');


describe('lib/publisher/index', function() {
  const siteconfig = siteconfigSetup.setup();
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('publisher()', function() {
    const renderer = {
      render: sandbox.stub().returns('render'),
    };

    it('should return an object', function() {
      const result = sut.publisher(siteconfig, renderer);
      expect(result).to.be.an('Object');
    });

    it('should include a key "publish"', function() {
      const result = sut.publisher(siteconfig, renderer);
      expect(result).to.include.key('publish');
    });

    /* Obsolete
     *
    it('should include a key "publishFile"', function() {
      const result = sut.publisher(siteconfig,renderer);
      expect(result).to.include.key('publishFile');
    });
    */
  });

  describe('publish()', function() {
    // nothing to test... no return value and cannot stub/spy to check if it
    // went down the correct path.
  });

  describe('publishIndex()', function() {
    const render = sandbox.stub().returns('render');
    const build = sandbox.stub().returns('build');
    const data = contentobjectSetup.setup();
    const children = [
      contentobjectSetup.setup(),
      contentobjectSetup.setup(),
    ];
    data.childrenAsPages = sandbox.stub().returns(children);

    it('should call render function', async function() {
      sut.publishIndex(siteconfig, render, build, data);
      expect(render.called).to.equal(true);
    });

    it('should call build function', async function() {
      sut.publishIndex(siteconfig, render, build, data);
      expect(build.called).to.equal(true);
    });
  });

  describe('publishFile()', function() {
    const render = sandbox.stub().returns('render');
    const build = sandbox.stub().returns('build');
    const data = contentobjectSetup.setup();

    it('should call render function once', async function() {
      sut.publishFile(siteconfig, render, build, data);
      expect(render.calledOnce).to.equal(true);
    });

    it('should call build function once', async function() {
      sut.publishFile(siteconfig, render, build, data);
      expect(build.called).to.equal(true);
    });
  });

  describe('publishPublic', function() {
    const siteconfig = siteconfigSetup.setup();
    beforeEach(function() {
      mockFs({
        '/path/to/dir': {
          'layouts': {
            'default': {
              'public': {
                'dir': {
                  'file.js': 'file',
                },
              },
            },
          },
          'publish': {},
        },
      });
    });

    afterEach(function() {
      mockFs.restore();
    });

    it('should copy public file into publish directory', async function() {
      await sut.publishPublic(siteconfig);

      const result = fs.existsSync('/path/to/dir/publish/dir/file.js');
      expect(result).to.equal(true);
    });
  });

  describe('build()', function() {
    beforeEach(function() {
      mockFs({
        '/path/to/dir': {},
      });
    });

    afterEach(function() {
      mockFs.restore();
    });

    it('should create directory', async function() {
      const file = '/path/to/dir/somedir/somefile.js';
      await sut.build(file, 'content');
      expect(fs.existsSync('/path/to/dir/somedir')).to.equal(true);
    });

    it('should create file', async function() {
      const file = '/path/to/dir/somedir/somefile.js';
      await sut.build(file, 'content');
      expect(fs.existsSync('/path/to/dir/somedir/somefile.js')).to.equal(true);
    });
  });

  describe('destroy()', function() {
    beforeEach(function() {
      mockFs({
        '/path/to/dir': {
          'somedir': {
            'somefile.js': 'content',
          },
        },
      });
    });

    afterEach(function() {
      mockFs.restore();
    });

    it('should remove directory contents', async function() {
      const file = '/path/to/dir/somedir/somefile.js';
      await sut.destroy(file, 'content');
      expect(!fs.existsSync('/path/to/dir/somedir/somefile.js')).to.equal(true);
    });
  });
});

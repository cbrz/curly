const siteconfigSetup = require('../../helpers/siteconfig-setup');
const sut = require('../../../lib/content/factory');

describe('lib/content/factory', function() {
  describe('factory()', function() {
    it('should be an object', function() {
      const result = sut.default();
      expect(result).to.be.an('Object');
    });

    it('should return a function with a create key', function() {
      const result = sut.default();
      expect(result).to.include.key('create');
    });

    it('should return a function with a parse key', function() {
      const result = sut.default();
      expect(result).to.include.key('parse');
    });
  });

  describe('create()', function() {
    const siteconfig = siteconfigSetup.setup();

    it('should return an object', async function() {
      const result = await sut.create(siteconfig);
      expect(result).to.be.an('Object');
    });

    it('should return an object with a null body', async function() {
      const result = await sut.create(siteconfig);
      expect(result.body).to.equal(null);
    });

    it('should return a date equal to zero', async function() {
      const result = await sut.create(siteconfig);
      expect(result.date).to.equal(Date.parse(0));
    });

    it('should have an empty array', async function() {
      const result = await sut.create(siteconfig);
      expect(result.children).to.deep.equal([]);
    });

    it('should have an url of "/"', async function() {
      const result = await sut.create(siteconfig);
      expect(result.url).to.equal('/');
    });

    it('should have pagelimit of 1', async function() {
      const result = await sut.create(siteconfig);
      expect(result.pagelimit).to.equal(1);
    });

    it('should have the same site as siteconfig', async function() {
      const result = await sut.create(siteconfig);
      expect(result.site.production).to.equal(siteconfig.site.production);
      expect(result.site.development).to.equal(siteconfig.site.development);
    });

    it('should contain different a urls as the other object', async function() {
      const resultA = await sut.create(siteconfig, '/sitea');
      const resultB = await sut.create(siteconfig, '/siteb');

      expect(resultA.url).to.not.equal(resultB.url);
    });

    it('should contain a different site object', async function() {
      const resultA = await sut.create(siteconfig, '/sitea');

      const siteconfigB = siteconfigSetup.setup({
        site: {
          production: 'http://production.site',
          development: 'http://development.site',
        },
      });
      const resultB = await sut.create(siteconfigB, '/siteb');

      expect(resultA.site).to.not.deep.equal(resultB.site);
    });
  });

  describe('parse()', function() {
    const siteconfig = siteconfigSetup.setup();

    beforeEach(function() {
      const mtime = Date.parse(1);
      const body = 'test body\n';
      const frontMatter = '---\ntitle: test title\n---\n';
      const content = frontMatter + body;
      mockFs({
        '/path/to/dir/content': {
          'index.md': mockFs.file({content, mtime}),
          'file.md': mockFs.file({content, mtime}),
          'post': {
            'index.md': mockFs.file({content, mtime}),
            'file.md': mockFs.file({content, mtime}),
          },
        },
      });
    });

    afterEach(function() {
      mockFs.restore();
    });

    it('should return an object', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/file.md');
      expect(result).to.be.an('Object');
    });

    it('should have a body equal "test body\\n"', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/file.md');
      expect(result.body).to.equal('test body\n');
    });

    it('should include a key of title', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/file.md');
      expect(result).to.include.key('title');
    });

    it('should have a title equal "test title"', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/file.md');
      expect(result.title).to.equal('test title');
    });

    it('should use the mtime as date', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/file.md');
      expect(result.date).to.deep.equal(new Date(Date.parse(1)));
    });

    it('should have a url equal "/file/"', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/file.md');
      expect(result.url).to.equal('/file/');
    });

    it('should have a url equal to "/"', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/index.md');
      expect(result.url).to.equal('/');
    });

    it('should have a url equal "/post/file/"', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/post/file.md');
      expect(result.url).to.equal('/post/file/');
    });

    it('should have a url equal to "/post/"', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/post/index.md');
      expect(result.url).to.equal('/post/');
    });

    it('should have a site object', async function() {
      const result = await sut.parse(
          siteconfig, '/path/to/dir/content/file.md');
      expect(result.site).to.be.an('Object');
    });

    it('should have different objects', async function() {
      const resultA = await sut.parse(
          siteconfig, '/path/to/dir/content/file.md');
      const resultB = await sut.parse(
          siteconfig, '/path/to/dir/content/post/index.md');
      expect(resultA.url).to.not.equal(resultB.url);
    });
  });
});

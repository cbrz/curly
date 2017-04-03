const sut = require('../../../lib/publisher/renderer');
const siteconfigSetup = require('../../helpers/siteconfig-setup');
const contentobjectSetup = require('../../helpers/contentobject-setup');


describe('lib/publisher/renderer', function() {
  const siteconfig = siteconfigSetup.setup();
  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    mockFs({
      '/path/to/dir/layouts': {
        'default': {
          'partials': {
            'partial_parent.hbs': 'partial',
            'folder': {'partial_child.hbs': 'partial'},
          },
          'templates': {'index.hbs': 'template'},
        },
        'theme': {
          'partials': {
            'partial_parent.hbs': 'partial',
            'folder': {'partial_child.hbs': 'partial'},
          },
          'templates': {'index.hbs': 'template'},
        },
      },
    });
  });

  afterEach(function() {
    sandbox.restore();
    mockFs.restore();
  });

  describe('setup()', function() {
    it('should return an object', function() {
      const result = sut.setup(siteconfig);
      expect(result).to.be.an('Object');
    });

    it('should include a key named render', function() {
      const result = sut.setup(siteconfig);
      expect(result).to.include.key('render');
    });
  });

  describe('render()', function() {
    let markdownStub;
    let templateStub;

    beforeEach(function() {
      markdownStub = {
        render: sandbox.stub().returns('<p>markdown</p>'),
      };

      templateStub = {
        index: sandbox.stub().returns('index'),
        post_post01: sandbox.stub().returns('post_post01'),
      };

      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should call markdown.render', function() {
      const data = contentobjectSetup.setup({body: 'non-null-body'});

      sut.render(markdownStub, templateStub, data);
      expect(markdownStub.render.called).to.equal(true);
    });

    it('should not call markdown.render on null body', function() {
      const data = contentobjectSetup.setup();
      data.body = null;

      sut.render(markdownStub, templateStub, data);
      expect(markdownStub.render.called).to.equal(false);
    });

    it('should use index template', function() {
      const data = contentobjectSetup.setup();

      sut.render(markdownStub, templateStub, data);
      expect(templateStub.index.called).to.equal(true);
    });

    it('should default to index template', function() {
      const data = contentobjectSetup.setup({url: 'post/post02'});

      sut.render(markdownStub, templateStub, data);
      expect(templateStub.index.called).to.equal(true);
    });

    it('should use post_post01 template', function() {
      const data = contentobjectSetup.setup({url: 'post/post01'});

      sut.render(markdownStub, templateStub, data);
      expect(templateStub.index.called).to.equal(false);
    });
  });

  describe('compileTemplates()', function() {
    const handlebarsStub = {
      compile: sandbox.stub().returns('compile'),
      registerPartial: sandbox.stub().returns('register'),
    };

    it('should call compile', function() {
      sut.compileTemplates(
          handlebarsStub, '/path/to/dir/layouts/default/templates');
      expect(handlebarsStub.compile.called).to.equal(true);
    });
  });

  describe('pathToHbsKey()', function() {
    it('should strip directory', function() {
      const result = sut.pathToHbsKey(
          '/path/to/dir/layouts/default/templates/index.hbs',
          '/path/to/dir/layouts/default/templates');
      expect(result).to.not.have.string(
          '/path/to/dir/layouts/default/templates');
    });

    it('should contain underscores', function() {
      const result = sut.pathToHbsKey(
          '/path/to/dir/layouts/default/templates/folder/index.hbs',
          '/path/to/dir/layouts/default/templates');
      expect(result).to.have.string('_');
    });

    it('should not have an extension', function() {
      const result = sut.pathToHbsKey(
          '/path/to/dir/layouts/default/templates/index.hbs',
          '/path/to/dir/layouts/default/templates');
      expect(result).to.not.have.string('.');
    });
  });

  describe('registerPartials()', function() {
    const handlebarsStub = {
      registerPartial: sandbox.stub().returns('register'),
    };

    it('should call registerPartial', function() {
      sut.registerPartials(
          handlebarsStub, '/path/to/dir/layouts/default/partials');
      expect(handlebarsStub.registerPartial.called).to.equal(true);
    });
  });
});

import markdownIt from 'markdown-it';


// return markdown-it instance with plugins
export const setup = (options={}) => {
  const settings = Object.assign({}, {
    html: false,
    linkify: true,
    typographer: true,
  }, options);
  const markdown = markdownIt(settings);

  /*
  const markdown = markdownIt({
    html: false,
    linkify: true,
    typographer: true,
  });
  */

  /** BEGIN MARKDOWNIT PLUGIN SETUP SECTION **/

  /* example
   markdown.use(require('markdown-it-footnote'));
   */
  markdown
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-video'));

  /** END MARKDOWNIT PLUGIN SETUP SECTION **/

  return markdown;
};


export default setup;

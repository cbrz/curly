// Curly Directory Constants
export const DIR = {
  LAYOUTS: 'layouts',
  CONTENT: 'content',
  HANDLEBARS: {
    PARTIALS: 'partials',
    TEMPLATES: 'templates',
  },
  PUBLIC: 'public',
  PUBLISH: 'publish',
};


// Curly Default Constants
export const DEFAULTS = {
  DATE: Date.parse(0),
  LAYOUT: 'default',
  PAGELIMIT: 10,
  PORT: 3000,
  SITECONFIG: {
    dir: {},
    site: {
      production: 'http://localhost:3000',
      development: 'http://localhost:3000',
    },
    render: {},
  },
  SKEL: 'skel',
  TEMPLATENAME: 'index',
  URL: '/',
};


// Curly Extension Constants
export const EXT = {
  HANDLEBARS: '.hbs',
  HTML: '.html',
  MARKDOWN: '.md',
};


// Curly File Constants
export const FILE = {
  SITE: {
    CONFIG: 'config.yaml',
  },
  PUBLISHER: {
    INDEX: 'index.html',
    PAGE: 'page',
  },
  CONTENT: {
    INDEX: 'index.md',
  },
  LAYOUTS: {
    INDEX: 'index.hbs',
  },
};


export const LOGDESCRIPTIONS = {
  DEBUG: 'DEBUG',
  VERBOSE: 'VERBOSE',
  INFO: 'INFO',
  WARN: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};


// Curly Log Level constants
export const LOGLEVELS = {
  NOTSET: 0,
  DEBUG: 10,
  VERBOSE: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  CRITICAL: 60,
};


export default {DIR, DEFAULTS, EXT, FILE, LOGDESCRIPTIONS, LOGLEVELS};

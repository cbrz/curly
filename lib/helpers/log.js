import chalk from 'chalk';
import sprintfJs from 'sprintf-js';

import {
  LOGDESCRIPTIONS,
  LOGLEVELS} from '../constants'; // eslint-disable-line no-unused-vars


/* IMPORTANT NOTE:
 * Storing logging instance internally, and providing access through logger.
 * Other alternative could be setting as a global... or using a singleton, but
 * this seemed a bit cleaner.
 */


let loglevel = LOGLEVELS.NOTSET;

// object with different logging levels and predefined colors
const instance = {
  debug: (...message) => {
    if (loglevel <= LOGLEVELS.DEBUG) {
      console.log(
          chalk.green(formatMessage(LOGDESCRIPTIONS.DEBUG, ...message)));
    }
  },
  verbose: (...message) => {
    if (loglevel <= LOGLEVELS.VERBOSE) {
      console.log(
          chalk.blue(formatMessage(LOGDESCRIPTIONS.VERBOSE, ...message)));
    }
  },
  info: (...message) => {
    if (loglevel <= LOGLEVELS.INFO) {
      console.log(formatMessage(LOGDESCRIPTIONS.INFO, ...message));
    }
  },
  warn: (...message) => {
    if (loglevel <= LOGLEVELS.WARN) {
      console.log(
          chalk.yellow(formatMessage(LOGDESCRIPTIONS.WARN, ...message)));
    }
  },
  error: (...message) => {
    if (loglevel <= LOGLEVELS.ERROR) {
      console.error(
          chalk.red(formatMessage(LOGDESCRIPTIONS.ERROR, ...message)));
    }
  },
  critical: (...message) => {
    if (loglevel <= LOGLEVELS.CRITICAL) {
      console.error(
          chalk.red.bold(
            formatMessage(LOGDESCRIPTIONS.CRITICAL, ...message)));
    }
  },
};


export const logger = () => {
  return instance;
};


export const setLogLevel = (level) => {
  if (!loglevel) {
    loglevel = level;
  }
};


const sprintf = sprintfJs.sprintf;


const formatMessage = (level, ...msg) => {
  return `${level}: ${timestamp()} - ${sprintf(...msg)}`;
};


const timestamp = () => `${new Date().toISOString()}`;


export default logger;

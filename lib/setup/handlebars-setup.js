import handlebars from 'handlebars';

const MONTHNAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];


// return handlebars instance with plugins
export const setup = () => {
  const hbs = handlebars.create();

  /** BEGIN HANDLEBARS REGISTER HELPERS SECTION **/

  /* Example:

   hbs.registerHelper('example', function() {
   return example.first + ' ' + example.last;
   });

   */

  // helper to format date strings
  hbs.registerHelper('formatDate', function(datestring) {
    const date = new Date(datestring);
    const day = date.getDate();
    const monthName = MONTHNAMES[date.getMonth()];
    const year = date.getFullYear();

    return monthName + ' ' + day.toString() + ', ' + year.toString();
  });

  hbs.registerHelper('getLength', function(list) {
    return list.length;
  });

  /** END HANDLEBARS REGISTER HELPERS SECTION **/

  return hbs;
};


export default setup;

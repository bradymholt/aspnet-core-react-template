var global = require('./global.tsx');
module.export = global;

// This will search for all ./tests/*.tsx files and require them so that they are added to the webpack bundle.
var context = require.context('./tests', true, /.+\.tsx?$/);
context.keys().forEach(context);
module.exports = context;

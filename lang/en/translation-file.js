/**
 * Script that generates a json file which we can upload to websites
 * like webstranslateit.comp and PhraseApp for translation.
 */
 
var fs = require('fs'),
    data = require('./lib/index.js');

fs.writeFileSync(__dirname + '/en.json', JSON.stringify(data));
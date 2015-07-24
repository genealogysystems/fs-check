/**
 * Script that generates a json file which we can upload to websites
 * like webstranslateit.comp and PhraseApp for translation.
 */
require('fs').writeFileSync(__dirname + '/en.json', JSON.stringify(require('./load-language')('en'), null, 2));
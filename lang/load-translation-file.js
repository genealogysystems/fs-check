/**
 * This script loads a translation file that has been downloaded from
 * webtranslateit or PhraseApp.
 */
var fs = require('fs'),
    path = require('path'),
    argv = require('minimist')(process.argv.slice(2)),
    translationFile = argv._[0];
  
if(!fs.existsSync(translationFile)){
  console.error('Could not open file');
  process.exit(1);
}

// Load file into memory
var translations = JSON.parse(fs.readFileSync(translationFile));
var lang = translations.code,
    langDir = path.join(__dirname, lang, 'lib');

// Make sure the directory exists
if(!fs.existsSync(path.join(__dirname, lang))){
  fs.mkdirSync(path.join(__dirname, lang));
}
if(!fs.existsSync(langDir)){
  fs.mkdirSync(langDir);
}

// Separate check titles from descriptions
var titles = {},
    descriptions = {};
for(var check in translations.checks){
  titles[check] = {title: translations.checks[check].title};
  descriptions[check] = translations.checks[check].description;
}

// Save check titles file
fs.writeFileSync(path.join(langDir, 'check-titles.json'), JSON.stringify(titles, null, 2));

// Save check descriptions
var checksDir = path.join(langDir, 'checks');
if(!fs.existsSync(checksDir)){
  fs.mkdirSync(checksDir);
}
for(var check in descriptions){
  fs.writeFileSync(path.join(checksDir, check + '.md'), descriptions[check]);
}

// Save help links file
fs.writeFileSync(path.join(langDir, 'help-links.json'), JSON.stringify(translations.help, null, 2));

// Save partials
var partialsDir = path.join(langDir, 'partials');
if(!fs.existsSync(partialsDir)){
  fs.mkdirSync(partialsDir);
}
for(var partial in translations.partials){
  fs.writeFileSync(path.join(partialsDir, partial + '.md'), translations.partials[partial]);
}
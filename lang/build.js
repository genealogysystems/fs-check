/**
 * Synchronously build all language files, or a specified set of language files
 */

var fs = require('fs'),
		path = require('path'),
		loadLang = require('./load-language'),
		argv = require('minimist')(process.argv.slice(2));
 
// Build all languages
if(argv._.length === 0){
	var files = fs.readdirSync(__dirname);
	for(var i = 0; i < files.length; i++){
		if(files[i].length === 2){
			buildLang(files[i]);	
		}
	}
}

// Build the languages specified by the user
else {
	for(var i = 0; i < argv._.length; i++){
		buildLang(argv._[i]);
	}
}

function buildLang(lang){
	fs.writeFileSync(path.join(__dirname, lang, 'fs-check-' + lang + '.js'), '(function(){FSCheck.language(' + JSON.stringify(loadLang(lang)) + ');}())');
}
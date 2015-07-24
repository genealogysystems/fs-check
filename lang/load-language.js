/**
 * Exports a function that synchronously loads the language data into memory
 * then returns it.
 */

var fs = require('fs'),
    path = require('path');

module.exports = function(lang){
	
	var langLib = path.join(__dirname, lang, 'lib');
	
	var data = {
		code: lang,
		help: require(path.join(langLib, 'help-links.json')),
		checks: require(path.join(langLib, 'check-titles.json')),
		partials: {}
	};
	
	// Load check descriptions
	for(var check in data.checks){
	  data.checks[check].description = fs.readFileSync(path.join(langLib, 'checks', check+'.md'), {encoding: 'utf8'});
	}
	
	// Load partials
	var partials = fs.readdirSync(path.join(langLib, 'partials'));
	for(var i = 0; i < partials.length; i++){
	  data.partials[path.basename(partials[i]).split('.')[0]] = fs.readFileSync(path.join(langLib, 'partials', partials[i]), {encoding: 'utf8'});
	}
	
	return data;
};
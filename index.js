var FSCheck = module.exports = require('./lib'),
		loadLang = require('./lang/load-language');

FSCheck.language(loadLang('en'));
FSCheck.language(loadLang('es'));
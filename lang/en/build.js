var fs = require('fs'),
    data = require('./lib/index.js'),
    header = '(function(){var data = ',
    footer = ';FSCheck.language(data);}())';

fs.writeFileSync('fs-check-en.js', header + JSON.stringify(data) + footer);
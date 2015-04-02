var FSCheck = require('../lib/index.js'),
    fs = require('fs'),
    readme = fs.createWriteStream(require('path').join(__dirname, '..', 'lib', 'checks', 'README.md'));
    
readme.write('# Checks\n');
readme.write('\nChecks are organized in two ways: by function signature and by type. The function signature refers to the signature of the matching fs-traversal callback that the check was designed to work with. The type refers to the type of opportunity that the check generates.\n');

readme.write('\n## Signature\n');
var signatures = FSCheck.signatures();
for(var i = 0; i < signatures.length; i++){
  var signature = signatures[i];
  readme.write('\n### ' + capitalize(signature) + '\n');
  
  var checks = FSCheck.signature(signature);
  for(var j = 0; j < checks.length; j++){
    var check = checks[j];
    readme.write('\n* ['+check.id+']('+check.id+'.js)');
  }
  readme.write('\n');
};

readme.write('\n## Type\n');
var types = FSCheck.types();
for(var i = 0; i < types.length; i++){
  var type = types[i];
  readme.write('\n### ' + capitalize(type) + '\n');
  
  var checks = FSCheck.type(type);
  for(var j = 0; j < checks.length; j++){
    var check = checks[j];
    readme.write('\n* ['+check.id+']('+check.id+'.js)');
  }
  readme.write('\n');
};

readme.end();

/**
 * http://stackoverflow.com/a/1026087/879121
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
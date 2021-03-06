var path = require('path'),
    fs = require('fs');

module.exports = function(name, opportunity) {
  if(process.env.BUILD_DOCS) {
    fs.writeFileSync(path.join(process.env.BUILD_DOCS, name),JSON.stringify(opportunity, function(key, value){
      if(key.indexOf('$') === 0){
        return;
      }
      return value;
    }));
  }
}
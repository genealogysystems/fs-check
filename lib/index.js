var checks = [
  require('./checks/birth-before-parents-birth.js'),
  require('./checks/child-before-parents-marriage.js'),
  require('./checks/death-before-birth.js')
];

// Group checks by ID
var ids = {};
for(var i = 0; i < checks.length; i++){
  ids[checks[i].id] = checks[i];
}

// Group checks by signature
var signatures = {};
for(var i = 0; i < checks.length; i++){
  var signature = checks[i].signature;
  if(!signatures[signature]){
    signatures[signature] = [];
  }
  signatures[signature].push(checks[i]);
}

// Groups checks by type
var types = {};
for(var i = 0; i < checks.length; i++){
  var type = checks[i].type;
  if(!types[type]){
    types[type] = [];
  }
  types[type].push(checks[i]);
}

module.exports = {

  /**
   * Get a check by ID
   */
  id: function(checkId){
    return ids[checkId];
  },
  
  /**
   * Get all checks that match a given signature
   */
  signature: function(signature){
    return signatures[signature];
  },
  
  /**
   * Get all checks that match a given type
   */
  type: function(type){
    return types[type];
  }

};
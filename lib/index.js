var checks = [
  require('./checks/birth-before-parents-birth.js'),
  require('./checks/child-before-parents-marriage.js'),
  require('./checks/death-before-birth.js'),
  require('./checks/duplicate-names.js'),
  require('./checks/many-alternate-names.js'),
  require('./checks/marriage-with-no-children.js'),
  require('./checks/missing-birth.js'),
  require('./checks/missing-birth-date.js'),
  require('./checks/missing-birth-formal-date.js'),
  require('./checks/missing-birth-normalized-place.js'),
  require('./checks/missing-birth-place.js'),
  require('./checks/missing-birth-source.js'),
  require('./checks/missing-death.js'),
  require('./checks/missing-death-date.js'),
  require('./checks/missing-death-formal-date.js'),
  require('./checks/missing-death-normalized-place.js'),
  require('./checks/missing-death-place.js'),
  require('./checks/missing-death-source.js'),
  require('./checks/missing-father.js'),
  require('./checks/missing-given-name.js'),
  require('./checks/missing-marriage-date.js'),
  require('./checks/missing-marriage-fact.js'),
  require('./checks/missing-marriage-formal-date.js'),
  require('./checks/missing-marriage-normalized-place.js'),
  require('./checks/missing-marriage-place.js'),
  require('./checks/missing-marriage-source.js'),
  require('./checks/missing-mother.js'),
  require('./checks/missing-name.js'),
  require('./checks/missing-parents.js'),
  require('./checks/missing-surname.js'),
  require('./checks/multiple-marriage-facts.js'),
  require('./checks/multiple-parents.js'),
  require('./checks/or-in-name.js'),
  require('./checks/unusual-characters-in-name.js')
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
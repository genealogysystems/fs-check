var utils = require('./util.js');

var checks = [
  require('./checks/birthBeforeParentsBirth.js'),
  require('./checks/childBeforeMarriage.js'),
  require('./checks/childrenTooClose.js'),
  require('./checks/deathBeforeBirth.js'),
  require('./checks/duplicateNames.js'),
  require('./checks/manyAlternateNames.js'),
  require('./checks/marriageAfterDeath.js'),
  require('./checks/marriageWithNoChildren.js'),
  require('./checks/missingBirth.js'),
  require('./checks/missingBirthDate.js'),
  require('./checks/missingBirthPlace.js'),
  require('./checks/missingBirthSource.js'),
  require('./checks/missingDeath.js'),
  require('./checks/missingDeathDate.js'),
  require('./checks/missingDeathPlace.js'),
  require('./checks/missingDeathSource.js'),
  require('./checks/missingFather.js'),
  require('./checks/missingGivenName.js'),
  require('./checks/missingMarriageDate.js'),
  require('./checks/missingMarriageFact.js'),
  require('./checks/missingMarriagePlace.js'),
  require('./checks/missingMarriageSource.js'),
  require('./checks/missingMother.js'),
  require('./checks/missingName.js'),
  require('./checks/missingParents.js'),
  require('./checks/missingSurname.js'),
  require('./checks/multipleMarriageFacts.js'),
  require('./checks/multipleParents.js'),
  require('./checks/orInName.js'),
  require('./checks/possibleDuplicates.js'),
  require('./checks/recordHints.js'),
  require('./checks/standardizeBirthDate.js'),
  require('./checks/standardizeBirthPlace.js'),
  require('./checks/standardizeDeathDate.js'),
  require('./checks/standardizeDeathPlace.js'),
  require('./checks/standardizeMarriageDate.js'),
  require('./checks/standardizeMarriagePlace.js'),
  require('./checks/unusualCharactersInName.js')
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

var languages = {};

module.exports = {

  all: function(){
    return checks;
  },

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
   * Get a list of all valid signatures
   */
  signatures: function(){
    var list = [];
    for(var s in signatures){
      list.push(s);
    }
    return list;
  },
  
  /**
   * Get all checks that match a given type
   */
  type: function(type){
    return types[type];
  },
  
  /**
   * Get a list of all valid types
   */
  types: function(){
    var list = [];
    for(var t in types){
      list.push(t);
    }
    return list;
  },
  
  /**
   * Add a language
   */
  addLanguage: function(data){
    languages[data.code] = data;
  },
  
  /**
   * Translate an opportunity
   */
  translate: function(opportunity, lang){
    if(languages[lang]){
      var translation = languages[lang].checks[opportunity.checkId];
      if(translation){
        opportunity.title = translation.title;
        opportunity.description = utils.markdown(translation.description, opportunity.template, languages[lang].partials);
      }
    }
  },
  
  /**
   * Expose useful internals
   */
  utils: {
    getFactYear: utils.getFactYear,
    getFactPlace: utils.getFactPlace,
    gensearchPerson: utils.gensearchPerson,
    gedcomxDate: require('gedcomx-date')
  }
  
};
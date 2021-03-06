var utils = require('./util'),
    help = require('./help');

// Index checks by ID
var ids = {};

// Index checks by signature
var signatures = {};

// Index checks by type
var types = {};

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
   * Add a custom check
   */
  add: function(check, templates){
    ids[check.id] = check;
    
    // Register signature
    var signature = check.signature;
    if(!signatures[signature]){
      signatures[signature] = [];
    }
    signatures[signature].push(check);
    
    // Register type
    var type = check.type;
    if(!types[type]){
      types[type] = [];
    }
    types[type].push(check);
    
    // Add language templates
    if(templates){
      for(var lang in templates){
        if(!languages[lang]){
          languages[lang] = {
            code: lang,
            help: {},
            checks: {}
          };
        }
        languages[lang].checks[check.id] = templates[lang];
      }
    }
  },
  
  /**
   * Remove a check.
   */
  remove: function(checkId){
    var check = ids[checkId];
    if(check){
      delete ids[checkId];
      
      var signature = check.signature;
      for(var i = 0; i < signatures[signature].length; i++){
        if(signatures[signature][i].id === checkId){
          signatures[signature].splice(i, 1);
          break;
        }
      }
      if(signatures[signature].length === 0){
        delete signatures[signature];
      }
      
      var type = check.type;
      for(var i = 0; i < types[type].length; i++){
        if(types[type][i].id === checkId){
          types[type].splice(i, 1);
          break;
        }
      }
      if(types[type].length === 0){
        delete types[type];
      }
      
      for(var lang in languages){
        delete languages[lang].checks[checkId];
      }
    }
  },
  
  /**
   * Add a language
   */
  language: function(data){
    languages[data.code] = data;
  },
  
  /**
   * Translate an opportunity
   */
  translate: function(opportunity, lang){
    if(!lang){
      throw new Error('Second parameter `lang` is required');
    }
    if(!languages[lang]){
      throw new Error('The given language is not defined: ' + lang);
    }
    if(languages[lang]){
      var translation = languages[lang].checks[opportunity.checkId];
      if(translation){
        opportunity.title = translation.title;
        opportunity.description = utils.markdown(translation.description, opportunity.template, languages[lang].partials);
      }
    }
  },
  
  /**
   * Get the title for a check
   */
  title: function(checkId, lang){
    if(!lang){
      throw new Error('Second parameter `lang` is required');
    }
    if(!languages[lang]){
      throw new Error('The given language is not defined: ' + lang);
    }
    if(languages[lang] && languages[lang].checks[checkId]){
      return languages[lang].checks[checkId].title;
    }
  },
  
  /**
   * Get the url and title for a help link
   */
  help: function(helpId, lang){
    if(!lang){
      throw new Error('Second parameter `lang` is required');
    }
    if(!languages[lang]){
      throw new Error('The given language is not defined: ' + lang);
    }
    if(Array.isArray(helpId)){
      var links = [];
      for(var i = 0; i < helpId.length; i++){
        links.push(_help(helpId[i], lang));
      }
      return links;
    } else {
      return _help(helpId, lang);
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

var checks = [
  require('./checks/birthBeforeParentsBirth'),
  require('./checks/childBeforeMarriage'),
  require('./checks/childrenTooClose'),
  require('./checks/deathBeforeBirth'),
  require('./checks/duplicateNames'),
  require('./checks/manyAlternateNames'),
  require('./checks/marriageAfterDeath'),
  require('./checks/marriageWithNoChildren'),
  require('./checks/missingBirth'),
  require('./checks/missingBirthDate'),
  require('./checks/missingBirthPlace'),
  require('./checks/missingBirthSource'),
  require('./checks/missingDeath'),
  require('./checks/missingDeathDate'),
  require('./checks/missingDeathPlace'),
  require('./checks/missingDeathSource'),
  require('./checks/missingFather'),
  require('./checks/missingGivenName'),
  require('./checks/missingMarriageDate'),
  require('./checks/missingMarriageFact'),
  require('./checks/missingMarriagePlace'),
  require('./checks/missingMarriageSource'),
  require('./checks/missingMother'),
  require('./checks/missingName'),
  require('./checks/missingParents'),
  require('./checks/missingSurname'),
  require('./checks/multipleMarriageFacts'),
  require('./checks/multipleParents'),
  require('./checks/orInName'),
  require('./checks/possibleDuplicates'),
  require('./checks/recordHints'),
  require('./checks/standardizeBirthDate'),
  require('./checks/standardizeBirthPlace'),
  require('./checks/standardizeDeathDate'),
  require('./checks/standardizeDeathPlace'),
  require('./checks/standardizeMarriageDate'),
  require('./checks/standardizeMarriagePlace'),
  require('./checks/unusualCharactersInName')
];

for(var i = 0; i < checks.length; i++){
  module.exports.add(checks[i]);
}

/**
 * Help link helper
 */
function _help(helpId, lang){
  if(languages[lang] && languages[lang].help[helpId]){
    return {
      title: languages[lang].help[helpId],
      url: help[helpId]
    };
  }
};
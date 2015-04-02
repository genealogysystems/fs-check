var fs = require('fs'),
    path = require('path');

var data = module.exports = {
  code: 'en',
  checks: {
    birthBeforeParentsBirth: {
      title: 'Person Born Before their Parent(s)'
    },
    childBeforeMarriage: {
      title: 'Child Born Before Marriage'
    },
    childrenTooClose: {
      title: 'Children Too Close'
    },
    deathBeforeBirth: {
      title: 'Person Died Before They Were Born'
    },
    duplicateNames: {
      title: 'Identical Names'
    },
    manyAlternateNames: {
      title: 'Many Alternate Names'
    },
    marriageAfterDeath: {
      title: 'Marriage After Death'
    },
    marriageWithNoChildren: {
      title: 'Marriage with no Children'
    },
    missingBirth: {
      title: 'Find a Birth'
    },
    missingBirthDate: {
      title: 'Find a Birth Date'
    },
    missingBirthPlace: {
      title: 'Find a Birth Place'
    },
    missingBirthSource: {
      title: 'Find a Birth Record'
    },
    missingDeath: {
      title: 'Find a Death'
    },
    missingDeathDate: {
      title: 'Find a Death Date'
    },
    missingDeathPlace: {
      title: 'Find a Death Place'
    },
    missingDeathSource: {
      title: 'Find a Death Record'
    },
    missingFather: {
      title: 'Missing a Father'
    },
    missingGivenName: {
      title: 'Missing a Given Name'
    },
    missingMarriageDate: {
      title: 'Find a Marriage Date'
    },
    missingMarriageFact: {
      title: 'Find a Marriage'
    },
    missingMarriagePlace: {
      title: 'Find a Marriage Place'
    },
    missingMarriageSource: {
      title: 'Find a Marriage Record'
    },
    missingMother: {
      title: 'Missing a Mother'
    },
    missingName: {
      title: 'Missing a Name'
    },
    missingParents: {
      title: 'Missing Parents'
    },
    missingSurname: {
      title: 'Missing a Surname'
    },
    multipleMarriageFacts: {
      title: 'Multiple Marriage Facts'
    },
    multipleParents: {
      title: 'Multiple Parent Relationships'
    },
    orInName: {
      title: 'Incorrect Alternate Name Format'
    },
    possibleDuplicates: {
      title: 'Possible Duplicate Persons'
    },
    recordHints: {
      title: 'Record Hints'
    },
    unusualCharactersInName: {
      title: 'Unusual Characters in a Name'   
    },
    standardizeBirthDate: {
      title: 'Standardize a Birth Date'
    },
    standardizeBirthPlace: {
      title: 'Standardize a Birth Place'
    },
    standardizeDeathDate: {
      title: 'Standardize a Death Date'
    },
    standardizeDeathPlace: {
      title: 'Standardize a Death Place'
    },
    standardizeMarriageDate: {
      title: 'Standardize a Marriage Date'
    },
    standardizeMarriagePlace: {
      title: 'Standardize a Marriage Place'
    }
  }
};

// Load check descriptions
for(var check in data.checks){
  data.checks[check].description = loadDescription(check);
}

// Load partials
data.partials = {};
var partials = fs.readdirSync(path.join(__dirname, 'partials'));
for(var i = 0; i < partials.length; i++){
  data.partials[path.basename(partials[i]).split('.')[0]] = fs.readFileSync(path.join(__dirname, 'partials', partials[i]), {encoding: 'utf8'});
}

function loadDescription(check){
  return fs.readFileSync(path.join(__dirname, 'checks', check+'.md'), {encoding: 'utf8'});
}
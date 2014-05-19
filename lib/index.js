module.exports = {
  person: {
    missingBirth: require('./person/missing-birth.js'),
    missingBirthDate: require('./person/missing-birth-date.js'),
    missingBirthFormalDate: require('./person/missing-birth-formal-date.js'),
    missingBirthPlace: require('./person/missing-birth-place.js'),
    missingBirthNormalizedPlace: require('./person/missing-birth-normalized-place.js'),
    missingDeath: require('./person/missing-death.js'),
    missingDeathDate: require('./person/missing-death-date.js'),
    missingDeathFormalDate: require('./person/missing-death-formal-date.js'),
    missingDeathPlace: require('./person/missing-death-place.js'),
    missingDeathNormalizedPlace: require('./person/missing-death-normalized-place.js')
  },
  personSource: {
    missingBirthSource: require('./personSource/missing-birth-source.js'),
    missingDeathSource: require('./personSource/missing-death-source.js')
  },
  marriage: {
    missingMarriageDate: require('./marriage/missing-marriage-date.js'),
  },
  marriageSource: {
    
  }
}
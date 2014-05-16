module.exports = {
  person: {
    missingBirth: require('./person/missing-birth.js'),
    missingBirthDate: require('./person/missing-birth-date.js'),
    missingBirthFormalDate: require('./person/missing-birth-formal-date.js'),
    missingBirthPlace: require('./person/missing-birth-place.js'),
    missingBirthNormalizedPlace: require('./person/missing-birth-normalized-place.js'),
    missingDeath: require('./person/missing-death.js'),
    missingDeathFormalDate: require('./person/missing-death-formal-date.js'),
    missingDeathNormalizedPlace: require('./person/missing-death-normalized-place.js')
  },
  personSource: {
    missingBirthSource: require('./personSource/missing-birth-source.js'),
    missingDeathSource: require('./personSource/missing-death-source.js')
  },
  marriage: {
    
  },
  marriageSource: {
    
  }
}
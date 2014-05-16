module.exports = {
  person: {
    missingBirth: require('./person/missing-birth.js'),
    missingBirthFormalDate: require('./person/missing-birth-formal-date.js'),
    missingBirthNormalizedPlace: require('./person/missing-birth-normalized-place.js'),
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
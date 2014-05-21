module.exports = {
  // function(Person)
  person: {
    deathBeforeBirth: require('./person/death-before-birth.js'),
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
  // function(Person, SourceRefs)
  personSource: {
    missingBirthSource: require('./personSource/missing-birth-source.js'),
    missingDeathSource: require('./personSource/missing-death-source.js')
  },
  // function(Wife, Husband, Marriage)
  marriage: {
    missingMarriageDate: require('./marriage/missing-marriage-date.js'),
    missingMarriageFormalDate: require('./marriage/missing-marriage-formal-date.js'),
    missingMarriagePlace: require('./marriage/missing-marriage-place.js'),
    missingMarriageNormalizedPlace: require('./marriage/missing-marriage-normalized-place.js'),
    missingMarriageFact: require('./marriage/missing-marriage-fact.js'),
    multipleMarriageFacts: require('./marriage/multiple-marriage-facts.js')
  },
  // function(Wife, Husband, Marriage, Sourcerefs)
  marriageSource: {
    
  },
  // function(Person, Mother, Father, ChildRelationship)
  child: {
    missingMother: require('./child/missing-mother.js'),
    missingFather: require('./child/missing-father.js')
  },
  // function(Person, Children)
  children: {
    
  },
  // function(Person, Parents)
  parents: {
    birthBeforeParentsBirth: require('./parents/birth-before-parents-birth.js'),
    missingParents: require('./parents/missing-parents.js')
  },
  // function(Person, Relationships, People)
  relationships: {
    marriageWithNoChildren: require('./relationships/marriage-with-no-children.js')
  }
}
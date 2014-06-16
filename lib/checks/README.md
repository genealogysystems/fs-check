# Checks

Checks are organized in two ways: by function signature and by type. The function signature refers to the signature of the matching fs-traversal callback that the check was designed to work with. The type refers to the type of opportunity that the check generates.

## Signature

### Parents

* [Person Born Before their Parent(s)](birthBeforeParentsBirth.js)
* [Missing Parents](missingParents.js)

### Relationships

* [Child Born Before Marriage](childBeforeMarriage.js)
* [Marriage with no Children](marriageWithNoChildren.js)
* [Multiple Parent Relationships](multipleParents.js)

### Person

* [Person Died Before They Were Born](deathBeforeBirth.js)
* [Duplicate Names](duplicateNames.js)
* [Many Alternate Names](manyAlternateNames.js)
* [Find a Birth](missingBirth.js)
* [Find a Birth Date](missingBirthDate.js)
* [Standardize a Birth Date](missingBirthFormalDate.js)
* [Standardize a Birth Place](missingBirthFormalPlace.js)
* [Find a Birth Place](missingBirthPlace.js)
* [Find a Death](missingDeath.js)
* [Find a Death Date](missingDeathDate.js)
* [Standardize a Death Date](missingDeathFormalDate.js)
* [Standardize a Death Place](missingDeathFormalPlace.js)
* [Find a Death Place](missingDeathPlace.js)
* [Missing a Given Name](missingGivenName.js)
* [Missing a Name](missingName.js)
* [Missing a Surname](missingSurname.js)
* [Incorrect Alternate Name Format](orInName.js)
* [Unusual Characters in a Name](unusualCharactersInName.js)

### PersonSource

* [Find a Birth Record](missingBirthSource.js)
* [Find a Death Record](missingDeathSource.js)

### Child

* [Missing a Father](missingFather.js)
* [Missing a Mother](missingMother.js)

### Marriage

* [Find a Marriage Date](missingMarriageDate.js)
* [Find a Marriage](missingMarriageFact.js)
* [Standardize a Marriage Date](missingMarriageFormalDate.js)
* [Standardize a Marriage Place](missingMarriageNormalizedPlace.js)
* [Find a Marriage Place](missingMarriagePlace.js)
* [Multiple Marriage Facts](multipleMarriageFacts.js)

### MarriageSource

* [Find a Marriage Record](missingMarriageSource.js)

## Type

### Problem

* [Person Born Before their Parent(s)](birthBeforeParentsBirth.js)
* [Child Born Before Marriage](childBeforeMarriage.js)
* [Person Died Before They Were Born](deathBeforeBirth.js)
* [Marriage with no Children](marriageWithNoChildren.js)

### Cleanup

* [Duplicate Names](duplicateNames.js)
* [Many Alternate Names](manyAlternateNames.js)
* [Standardize a Birth Date](missingBirthFormalDate.js)
* [Standardize a Birth Place](missingBirthFormalPlace.js)
* [Standardize a Death Date](missingDeathFormalDate.js)
* [Standardize a Death Place](missingDeathFormalPlace.js)
* [Standardize a Marriage Date](missingMarriageFormalDate.js)
* [Standardize a Marriage Place](missingMarriageNormalizedPlace.js)
* [Multiple Marriage Facts](multipleMarriageFacts.js)
* [Multiple Parent Relationships](multipleParents.js)
* [Incorrect Alternate Name Format](orInName.js)
* [Unusual Characters in a Name](unusualCharactersInName.js)

### Person

* [Find a Birth](missingBirth.js)
* [Find a Birth Date](missingBirthDate.js)
* [Find a Birth Place](missingBirthPlace.js)
* [Find a Death](missingDeath.js)
* [Find a Death Date](missingDeathDate.js)
* [Find a Death Place](missingDeathPlace.js)
* [Missing a Given Name](missingGivenName.js)
* [Missing a Name](missingName.js)
* [Missing a Surname](missingSurname.js)

### Source

* [Find a Birth Record](missingBirthSource.js)
* [Find a Death Record](missingDeathSource.js)
* [Find a Marriage Record](missingMarriageSource.js)

### Family

* [Missing a Father](missingFather.js)
* [Find a Marriage Date](missingMarriageDate.js)
* [Find a Marriage](missingMarriageFact.js)
* [Find a Marriage Place](missingMarriagePlace.js)
* [Missing a Mother](missingMother.js)
* [Missing Parents](missingParents.js)

# Checks

Checks are organized in two ways: by function signature and by type. The function signature refers to the signature of the matching fs-traversal callback that the check was designed to work with. The type refers to the type of opportunity that the check generates.

## Signature

### Parents

* [birthBeforeParentsBirth](birthBeforeParentsBirth.js)
* [missingParents](missingParents.js)

### Relationships

* [childBeforeMarriage](childBeforeMarriage.js)
* [marriageAfterDeath](marriageAfterDeath.js)
* [marriageWithNoChildren](marriageWithNoChildren.js)
* [multipleParents](multipleParents.js)

### Children

* [childrenTooClose](childrenTooClose.js)

### Person

* [deathBeforeBirth](deathBeforeBirth.js)
* [duplicateNames](duplicateNames.js)
* [manyAlternateNames](manyAlternateNames.js)
* [missingBirth](missingBirth.js)
* [missingBirthDate](missingBirthDate.js)
* [missingBirthPlace](missingBirthPlace.js)
* [missingDeath](missingDeath.js)
* [missingDeathDate](missingDeathDate.js)
* [missingDeathPlace](missingDeathPlace.js)
* [missingGivenName](missingGivenName.js)
* [missingName](missingName.js)
* [missingSurname](missingSurname.js)
* [orInName](orInName.js)
* [standardizeBirthDate](standardizeBirthDate.js)
* [standardizeBirthPlace](standardizeBirthPlace.js)
* [standardizeDeathDate](standardizeDeathDate.js)
* [standardizeDeathPlace](standardizeDeathPlace.js)
* [unusualCharactersInName](unusualCharactersInName.js)

### PersonSource

* [missingBirthSource](missingBirthSource.js)
* [missingDeathSource](missingDeathSource.js)

### Child

* [missingFather](missingFather.js)
* [missingMother](missingMother.js)

### Marriage

* [missingMarriageDate](missingMarriageDate.js)
* [missingMarriageFact](missingMarriageFact.js)
* [missingMarriagePlace](missingMarriagePlace.js)
* [multipleMarriageFacts](multipleMarriageFacts.js)
* [standardizeMarriageDate](standardizeMarriageDate.js)
* [standardizeMarriagePlace](standardizeMarriagePlace.js)

### MarriageSource

* [missingMarriageSource](missingMarriageSource.js)

### Duplicates

* [possibleDuplicates](possibleDuplicates.js)

### RecordHints

* [recordHints](recordHints.js)

## Type

### Problem

* [birthBeforeParentsBirth](birthBeforeParentsBirth.js)
* [childBeforeMarriage](childBeforeMarriage.js)
* [childrenTooClose](childrenTooClose.js)
* [deathBeforeBirth](deathBeforeBirth.js)
* [marriageAfterDeath](marriageAfterDeath.js)
* [possibleDuplicates](possibleDuplicates.js)

### Cleanup

* [duplicateNames](duplicateNames.js)
* [manyAlternateNames](manyAlternateNames.js)
* [multipleMarriageFacts](multipleMarriageFacts.js)
* [orInName](orInName.js)
* [standardizeBirthDate](standardizeBirthDate.js)
* [standardizeBirthPlace](standardizeBirthPlace.js)
* [standardizeDeathDate](standardizeDeathDate.js)
* [standardizeDeathPlace](standardizeDeathPlace.js)
* [standardizeMarriageDate](standardizeMarriageDate.js)
* [standardizeMarriagePlace](standardizeMarriagePlace.js)
* [unusualCharactersInName](unusualCharactersInName.js)

### Family

* [marriageWithNoChildren](marriageWithNoChildren.js)
* [missingFather](missingFather.js)
* [missingMarriageDate](missingMarriageDate.js)
* [missingMarriageFact](missingMarriageFact.js)
* [missingMarriagePlace](missingMarriagePlace.js)
* [missingMother](missingMother.js)
* [missingParents](missingParents.js)
* [multipleParents](multipleParents.js)

### Person

* [missingBirth](missingBirth.js)
* [missingBirthDate](missingBirthDate.js)
* [missingBirthPlace](missingBirthPlace.js)
* [missingDeath](missingDeath.js)
* [missingDeathDate](missingDeathDate.js)
* [missingDeathPlace](missingDeathPlace.js)
* [missingGivenName](missingGivenName.js)
* [missingName](missingName.js)
* [missingSurname](missingSurname.js)

### Source

* [missingBirthSource](missingBirthSource.js)
* [missingDeathSource](missingDeathSource.js)
* [missingMarriageSource](missingMarriageSource.js)
* [recordHints](recordHints.js)

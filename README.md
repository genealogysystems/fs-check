# fs-check
A Research Opportunity finder library for FamilySearch, utilizing the [FamilySearch-javascript-sdk](https://github.com/rootsdev/familysearch-javascript-sdk). Best paired with [fs-traversal](https://github.com/genealogysystems/fs-traversal) for maximum tasty goodness.

**TODO**

* Consider adding `difficulty` to the opportunity schema.

# Usage
````javascript
// TODO
````

## Node.js
Unsuported for now. Waiting on [this issue](https://github.com/rootsdev/familysearch-javascript-sdk/issues/8) in the FamilySearch Javascript SDK.

## Browser
Download [fs-check.js](fs-check.js) and enjoy.
(Packaged with love by [browserify](http://browserify.org/))

To rebuild run `npm run build` from the root directory.

# Tests

There is a very comprehensive test suite.
````bash
# To run the tests cd to the repo directory and run
mocha

# To generate the code coverage run
./coverage/generate.sh
````
Note: make sure you install [jscoverage](https://github.com/visionmedia/node-jscoverage) globally before generating coverage.



# Opportunity Schema
````javascript
{
  type: ''
  title: '',
  description: '',
  person: FamilySearch.Person(),
  findarecord: {},
  gensearch: {}
}
````

### type
The type of opportunity. Will be a string matching one of:

* `problem`
* `cleanup`
* `source`
* `person`
* `family`

### title
The title of the opportunity. Plain text only.

### description
A description of the opportunity, including hints, notes, best practices, and generally anything that may be useful.
The description may contain html.

### person
The FamilySearch person that this opportunity is for. `person` will be a `FamilySearch.Person()` object.

### findarecord
An object containing parameters to use for a Find-A-Record Search. Must be a valid object or `undefined`.
````javascript
{
  tags: ['birth']
  from: 1900,
  to: 1950,
  place: 'Provo, Utah, United States of America',
  radius: 10000
}
````

* `tags` - An array of tags to filter the search using. Possible values are `birth`, `marriage`, `death`, `census`, `misc`. Required.
* `from` - An integer that limits the Find-A-Record search to return collections containing records covering dates on or after `from`. May also be `undefined`.
* `to` - An integer that limits the Find-A-Record search to return collections containing records covering dates on or before `to`. May also be `undefined`.
* `place` - A String representing the place to search. Required.
* `radius` - The radius of the Find-A-Record Search in meters. May be `undefined`.

### gensearch
A gen-search object matching [schema](https://github.com/genealogysystems/gen-search#schema) or `undefined.

# Opportunities

### missingBirth(Person)
`person` - This opportunity will appear when there is no Birth fact or if the Birth fact has no place and date.

### missingBirthDate(Person)
`person` - This opportunity will appear when there is a Birth fact that has a place but no date.

### missingBirthFormalDate(Person)
`cleanup` - This opportunity will appear when there is a Birth fact for a person with an original date but no formal date.

### missingBirthNormalizedPlace(Person)
`cleanup` - This opportunity will appear when there is a Birth fact for a person with an original place but no normalized place.

### missingBirthPlace(Person)
`person` - This opportunity will appear when there is a Birth fact that has a date but no place.

### missingBirthSource(Person, SourceRefs)
`source` - This opportunity will appear when there is a Birth fact for a person with a place and date, and there is no sources attached to the person that are tagged "Birth".

### missingDeath(Person)
`person` - This opportunity will appear when there is no Death fact or if the Death fact has no place and date.

### missingDeathDate(Person)
`person` - This opportunity will appear when there is a Death fact that has a place but no date.

### missingDeathFormalDate(Person)
`cleanup` - This opportunity will appear when there is a Death fact for a person with an original date but no formal date.

### missingDeathNormalizedPlace(Person)
`cleanup` - This opportunity will appear when there is a Death fact for a person with an original place but no normalized place.

### missingDeathPlace(Person)
`person` - This opportunity will appear when there is a Death fact that has a date but no place.

### missingDeathSource(Person, SourceRefs)
`source` - This opportunity will appear when there is a Death fact for a person with a place and date, and there is no sources attached to the person that are tagged "Death".

### missingMarriageDate(Wife, Husband, Marriage)
`family` - This opportunity will appear when there is a Marriage fact that has a place but no date.

### missingMarriageFormalDate(Wife, Husband, Marriage)
`cleanup` - This opportunity will appear when there is a Marriage fact for a person with an original date but no formal date.

### TODO missingMarriageNormalizedPlace(Wife, Husband, Marriage)
`cleanup` - This opportunity will appear when there is a Marriage fact for a person with an original place but no normalized place.

### missingMarriagePlace(Wife, Husband, Marriage)
`family` - This opportunity will appear when there is a Marriage fact that has a date but no place.

### TODO missingMarriageSource(Wife, Husband, Marriage, SourceRefs)
`source` - This opportunity will appear when there is a Marriage fact for a person with a place and date, and there is no sources attached to the person that are tagged "Marriage".

### TODO multipleMarriageFacts(Wife, Husband, Marriage)
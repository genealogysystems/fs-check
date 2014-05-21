# fs-check
A Research Opportunity finder library for FamilySearch, utilizing the [FamilySearch-javascript-sdk](https://github.com/rootsdev/familysearch-javascript-sdk). Best paired with [fs-traversal](https://github.com/genealogysystems/fs-traversal) for maximum tasty goodness.

FSCheck is an object with opportunities arranged by function signature
````javascript
{
  // function(Person)
  person: {...},
  
  // function(Person, SourceRefs)
  personSource: {...},
  
  // function(Wife, Husband, Marriage)
  marriage: {...},
  
  // function(Wife, Husband, Marriage, Sourcerefs)
  marriageSource: {...},
  
  // function(Person, Children)
  children: {...},
  
  // function(Person, Parents)
  parents: {...},

   // function(Person, Relationships, People)
  relationships: {...}
}
````

# Usage

````javascript
var FS = FamilySearch.init({});

var traversal = FSTraversal(FS)
      .order('wrd')
      .person(function(person) {

        // Person opportunities
        _.each(FSCheck.person, function(check){
          addOpportunity(check(person));
        });

        // Person source opportunities
        person.$getSourceRefs().done(function(sourceResponse){
          _.each(FSCheck.personSource, function(check){
            addOpportunity(check(person, sourceResponse));
          });
        });

      });

// will be called with an opportunity object or undefined
function addOpportunity(opportunity){
  
  if(!opportunity) return;
  
  console.log(opportunity);

};

````

## Browser
Download [fs-check.js](fs-check.js) and enjoy.
(Packaged with love by [browserify](http://browserify.org/))

## Node.js
Unsuported for now. Waiting on [this issue](https://github.com/rootsdev/familysearch-javascript-sdk/issues/8) in the FamilySearch Javascript SDK.

# Opportunities
A list of the opportunities that fs-check will search for.

## Problem

* [Death before Birth](lib/person/death-before-birth.js)
* [Birth before Parents Birth](lib/parents/birth-before-parents-birth.js)
* [Child before Parents Marriage](lib/relationships/child-before-parents-marriage.js) - TODO
* [4 year birth gap](lib/children/birth-gap.js) - TODO When there are more than four years between two siblings
* [Marriage with no Children](lib/relationships/marriage-with-no-children.js)

## Cleanup

* [Missing Normalized Birth Date](lib/person/missing-birth-formal-date.js)
* [Missing Normalized Birth Place](lib/person/missing-birth-normalized-place.js)
* [Multiple Marriage Facts](lib/marriage/multiple-marriage-facts.js)
* [Missing Normalized Marriage Date](lib/marriage/missing-marriage-formal-date.js)
* [Missing Normalized Marriage Place](lib/marriage/missing-marriage-normalized-place.js)
* [Missing Normalized Death Date](lib/person/missing-death-formal-date.js)
* [Missing Normalized Death Place](lib/person/missing-death-normalized-place.js)
* [Multiple Parents](lib/relationships/multiple-parents) - TODO When there is more than 1 childOf ternary relationship

## Source

* [Missing Birth Source](lib/personSource/missing-birth-source.js)
* [Missing Marriage Source](lib/marriageSource/missing-marriage-source.js) - TODO
* [Missing Death Source](lib/personSource/missing-death-source.js)
* [Missing Census](lib/personSource/missing-census-source.js) - TODO When person lived in US or UK and should be on a census

## Person

* [Missing Birth](lib/person/missing-birth.js)
* [Missing Birth Date](lib/person/missing-birth-date.js)
* [Missing Birth Place](lib/person/missing-birth-place.js)
* [Missing Death](lib/person/missing-death.js)
* [Missing Death Date](lib/person/missing-death-date.js)
* [Missing Death Place](lib/person/missing-death-place.js)

## Family

* [Missing Parents](lib/parents/missing-parents.js) - TODO When both parents are missing
* [Missing Father](lib/parents/missing-father.js) - TODO When father is missing but mother is not
* [Missing Mother](lib/parents/missing-mother.js) - TODO When mother is missing but father is not
* [Missing Marriage](lib/marriage/missing-marriage.js) - TODO When there are no marriage facts on a couple, or the one there is missing date and place
* [Missing Marriage Date](lib/marriage/missing-marriage-date.js)
* [Missing Marriage Place](lib/marriage/missing-marriage-place.js)

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
The description usually contains html.

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
A gen-search object matching [schema](https://github.com/genealogysystems/gen-search#schema) or `undefined`.

# Contributing
Every pull request that adds a check should contain four things:

1. A check that returns ONE opportunity. (Look at existing checks and follow the conventions)
1. An update to [lib/index.js](lib/index.js) to register your check.
1. A set of test cases that provide 100% code coverage for your check.
1. An update to the README listing and linking your check.

Be careful not to add a check that overlaps with another check.

# Build
Run `npm run build` from the root directory.

# Tests

There is a very comprehensive test suite.
````bash
# To run the tests cd to the repo directory and run
mocha

# To generate the code coverage run
./coverage/generate.sh
````
Note: make sure you install [mocha](http://visionmedia.github.io/mocha/) and [jscoverage](https://github.com/visionmedia/node-jscoverage) globally before generating coverage.

# License
[MIT](LICENSE)
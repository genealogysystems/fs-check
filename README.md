# fs-check
Generate research opportunities for the [FamilySearch Family Tree](https://familysearch.org/tree/).

fs-check depends on the [FamilySearch-javascript-sdk](https://github.com/rootsdev/familysearch-javascript-sdk) and was designed to be paired with [fs-traversal](https://github.com/genealogysystems/fs-traversal).

# Usage

````javascript
// fs-check was designed to be paired with fs-traversal
var FS = FamilySearch.init({});
var traversal = FSTraversal(FS)
      .order('wrd')
      .person(function(person) {

        // Get a list of all checks that match the "person" function signature
        var checks = FSCheck.signature('person');
        for(var i = 0; i < checks.length; i++){
        
          // Call the check function to generate an opportunity
          var opportunity = checks[i].check(person);
          
          // Check functions return nothing (undefined) when there is
          // no opportunity. For example, the missingBirth check will
          // not return an opportunity for someone that has birth information
          if(opportunity){
            // Do something with it
          }
        }

      });
      
// Checks can be called by type (useful for display purposes)
var problemChecks = FSCheck.type('problem');

// Checks can be called by ID
var missingBirthCheck = FSCheck.id('missingBirth');
var missingBirthOpportunity = missingBirthCheck.check(person);
````

## Browser
Download [fs-check.js](fs-check.js) and enjoy.
(Packaged with love by [browserify](http://browserify.org/))

## Node.js
Unsuported for now. Waiting on [this issue](https://github.com/rootsdev/familysearch-javascript-sdk/issues/8) in the FamilySearch Javascript SDK.

# Methods

### signature()

Return a list of all checks that match the given signature.

```javascript
var checks = FSCheck.signature('parents');
```

### signatures()

Get a list of all available signatures

```javascript
var signatures = FSCheck.signatures();
```

### type()

Return a list of all checks that match the given type.

```javascript
var checks = FSCheck.type('cleanup');
```

### types()

Get a list of all available types.

```javascript
var types = FSCheck.types();
```

### id(id)

Return the check that matches the given ID

```javascript
var check = FSCheck.id('missingDeath');
```

# Checks

View a list of the [checks grouped by signature and type](lib/checks#checks).

All checks have the following properties:

* `id` - A unique ID used to call the opportunity directly via `id()` and used to generate opportunity IDs by concatenating it with with the person ID.
* `title` - A human-readable title of the check and opportunities to be used in display.
* `signature` - The signature of the check.
* `type` - The type of the check, matching one of the following:
    * `problem`
    * `cleanup`
    * `source`
    * `person`
    * `family`
* `check` - The function called to run the check and possibly generate opportunities; `undefined` is returned if there is no opportunity available for this check.

# Opportunities

View examples of the opportunities generated by the checks at the [demo site](http://genealogysystems.github.io/fs-check/).

## Schema
````javascript
{
  id: '',
  type: ''
  title: '',
  description: '',
  person: FamilySearch.Person(),
  findarecord: {},
  gensearch: {}
}
````

### id

The ID of the opportunity, generated by concatenating the check ID and the person ID. For example, `birthBeforeDeath:KWML-4YX`.

### type

The type of opportunity (should match the type of the check that generated it).

### title

The title of the opportunity (should match the title of the check that generated it).

### description

A description of the opportunity, including hints, notes, best practices, and generally anything that may be useful.
The description usually contains html.

### person

The FamilySearch person that this opportunity is for. `person` will be a `FamilySearch.Person()` object.

### findarecord

___Find-A-Record has retired their record search and its API. Therefore the `findarecord` attribute
of opportunities is deprecated and will be removed in version 2 of fs-check.___

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

# Utilities

These function are used internally but are exposed in case they can be useful for users of fs-check.

### utils.getFactYear(fact)

Extract the year (integer) from a [Fact](http://rootsdev.org/familysearch-javascript-sdk/#/api/fact.types:constructor.Fact), when possible. May return undefined.

### utils.getFactPlace(fact)

Extract the place string from a [Fact](http://rootsdev.org/familysearch-javascript-sdk/#/api/fact.types:constructor.Fact), when possible. May return undefined.

### utils.gensearchPerson(person)

Return a basic [gen-search](https://github.com/genealogysystems/gen-search) object for a [Person](http://rootsdev.org/familysearch-javascript-sdk/#/api/person.types:constructor.Person). Includes the following properties, when possible:

* givenName
* familyName
* birthPlace
* birthDate
* deathPlace
* deathDate

### utils.gedcomxDate

Expose [gedcomx-date-js](https://github.com/trepo/gedcomx-date-js).

# Contributing
Every pull request that adds a check should contain the following things:

1. A check that returns ONE opportunity. (Look at existing checks and follow the conventions)
1. An update to [lib/index.js](lib/index.js) to register your check.
1. A set of test cases that provide 100% code coverage for your check.
1. One instance of `doc('checkName', opportunity)` in one of your test cases to document your check for gh-pages.
1. An update to the docs by running `npm run docs`.

Be careful not to add a check that overlaps with another check.

````bash
# To run the tests
npm test

# To generate the code coverage
npm run coverage

# To build the docs
npm run docs

# To build the library with browserify
npm run build
````

Run `node server.js` to get a simple web server that allows you to view the coverage (localhost:8888/coverage/coverage.html) and documentation (localhost:8888).

Make sure you install [mocha](http://visionmedia.github.io/mocha/) and [jscoverage](https://github.com/visionmedia/node-jscoverage) globally before generating coverage.

# License
[MIT](LICENSE)

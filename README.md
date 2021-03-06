[![Build Status](https://travis-ci.org/genealogysystems/fs-check.svg)](https://travis-ci.org/genealogysystems/fs-check)
[![Coverage Status](https://coveralls.io/repos/genealogysystems/fs-check/badge.svg?branch=master)](https://coveralls.io/r/genealogysystems/fs-check?branch=master)
[![Dependency Status](https://david-dm.org/genealogysystems/fs-check.svg)](https://david-dm.org/genealogysystems/fs-check)
[![devDependency Status](https://david-dm.org/genealogysystems/fs-check/dev-status.svg)](https://david-dm.org/genealogysystems/fs-check#info=devDependencies)

# fs-check

Generate research opportunities for the [FamilySearch Family Tree](https://familysearch.org/tree/).

fs-check depends on the [FamilySearch-javascript-sdk](https://github.com/rootsdev/familysearch-javascript-sdk) and was designed to be paired with [fs-traversal](https://github.com/genealogysystems/fs-traversal).

# Usage

```js
// fs-check was designed to be paired with fs-traversal
var FS = new FamilySearch({});
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
            
            // Opportunities do not have any valuable display strings until
            // they have been translated
            FSCheck.translate(opportunity, 'es');
          }
        }

      });
      
// Checks can be called by type (useful for display purposes)
var problemChecks = FSCheck.type('problem');

// Checks can be called by ID
var missingBirthCheck = FSCheck.id('missingBirth');
var missingBirthOpportunity = missingBirthCheck.check(person);
```

## Browser

Download [fs-check.js](fs-check.js) and enjoy.
(Packaged with love by [browserify](http://browserify.org/))

## Node.js

Node is supported but the package is not in npm yet.

# Methods

### signature()

Return a list of all checks that match the given signature.

```js
var checks = FSCheck.signature('parents');
```

### signatures()

Get a list of all available signatures

```js
var signatures = FSCheck.signatures();
```

### type()

Return a list of all checks that match the given type.

```js
var checks = FSCheck.type('cleanup');
```

### types()

Get a list of all available types.

```js
var types = FSCheck.types();
```

### id(id)

Return the check that matches the given ID

```js
var check = FSCheck.id('missingDeath');
```

### translate(opportunity, language)

Translate an opportunity into the specified language. `title` and `description`
properties will be added to the opportunity.

```js
FSCheck.translate(opportunity, 'es');
```

### language(code, data)

Register a language to support translations. The `data` object is a map
that is keyed by the check IDs. The values are objects with `title` and 
`description` strings. The `description` can contain markdown; it will be
converted to HTML as part of the translation process.

This method should only be used directly when using custom language packs.
All packaged langauge packs are setup to register themselves when included
in the browser. All languages are automatically included when using node.

```js
FSCheck.language({
  code: 'en',
  checks: {
    deathBeforeBirth: {
      title: 'Died Before Born',
      description: '# header\nparagraph'
    }
  }
});
```

### title(checkId, language)

Get the translated title of a check. Useful for display purposes if you want to
display to users the checks being used without having to run them.

```js
FSCheck.title('deathBeforeBirth', 'de');
```

### help(helpId, language)

Get the title and url for a help doc. `helpId`s are obtained from the `help`
property of checks. May also pass in multiple `helpId`s via an array.

```js
// single
FSCheck.help('customEvents', 'en');

// returns
{
  title: 'Custom Events and Facts',
  url: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-a-Custom-Event-or-Fact-to-a-Person'
}

// multiple
FSCheck.help(['customEvents', 'recordHints'], 'en');

// returns
[
  {
    title: 'Custom Events and Facts',
    url: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-a-Custom-Event-or-Fact-to-a-Person'
  },
  {
    title: 'Reviewing Record Hints',
    url: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Record-Hints'
  }
]
```

### add(check, templates)

Add a new check.

```js
FSCheck.add({
  id: 'testAdd',
  type: 'testType',
  signature: 'testSignature',
  help: [],
  check: function(){
    return {
      id: 'testAdd:TTTT',
      type: 'testType',
      checkId: 'testAdd',
      personId: 'TTTT',
      person: {},
      gensearch: {},
      template: {
        foo: 'bar'
      }
    };
  }
}, {
  'en': {
    title: 'Test add check',
    description: '{{foo}}'
  },
  'es': {
    title: 'Prueba de añadir',
    description: '{{foo}}'
  }
});
```

### remove(checkId)

Remove a check.

```js
FSCheck.remove('testAdd');
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
* `help` - An array of ids that can be used to retrieve urls and translated titles via the `help` method.
* `check` - The function called to run the check and possibly generate opportunities; `undefined` is returned if there is no opportunity available for this check.

# Opportunities

View examples of the opportunities generated by the checks at the [demo site](http://genealogysystems.github.io/fs-check/).

## Schema
```js
{
  id: '',
  type: ''
  checkId: '',
  personId: '',
  person: FamilySearch.Person(),
  gensearch: {},
  template: {}
}
```

### id

The ID of the opportunity, generated by concatenating the check ID and the person ID. For example, `birthBeforeDeath:KWML-4YX`.

### type

The type of opportunity (should match the type of the check that generated it).

### checkId

ID of the chech which created this opportunity.

### personId

ID of the person, for convenience.

### person

The FamilySearch person that this opportunity is for. `person` will be a `FamilySearch.Person()` object.

### gensearch

A gensearch object matching [schema](https://github.com/genealogysystems/gensearch#schema) or `undefined`.

### template

Data used to fill in the template when translating. 

# Utilities

These function are used internally but are exposed in case they can be useful for users of fs-check.

### utils.getFactYear(fact)

Extract the year (integer) from a [Fact](http://rootsdev.org/familysearch-javascript-sdk/#/api/fact.types:constructor.Fact), when possible. May return undefined.

### utils.getFactPlace(fact)

Extract the place string from a [Fact](http://rootsdev.org/familysearch-javascript-sdk/#/api/fact.types:constructor.Fact), when possible. May return undefined.

### utils.gensearchPerson(person)

Return a basic [gensearch](https://github.com/genealogysystems/gensearch) object for a [Person](http://rootsdev.org/familysearch-javascript-sdk/#/api/person.types:constructor.Person). Includes the following properties, when possible:

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

```bash
# To run the tests
npm test

# To generate the code coverage
npm run coverage

# To build the docs
npm run docs

# To build the library with browserify
npm run build
```

## Viewing Examples and Test Coverage Locally

Just need to setup a simple http server that handles static files. We recommend
[https-server](https://github.com/indexzero/http-server).

1. Install the server `npm install -g http-server`
2. Navigate to the directory of this repo `cd fs-check`
3. Run the server `http-server`

To view the coverage, run `npm run coverage` then open 
[localhost:8080/coverage/lcov-report](localhost:8080/coverage/lcov-report).

To view the examples, run `npm run docs` then open
[localhost:8080](localhost:8080).

# License

[MIT](LICENSE)

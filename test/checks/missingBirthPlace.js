var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('missingBirthPlace'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe.skip('missingBirthPlace', function(){

  it('should return nothing when there is no birth', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a birth and a place', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900',
          formalDate: '+1900-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a birth, no place, and no date', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a birth and no place', function() {
    var person = utils.generatePerson({
      id: 'PPPP-PPP',
      name: 'Bob Freemer',
      gender: 'http://gedcomx.org/Male',
      names: [
        new FamilySearch.Name({
          givenName: 'Bob',
          surname: 'Freemer'
        })
      ],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900',
          formalDate: '+1900-01-01'
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: 'January 1, 1950',
          formalDate: '+1950-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    doc('missingBirthPlace', opportunity);
    utils.validateSchema(fsCheck, opportunity, false, true);
  });

});
var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('missingBirth'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('missingBirth', function(){

  it('should return nothing when there is a birth', function() {
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

  it('should return an opportunity when there is no birth', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Male',
      names: [
        new FamilySearch.Name({
          givenName: 'Bob',
          surname: 'Freemer'
        })
      ],
      facts: []
    });

    var opportunity = fsCheck.check(person);
    utils.validateSchema(fsCheck, opportunity, false, true);
  });

  it('should return an opportunity when there is a birth but no date AND place', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Male',
      names: [
        new FamilySearch.Name({
          givenName: 'Bob',
          surname: 'Freemer'
        })
      ],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    utils.validateSchema(fsCheck, opportunity, false, true);
  });

  it('should return an opportunity including death info', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Male',
      names: [
        new FamilySearch.Name({
          givenName: 'Bob',
          surname: 'Freemer'
        })
      ],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: 'January 1, 1900',
          formalDate: '+1900-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });
    
    person.id = 'PPPP-PPP';

    var opportunity = fsCheck.check(person);
    doc('missingBirth', opportunity);
    utils.validateSchema(fsCheck, opportunity, false, true);
  });

});
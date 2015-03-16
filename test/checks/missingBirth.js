var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingBirth'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('missingBirth', function(){

  it('should return nothing when there is a birth', function() {
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: 'January 1, 1900',
          $formalDate: '+1900-01-01',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is no birth', function() {
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Male',
      names: [
        FS.createName({
          $givenName: 'Bob',
          $surname: 'Freemer'
        })
      ],
      facts: []
    });

    var opportunity = fsCheck.check(person);
    utils.validateSchema(fsCheck, opportunity, true);
  });

  it('should return an opportunity when there is a birth but no date AND place', function() {
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Male',
      names: [
        FS.createName({
          $givenName: 'Bob',
          $surname: 'Freemer'
        })
      ],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    utils.validateSchema(fsCheck, opportunity, true);
  });

  it('should return an opportunity including death info', function() {
    var person = utils.generatePerson({
      id: 'PPPP-PPP',
      name: 'Bob Freemer',
      $gender: 'http://gedcomx.org/Male',
      names: [
        FS.createName({
          $givenName: 'Bob',
          $surname: 'Freemer'
        })
      ],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $date: 'January 1, 1900',
          $formalDate: '+1900-01-01',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    doc('missingBirth', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
  });

});
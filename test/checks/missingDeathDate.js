var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingDeathDate'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('missingDeathDate', function(){

  it('should return nothing when there is no death', function() {
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a death and a date', function() {
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $date: 'January 1, 1900',
          $formalDate: '+1900-01-01'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a death, no place, and no date', function() {
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Death'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a death and no date', function() {
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
          $place: 'Orem, Utah, United States of America'
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: 'January 1, 1950',
          $formalDate: '+1950-01-01',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    doc('missingDeathDate', opportunity);
    utils.validateSchema(fsCheck, opportunity, false, true);
  });

});
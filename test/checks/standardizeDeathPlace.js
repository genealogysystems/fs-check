var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('standardizeDeathPlace'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('standardizeDeathPlace', function(){

  it('should return nothing when there is no death', function() {
    var person = FS.createPerson();

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no original place', function() {
    var person = FS.createPerson({
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $date: 'January 1, 1900'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a normalized place', function() {
    var person = FS.createPerson({
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $date: 'January 1, 1900',
          $place: 'Provo, Utah, United States of America',
          $normalizedPlace: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a original but no normalized place', function() {
    var person = FS.createPerson({
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $date: 'January 1, 1900',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    
    person.id = 'PPPP-PPP';
    person.display = { name: 'Elmer Fudd' };

    var opportunity = fsCheck.check(person);

    doc('standardizeDeathPlace', opportunity);
    utils.validateSchema(fsCheck, opportunity);
  });

});
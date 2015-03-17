var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('standardizeBirthDate'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('standardizeBirthDate', function(){

  it('should return nothing when there is no birth', function() {
    var person = FS.createPerson();

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no original date', function() {
    var person = FS.createPerson({
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a formal date', function() {
    var person = FS.createPerson({
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: 'January 1, 1900',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    person.facts[0].date.normalized = [{ value: '1 January 1900' }];

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a original but no formal date', function() {
    var person = FS.createPerson({
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: 'January 1, 1900',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    
    person.id = 'PPPP-PPP';
    person.display = { name: 'Elmer Fudd' };

    var opportunity = fsCheck.check(person);

    doc('standardizeBirthDate', opportunity);
    utils.validateSchema(fsCheck, opportunity);
  });

});
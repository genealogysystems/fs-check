var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingGivenName'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('missingGivenName', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(FS.createPerson());
    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a given name', function(){
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [
        FS.createName({
          $givenName: 'Mary'
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there is a surname with no given name', function(){
    var opportunity = fsCheck.check(FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [
        FS.createName({
          $surname: 'Adams'
        })
      ]
    }));
    doc('missingGivenName', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
  });
  
});
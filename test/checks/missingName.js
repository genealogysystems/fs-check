var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingName'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('missingName', function(){

  it('should return nothing when there is a name', function(){
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [
        FS.createName({
          $givenName: 'Mary',
          $surname: 'Adams'
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there is no name', function(){
    var opportunity = fsCheck.check(FS.createPerson());
    doc('missingName', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
  });
  
});
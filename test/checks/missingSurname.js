var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('missingSurname'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe.skip('missingSurname', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person());
    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a surname', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          surname: 'Adams'
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there is a given name with no surname', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          givenName: 'Mary'
        })
      ]
    }));
    doc('missingSurname', opportunity);
    utils.validateSchema(fsCheck, opportunity, false, true);
  });
  
});
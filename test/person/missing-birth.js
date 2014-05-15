var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'person','missing-birth.js'));

describe('missingBirth', function(){

  it('should return nothing', function(){
    var person = new FamilySearch.Person();

    var opportunity = fsCheck(person);
    expect(opportunity).to.equal(undefined);
    //expect(opportunity).to.be.instanceof(Object);
    //expect(opportunity.title).to.equal('Find a birth');
    //expect(opportunity.person).to.be.instanceof(FamilySearch.Person);

  });

});
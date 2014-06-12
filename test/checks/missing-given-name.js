var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'checks','missing-given-name.js')),
    doc = require('../../docs/util.js');

describe('missingGivenName', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck(new FamilySearch.Person());
    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a given name', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          givenName: 'Mary'
        })
      ]
    });
    var opportunity = fsCheck(person);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there is a surname with no given name', function(){
    var opportunity = fsCheck(new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          surname: 'Adams'
        })
      ]
    }));
    doc('missingGivenName', opportunity);
    expect(opportunity).to.exist;
    expect(opportunity.type).to.equal('person');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.equal(undefined);
    expect(opportunity).to.have.property('gensearch');
  });
  
});
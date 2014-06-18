var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('possibleDuplicates'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('possibleDuplicates', function(){

  it('should return nothing when there are no matches', function() {
    var opportunity = fsCheck.check(new FamilySearch.Person(), generateMatches(0));
    expect(opportunity).to.not.exist;
  });
  
  // https://github.com/rootsdev/familysearch-javascript-sdk/issues/69
  it('should return nothing when count is undefined', function(){
    var matches = {
      getResultsCount: function(){}
    };
    var opportunity = fsCheck.check(new FamilySearch.Person(), matches);
    expect(opportunity).to.not.exist;
  });

  it('should return an opportunity when there are matches', function() {
    var person = new FamilySearch.Person();
    person.id = 'PPPP-PPP';
    person.display = {
      name: 'Bob Freemer'
    };
    var opportunity = fsCheck.check(person, generateMatches(1));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('1 person');
  });
  
  it('should return an opportunity when there are matches', function() {
    var person = new FamilySearch.Person();
    person.id = 'PPPP-PPP';
    person.display = {
      name: 'Bob Freemer'
    };
    var opportunity = fsCheck.check(person, generateMatches(2));
    doc('possibleDuplicates', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('2 people');
  });

});

function generateMatches(count){
  return {
    getResultsCount: function(){
      return count;
    }
  };
};
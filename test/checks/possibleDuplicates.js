var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('possibleDuplicates'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('possibleDuplicates', function(){

  it('should return nothing when there are no matches', function() {
    var opportunity = fsCheck.check(new FamilySearch.Person(), generateMatches([]));
    expect(opportunity).to.not.exist;
  });

  it('should return an opportunity when there are matches', function() {
    var opportunity = fsCheck.check(new FamilySearch.Person(), generateMatches([1]));
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity for one match', function() {
    var person = new FamilySearch.Person();
    person.id = 'PPPP-PPP';
    person.display = {
      name: 'Bob Freemer'
    };
    var opportunity = fsCheck.check(person, generateMatches([3]));
    doc('possibleDuplicates', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('1 person');
  });
  
  it('should deetect two matches', function() {
    var person = new FamilySearch.Person();
    person.id = 'PPPP-PPP';
    person.display = {
      name: 'Bob Freemer'
    };
    var opportunity = fsCheck.check(person, generateMatches([3, 1, 4]));
    doc('possibleDuplicates', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('2 people');
  });

});

function generateMatches(confs){
  return {
    getResultsCount: function(){
      return confs.length;
    },
    getSearchResults: function(){
      var results = [];
      for(var i = 0; i < confs.length; i++){
        results.push({
          confidence: confs[i]
        });
      }
      return results;
    }
  };
};
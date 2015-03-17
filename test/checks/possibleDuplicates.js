var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('possibleDuplicates'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('possibleDuplicates', function(){

  it('should return nothing when there are no matches', function() {
    var opportunity = fsCheck.check(FS.createPerson(), generateMatches([]));
    expect(opportunity).to.not.exist;
  });

  it('should return an opportunity when there are matches', function() {
    var opportunity = fsCheck.check(FS.createPerson(), generateMatches([1]));
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity for one match', function() {
    var person = FS.createPerson();
    person.id = 'PPPP-PPP';
    person.display = {
      name: 'Bob Freemer'
    };
    var opportunity = fsCheck.check(person, generateMatches([3]));
    doc('possibleDuplicates', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.singular).to.be.true;
  });
  
  it('should ignore low confidence matches', function() {
    var person = FS.createPerson();
    person.id = 'PPPP-PPP';
    person.display = {
      name: 'Bob Freemer'
    };
    var opportunity = fsCheck.check(person, generateMatches([3, 1, 4]));
    doc('possibleDuplicates', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.singular).to.be.false;
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
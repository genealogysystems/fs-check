var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('recordHints'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('recordHints', function(){

  it('should return nothing when there are no matches', function(){
    var opportunity = fsCheck.check(FS.createPerson(), generateMatches([]));
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when there are matches', function(){
    var titles = [
          'SSDI',
          'Michigan Marriages',
          'Another Great Collection'
        ],
        person = FS.createPerson();
    person.display = {name: 'Foo Bar'};
    person.id = 'PPPP-III';
    var opportunity = fsCheck.check(person, generateMatches(titles));
    expect(opportunity).to.exist;
    doc('recordHints', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.titles).to.have.length(3);
  });
  
});

function generateMatches(titles){
  return {
    getResultsCount: function(){
      return titles.length;
    },
    getSearchResults: function(){
      var results = [];
      for(var i = 0; i < titles.length; i++){
        results.push({
          title: titles[i]
        });
      }
      return results;
    }
  };
};
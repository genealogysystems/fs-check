var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('recordHints'),
    utils = require('../test-utils.js')
    doc = require('../../docs/util.js');

describe('recordHints', function(){

  it('should return nothing when there are no matches', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person(), generateMatches([]));
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when there are matches', function(){
    var titles = [
          'SSDI',
          'Michigan Marriages',
          'Another Great Collection'
        ],
        person = new FamilySearch.Person();
    person.display = {name: 'Foo Bar'};
    person.id = 'PPPP-III';
    var opportunity = fsCheck.check(person, generateMatches(titles));
    expect(opportunity).to.exist;
    doc('recordHints', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('SSDI');
    expect(opportunity.description).to.contain('Foo Bar');
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
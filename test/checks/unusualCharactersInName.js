var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('unusualCharactersInName'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe.skip('unusualCharactersInName', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person());
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is a name with no special characters', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          fullText: 'Mary Adams'
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when the preferred name has unusual characters', function(){
    var person = new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe?'
        })
      ]
    });
    person.id = 'PPPP-PPP';
    var opportunity = fsCheck.check(person);
    doc('unusualCharactersInName', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('These characters are not normally found in names.');
  });
  
  it('should return an opportunity that discusses alternate names', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe (Joey)'
        })
      ]
    }));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('Remove the alternate annotations');
  });
  
  it('should return nothing when the alternate names have no special characters', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Joey',
          preferred: false
        })
      ]
    }));
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when the alternate names have special characters', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Joey?',
          preferred: false
        })
      ]
    }));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('Update these names');
  });
  
  it('should return an opportunity when the preferred and alternate names have special characters', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe?',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Joey?',
          preferred: false
        })
      ]
    }));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('These characters are not normally found in names.');
  });
  
});
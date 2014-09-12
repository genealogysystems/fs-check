var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('duplicateNames'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('duplicateNames', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person());
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when there are no duplicate names', function(){
    var person = new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Preferred Name',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 1',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 2',
          preferred: false
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when there are duplicate names', function(){
    var person = new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Preferred Name',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'alternate-name',
          preferred: false
        })
      ]
    });
    person.display = { name: 'Mary Sue' };
    var opportunity = fsCheck.check(person);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description.match(/<ul>/g).length).to.equal(2);
  });
  
  it('should return an opportunity with multiple groups when there are multiple duplicates', function(){
    var person = new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Preferred Name',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'alternate-name',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: ' preferred.NAME',
          preferred: false
        })
      ]
    });
    person.id = 'PPPP-PPP';
    person.display = { name: 'Mary Sue' };
    var opportunity = fsCheck.check(person);
    doc('duplicateNames', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description.match(/<ul>/g).length).to.equal(3);
  });
  
});
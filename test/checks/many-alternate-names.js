var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('manyAlternateNames'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('manyAlternateNames', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(new FamilySearch.Person());
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there are only 4 alternate names', function(){
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
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 3',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 4',
          preferred: false
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when there are more than 4 alternate names', function(){
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
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 3',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 4',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 5',
          preferred: false
        })
      ]
    });
    person.id = 'PPPP-PPP';
    var opportunity = fsCheck.check(person);
    doc('manyAlternateNames', opportunity);
    utils.validateSchema(fsCheck, opportunity);
  });
  
});
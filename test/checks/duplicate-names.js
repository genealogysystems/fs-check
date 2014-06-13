var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
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
    var opportunity = fsCheck.check(person);
    utils.validateSchema(opportunity, {
      id: 'duplicateNames',
      type: 'cleanup',
      title: 'Duplicate Names'
    });
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
    var opportunity = fsCheck.check(person);
    doc('duplicateNames', opportunity);
    expect(opportunity).to.exist;
    expect(opportunity.type).to.equal('cleanup');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity.description.match(/<ul>/g).length).to.equal(3);
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.not.exist;
    expect(opportunity.gensearch).to.not.exist;
  });
  
});
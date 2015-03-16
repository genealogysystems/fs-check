var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('duplicateNames'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('duplicateNames', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(FS.createPerson());
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when there are no duplicate names', function(){
    var person = FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Preferred Name',
          preferred: true
        }),
        FS.createName({
          $fullText: 'Alternate Name 1',
          preferred: false
        }),
        FS.createName({
          $fullText: 'Alternate Name 2',
          preferred: false
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when there are duplicate names', function(){
    var person = FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Preferred Name',
          preferred: true
        }),
        FS.createName({
          $fullText: 'Alternate Name',
          preferred: false
        }),
        FS.createName({
          $fullText: 'alternate-name',
          preferred: false
        })
      ]
    });
    person.display = { name: 'Mary Sue' };
    var opportunity = fsCheck.check(person);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.duplicates).to.deep.equal([
      ['Alternate Name', 'alternate-name']  
    ]);
  });
  
  it('should return an opportunity with multiple groups when there are multiple duplicates', function(){
    var person = FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Preferred Name',
          preferred: true
        }),
        FS.createName({
          $fullText: 'Alternate Name',
          preferred: false
        }),
        FS.createName({
          $fullText: 'alternate-name',
          preferred: false
        }),
        FS.createName({
          $fullText: ' preferred.NAME',
          preferred: false
        })
      ]
    });
    person.id = 'PPPP-PPP';
    person.display = { name: 'Mary Sue' };
    var opportunity = fsCheck.check(person);
    doc('duplicateNames', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.duplicates).to.deep.equal([ 
      [ 'Preferred Name', ' preferred.NAME' ],
      [ 'Alternate Name', 'alternate-name' ] 
    ]);
  });
  
});
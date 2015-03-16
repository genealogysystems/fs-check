var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('manyAlternateNames'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('manyAlternateNames', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(FS.createPerson());
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there are only 4 alternate names', function(){
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
        }),
        FS.createName({
          $fullText: 'Alternate Name 3',
          preferred: false
        }),
        FS.createName({
          $fullText: 'Alternate Name 4',
          preferred: false
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when there are more than 4 alternate names', function(){
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
        }),
        FS.createName({
          $fullText: 'Alternate Name 3',
          preferred: false
        }),
        FS.createName({
          $fullText: 'Alternate Name 4',
          preferred: false
        }),
        FS.createName({
          $fullText: 'Alternate Name 5',
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
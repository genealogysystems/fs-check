var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('unusualCharactersInName'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('unusualCharactersInName', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(FS.createPerson());
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is a name with no special characters', function(){
    var person = FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Mary Adams'
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when the preferred name has unusual characters', function(){
    var person = FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Joe?'
        })
      ]
    });
    person.id = 'PPPP-PPP';
    var opportunity = fsCheck.check(person);
    doc('unusualCharactersInName', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.chars).to.exist;
  });
  
  it('should return an opportunity that discusses alternate names', function(){
    var opportunity = fsCheck.check(FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Joe (Joey)'
        })
      ]
    }));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.chars).to.exist;
    expect(opportunity.template.brackets).to.be.true;
  });
  
  it('should return nothing when the alternate names have no special characters', function(){
    var opportunity = fsCheck.check(FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Joe',
          preferred: true
        }),
        FS.createName({
          $fullText: 'Joey',
          preferred: false
        })
      ]
    }));
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when the alternate names have special characters', function(){
    var opportunity = fsCheck.check(FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Joe',
          preferred: true
        }),
        FS.createName({
          $fullText: 'Joey?',
          preferred: false
        })
      ]
    }));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.badNames).to.exist;
  });
  
  it('should return an opportunity when the preferred and alternate names have special characters', function(){
    var opportunity = fsCheck.check(FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Joe?',
          preferred: true
        }),
        FS.createName({
          $fullText: 'Joey?',
          preferred: false
        })
      ]
    }));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.chars).to.exist;
  });
  
});
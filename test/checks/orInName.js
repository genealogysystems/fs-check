var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('orInName'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('orInName', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck.check(FS.createPerson());
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is a name with no or', function(){
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
  
  it('should return nothing when there is a name with or as a substring', function(){
    var person = FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Theodore Adams'
        })
      ]
    });
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when the preferred name has an or', function(){
    var opportunity = fsCheck.check(FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Joe or Joey'
        })
      ]
    }));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.badNames).to.not.exist;
  });
  
  it('should return nothing when the alternate names have no or', function(){
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
  
  it('should return an opportunity when the alternate names have an or', function(){
    var person = FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Joe',
          preferred: true
        }),
        FS.createName({
          $fullText: 'Joey or Joseph',
          preferred: false
        })
      ]
    });
    person.id = 'PPPP-PPP';
    var opportunity = fsCheck.check(person);
    doc('orInName', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.badNames).to.exist;
  });
  
  it('should return an opportunity when the preferred and alternate names have an or', function(){
    var opportunity = fsCheck.check(FS.createPerson({
      names: [
        FS.createName({
          $fullText: 'Joe or Joseph',
          preferred: true
        }),
        FS.createName({
          $fullText: 'Joey or Joe',
          preferred: false
        })
      ]
    }));
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.badNames).to.not.exist;
  });
  
});
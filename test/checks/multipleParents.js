var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('multipleParents'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('multipleParents', function(){

  it('should return nothing when there are no parent relationships', function() {
    var person = FS.createPerson();
    person.id = 'XXX-123';

    var relationships = {
      getParentRelationships: function() {return [];}
    }

    var opportunity = fsCheck.check(person, relationships, {});

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing for one parent relationship', function() {
    var person = FS.createPerson();
    person.id = 'XXX-123';

    var relationships = {
      getParentRelationships: function() {return ['1'];}
    }

    var opportunity = fsCheck.check(person, relationships, {});

    expect(opportunity).to.equal(undefined);
  });
  
  it('should not return an opportunity when there multiple parent relationships but only one biological mother and father', function() {
    var person = FS.createPerson();
    person.id = 'XXX-123';
    person.display = { name: 'Sue Adams' };

    var relationships = {
      getParentRelationships: function() {
        return [
          createParentRelationship('FATHER1', 'StepParent', 'MOTHER1', 'BiologicalParent'),
          createParentRelationship('FATHER2', 'BiologicalParent', 'MOTHER2', 'StepParent')
        ];
      }
    };

    var opportunity = fsCheck.check(person, relationships, {});
    expect(opportunity).to.not.exist;
  });

  it('should return an opportunity when there is more than TWO biological parent relationship', function() {
    var person = FS.createPerson();
    person.id = 'XXX-123';
    person.display = { name: 'Sue Adams' };

    var relationships = {
      getParentRelationships: function() {
        return [
          createParentRelationship('FATHER1', 'BiologicalParent', 'MOTHER1', 'BiologicalParent'),
          createParentRelationship('FATHER2', 'StepParent', 'MOTHER2', 'BiologicalParent')
        ];
      }
    };

    var opportunity = fsCheck.check(person, relationships, {});

    doc('multipleParents', opportunity);
    utils.validateSchema(fsCheck, opportunity);
  });
  
  it('should not count the same parent twice', function(){
    var person = FS.createPerson();
    person.id = 'XXX-123';
    person.display = { name: 'Sue Adams' };

    var relationships = {
      getParentRelationships: function() {
        return [
          createParentRelationship('FATHER', 'BiologicalParent', 'MOTHER1', 'BiologicalParent'),
          createParentRelationship('FATHER', 'BiologicalParent', 'MOTHER2', 'StepParent')
        ];
      }
    };

    var opportunity = fsCheck.check(person, relationships, {});
    expect(opportunity).to.not.exist;
  })

});

function createParentRelationship(fatherId, fatherType, motherId, motherType){
  return {
    $getFatherId: function(){
      return fatherId;
    },
    $getFatherFacts: function(){
      return fatherType ? [
        FS.createFact({
          type: 'http://gedcomx.org/' + fatherType
        })
      ] : undefined;
    },
    $getMotherId: function(){
      return motherId;
    },
    $getMotherFacts: function(){
      return motherType ? [
        FS.createFact({
          type: 'http://gedcomx.org/' + motherType
        })
      ] : undefined;
    }
  };
};
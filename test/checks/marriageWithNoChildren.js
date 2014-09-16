var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('marriageWithNoChildren'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('marriageWithNoChildren', function(){

  it('should return nothing when there are no marriages', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';

    var relationships = {
      getSpouseIds: function() {return [];},
      getChildIds: function() {return [];}
    }

    var opportunity = fsCheck.check(person, relationships, {});

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a marriage and at least one child', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';
    person.display = { name: 'Mary Jane' };

    var relationships = generateRelationships({
      spouse1: {
        children: ['2','3'],
        coupleId: 'CCC-CC1'
      }
    });

    var opportunity = fsCheck.check(person, relationships, {
      spouse1: utils.generatePerson({ name: 'Joe Adams' })
    });

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a marriage and no children', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';
    person.display = { name: 'Mary Jane' };

    var relationships = generateRelationships({
      spouse1: {
        children: [],
        coupleId: 'CCC-CC1'
      }
    });

    var opportunity = fsCheck.check(person, relationships, {
      spouse1: utils.generatePerson({ name: 'Joe Adams' })
    });
    utils.validateSchema(fsCheck, opportunity);
  });
  
  it('should return an opportunity when there are multiple marriages and one has no children', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';
    person.display = { name: 'Mary Jane' };

    var relationships = generateRelationships({
      spouse1: {
        children: [],
        coupleId: 'CCC-CC1'
      },
      spouse2: {
        children: ['2','3'],
        coupleId: 'CCC-CC1'
      }
    });

    var opportunity = fsCheck.check(person, relationships, {
      spouse1: utils.generatePerson({ name: 'Joe Adams' }),
      spouse2: utils.generatePerson({ name: 'Henry Hancock' })
    });
    utils.validateSchema(fsCheck, opportunity);
  });
  
  it('should return an opportunity when there are multiple marriages and all have no children', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';
    person.display = { name: 'Mary Jane' };

    var relationships = generateRelationships({
      spouse1: {
        children: [],
        coupleId: 'CCC-CC1'
      },
      spouse2: {
        children: [],
        coupleId: 'CCC-CC1'
      }
    });

    var opportunity = fsCheck.check(person, relationships, {
      spouse1: utils.generatePerson({ name: 'Joe Adams' }),
      spouse2: utils.generatePerson({ name: 'Henry Hancock' })
    });
    utils.validateSchema(fsCheck, opportunity);
    doc('marriageWithNoChildren', opportunity);
  });
  
  it('should return nothing when there are multiple marriages with children', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';
    person.display = { name: 'Mary Jane' };

    var relationships = generateRelationships({
      spouse1: {
        children: ['2','3'],
        coupleId: 'CCC-CC1'
      },
      spouse2: {
        children: ['2','3'],
        coupleId: 'CCC-CC1'
      }
    });

    var opportunity = fsCheck.check(person, relationships, {
      spouse1: utils.generatePerson({ name: 'Joe Adams' }),
      spouse2: utils.generatePerson({ name: 'Henry Hancock' })
    });
    expect(opportunity).to.not.exist;
  });

  /**
   * Return an object that mocks the FS SDK Relationships object
   */
  function generateRelationships(spouses){
    return {
      getSpouseIds: function(){
        var ids = []
        for(var i in spouses){
          ids.push(i);
        }
        return ids;
      },
      getChildRelationshipsOf: function(spouseId){
        return spouses[spouseId].children;
      },
      getSpouseRelationship: function(spouseId){
        return {
          id: spouses[spouseId].coupleId
        };
      }
    };
  };
});
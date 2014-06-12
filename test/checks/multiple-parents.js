var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'checks','multiple-parents.js')),
    doc = require('../../docs/util.js');

describe('multipleParents', function(){

  it('should return nothing when there are no parent relationships', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';

    var relationships = {
      getParentRelationships: function() {return [];}
    }

    var people = [];

    var opportunity = fsCheck(person, relationships, people);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing for one parent relationship', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';

    var relationships = {
      getParentRelationships: function() {return ['1'];}
    }

    var people = [];

    var opportunity = fsCheck(person, relationships, people);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is more than one parent relationship', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';

    var relationships = {
      getParentRelationships: function() {return ['1','2'];}
    }

    var people = [];

    var opportunity = fsCheck(person, relationships, people);

    doc('multipleParents', opportunity);

    expect(opportunity.type).to.equal('cleanup');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.equal(undefined);
    expect(opportunity.gensearch).to.equal(undefined);
  });

});
var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'relationships','marriage-with-no-children.js'));

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

    var people = [];

    var opportunity = fsCheck(person, relationships, people);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a marriage and at least one child', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';

    var relationships = {
      getSpouseIds: function() {return ['1'];},
      getChildIds: function() {return ['2','3'];}
    }

    var people = [];

    var opportunity = fsCheck(person, relationships, people);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a marriage and no children', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    person.id = 'XXX-123';

    var relationships = {
      getSpouseIds: function() {return ['1'];},
      getChildIds: function() {return [];}
    }

    var people = [];

    var opportunity = fsCheck(person, relationships, people);

    expect(opportunity.type).to.equal('problem');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.equal(undefined);
    expect(opportunity.gensearch).to.equal(undefined);
  });

});
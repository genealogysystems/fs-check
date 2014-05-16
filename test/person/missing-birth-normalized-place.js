var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'person','missing-birth-normalized-place.js'));

describe('missingBirthFormalPlace', function(){

  it('should return nothing when there is no birth', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var opportunity = fsCheck(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no original place', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900'
        })
      ]
    });

    var opportunity = fsCheck(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a normalized place', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900',
          place: 'Provo, Utah, United States of America',
          normalizedPlace: [{
            value : 'Provo, Utah, United States of America'
          }]
        })
      ]
    });

    var opportunity = fsCheck(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a original but no normalized place', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck(person);

    expect(opportunity.type).to.equal('cleanup');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.equal(undefined);
    expect(opportunity.gensearch).to.equal(undefined);
  });

});
var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'person','missing-birth-place.js')),
    doc = require('../../docs/util.js');

describe('missingBirthPlace', function(){

  it('should return nothing when there is no birth', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var opportunity = fsCheck(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a birth and a place', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900',
          formalDate: '+1900-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a birth, no place, and no date', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth'
        })
      ]
    });

    var opportunity = fsCheck(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a birth and no place', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Male',
      names: [
        new FamilySearch.Name({
          givenName: 'Bob',
          surname: 'Freemer'
        })
      ],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900',
          formalDate: '+1900-01-01'
        })
      ]
    });

    var opportunity = fsCheck(person);

    expect(opportunity.type).to.equal('person');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.equal(undefined);
    expect(opportunity).to.have.property('gensearch');
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.birthDate).to.equal('1900');
  });

  it('should include death information in gensearch', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Male',
      names: [
        new FamilySearch.Name({
          givenName: 'Bob',
          surname: 'Freemer'
        })
      ],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900',
          formalDate: '+1900-01-01'
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: 'January 1, 1950',
          formalDate: '+1950-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck(person);

    doc('missingBirthPlace', opportunity);

    expect(opportunity.type).to.equal('person');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.equal(undefined);
    expect(opportunity).to.have.property('gensearch');
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.birthDate).to.equal('1900');
    expect(opportunity.gensearch.deathDate).to.equal('1950');
    expect(opportunity.gensearch.deathPlace).to.equal('Provo, Utah, United States of America');
  });

});
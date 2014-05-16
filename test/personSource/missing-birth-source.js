var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'personSource','missing-birth-source.js'));

describe('missingBirthSource', function(){

  it('should return nothing when there is no birth', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var sourceRefs = {
      getSourceRefs: function() {return [];}
    };

    var opportunity = fsCheck(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no birth year', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [];
      }
    };

    var opportunity = fsCheck(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no birth place',function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [];
      }
    };

    var opportunity = fsCheck(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a source attached and tagged', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [
          new FamilySearch.SourceRef({
            tags: ['http://gedcomx.org/Birth']
          })
        ];
      }
    };

    var opportunity = fsCheck(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a birth and no sources', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          givenName: 'Bob',
          surname: 'Freemer'
        })
      ],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [];
      }
    };

    var opportunity = fsCheck(person, sourceRefs);

    expect(opportunity.type).to.equal('source');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity).to.have.property('findarecord');
    expect(opportunity.findarecord.tags).to.deep.equal(['birth']);
    expect(opportunity.findarecord.from).to.equal(1890);
    expect(opportunity.findarecord.to).to.equal(1910);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
    expect(opportunity).to.have.property('gensearch');
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.birthPlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.birthDate).to.equal('1900');
  });

  it('should return an opportunity when there is a birth and no sources tagged birth', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          givenName: 'Bob',
          surname: 'Freemer'
        })
      ],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [
          new FamilySearch.SourceRef({
            tags: ['http://gedcomx.org/Death']
          })
        ];
      }
    };

    var opportunity = fsCheck(person, sourceRefs);
    
    expect(opportunity.type).to.equal('source');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity).to.have.property('findarecord');
    expect(opportunity.findarecord.tags).to.deep.equal(['birth']);
    expect(opportunity.findarecord.from).to.equal(1890);
    expect(opportunity.findarecord.to).to.equal(1910);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
    expect(opportunity).to.have.property('gensearch');
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.birthPlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.birthDate).to.equal('1900');
  });

});
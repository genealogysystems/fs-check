var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'checks','missing-death-source.js')),
    doc = require('../../docs/util.js');

describe('missingDeathSource', function(){

  it('should return nothing when there is no death', function(){
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

  it('should return nothing when there is no death year', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
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

  it('should return nothing when there is no death place',function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
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
          type: 'http://gedcomx.org/Death',
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

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a death and no sources', function(){
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
          type: 'http://gedcomx.org/Death',
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
    expect(opportunity.findarecord.tags).to.deep.equal(['death']);
    expect(opportunity.findarecord.from).to.equal(1890);
    expect(opportunity.findarecord.to).to.equal(1910);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
    expect(opportunity).to.have.property('gensearch');
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.deathPlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.deathDate).to.equal('1900');
  });

  it('should return an opportunity when there is a death and no sources tagged death', function(){
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
          type: 'http://gedcomx.org/Death',
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
    
    person.id = 'PPPP-PPP';

    var opportunity = fsCheck(person, sourceRefs);
    
    doc('missingDeathSource', opportunity);
    
    expect(opportunity.type).to.equal('source');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity).to.have.property('findarecord');
    expect(opportunity.findarecord.tags).to.deep.equal(['death']);
    expect(opportunity.findarecord.from).to.equal(1890);
    expect(opportunity.findarecord.to).to.equal(1910);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
    expect(opportunity).to.have.property('gensearch');
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.deathPlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.deathDate).to.equal('1900');
  });

});
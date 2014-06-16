var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('missingBirthSource'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

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

    var opportunity = fsCheck.check(person, sourceRefs);

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

    var opportunity = fsCheck.check(person, sourceRefs);

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

    var opportunity = fsCheck.check(person, sourceRefs);

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

    var opportunity = fsCheck.check(person, sourceRefs);

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

    var opportunity = fsCheck.check(person, sourceRefs);
    utils.validateSchema(fsCheck, opportunity, true, true);
    expect(opportunity.findarecord.tags).to.deep.equal(['birth']);
    expect(opportunity.findarecord.from).to.equal(1897);
    expect(opportunity.findarecord.to).to.equal(1903);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
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
    
    person.id = 'PPPP-PPP';

    var opportunity = fsCheck.check(person, sourceRefs);
    
    doc('missingBirthSource', opportunity);
    utils.validateSchema(fsCheck, opportunity, true, true);
    expect(opportunity.findarecord.tags).to.deep.equal(['birth']);
    expect(opportunity.findarecord.from).to.equal(1897);
    expect(opportunity.findarecord.to).to.equal(1903);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
  });

});
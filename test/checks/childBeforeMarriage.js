var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('childBeforeMarriage'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    GedcomXDate = require('gedcomx-date');

describe('childBeforeMarriage', function(){

  it('should return nothing when there are no marriages', function(){
    var relationships = {
      getSpouseRelationships: function(){ return [] }
    };
    var opportunity = fsCheck.check(new FamilySearch.Person(), relationships, {});
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when there are no marriages with a formal marriage date', function(){
    var relationships = {
      getSpouseRelationships: function(){ 
        return [
          new FamilySearch.Couple()
        ]
      }
    };
    var opportunity = fsCheck.check(new FamilySearch.Person(), relationships, {});
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when marriages with a formal marriage date have no children', function(){
    var relationships = {
      getSpouseRelationships: function(){ 
        return [
          new FamilySearch.Couple({
            facts: [
              new FamilySearch.Fact({
                type: 'http://gedcomx.org/Marriage',
                formalDate: '+1900'
              })
            ]
          })
        ]
      },
      getChildRelationshipsOf: function(){ return []; }
    };
    var opportunity = fsCheck.check(new FamilySearch.Person(), relationships, {});
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when no children have a birth fact', function(){
    var persons = {
      'CHILD': new FamilySearch.Person()
    };
    persons.CHILD.id = 'CHILD';
    var relationships = {
      getSpouseRelationships: function(){ 
        return [
          new FamilySearch.Couple({
            facts: [
              new FamilySearch.Fact({
                type: 'http://gedcomx.org/Marriage',
                formalDate: '+1900'
              })
            ]
          })
        ]
      },
      getChildRelationshipsOf: function(){ 
        return [
          new FamilySearch.ChildAndParents({
            child: 'CHILD'
          })
        ]; 
      }
    };
    var opportunity = fsCheck.check(new FamilySearch.Person(), relationships, persons);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when no children have a formal birth date', function(){
    var persons = {
      'CHILD': new FamilySearch.Person({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            date: 'original date'
          })
        ]
      })
    };
    persons.CHILD.id = 'CHILD';
    var relationships = {
      getSpouseRelationships: function(){ 
        return [
          new FamilySearch.Couple({
            facts: [
              new FamilySearch.Fact({
                type: 'http://gedcomx.org/Marriage',
                formalDate: '+1900'
              })
            ]
          })
        ]
      },
      getChildRelationshipsOf: function(){ 
        return [
          new FamilySearch.ChildAndParents({
            child: 'CHILD'
          })
        ]; 
      }
    };
    var opportunity = fsCheck.check(new FamilySearch.Person(), relationships, persons);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when no children were born before a marriage', function(){
    var persons = {
      'CHILD': new FamilySearch.Person({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            formalDate: '+1901-01-01'
          })
        ]
      })
    };
    persons.CHILD.id = 'CHILD';
    var relationships = {
      getSpouseRelationships: function(){ 
        return [
          new FamilySearch.Couple({
            facts: [
              new FamilySearch.Fact({
                type: 'http://gedcomx.org/Marriage',
                formalDate: '+1900-01-01'
              })
            ]
          })
        ]
      },
      getChildRelationshipsOf: function(){ 
        return [
          new FamilySearch.ChildAndParents({
            child: 'CHILD'
          })
        ]; 
      }
    };
    var opportunity = fsCheck.check(new FamilySearch.Person(), relationships, persons);
    expect(opportunity).to.not.exist;
  });
  
  it('testing check for impossible condition', function(){
    var relationships = {
      getSpouseRelationships: function(){ 
        return [
          new FamilySearch.Couple({
            facts: [
              new FamilySearch.Fact({
                type: 'http://gedcomx.org/Marriage',
                formalDate: '+1900-01-01'
              })
            ]
          })
        ]
      },
      getChildRelationshipsOf: function(){ 
        return [
          new FamilySearch.ChildAndParents({
            child: 'CHILD'
          })
        ]; 
      }
    };
    var opportunity = fsCheck.check(new FamilySearch.Person(), relationships, {});
    expect(opportunity).to.not.exist;
  });

  it('should return an opportunity when a child was born before the marriage', function(){
    var persons = {
      'CHILD': new FamilySearch.Person({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            formalDate: '+1899-05-10'
          })
        ]
      }),
      'SPOUSE': new FamilySearch.Person()
    };
    persons.CHILD.id = 'CHILD';
    persons.SPOUSE.id = 'SPOUSE';
    persons.SPOUSE.display = { name: 'Mary Adams' };
    
    var marriages = [
      new FamilySearch.Couple({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Marriage',
            formalDate: '+1900-07-03'
          })
        ]
      })
    ];
    marriages[0].$getSpouseId = function(){ return 'SPOUSE'; };
    
    var relationships = {
      getSpouseRelationships: function(){ 
        return marriages;
      },
      getChildRelationshipsOf: function(){ 
        return [
          new FamilySearch.ChildAndParents({
            child: 'CHILD'
          })
        ]; 
      }
    };
    
    var person = new FamilySearch.Person();
    person.id = 'PPPP-PPP';
    
    var opportunity = fsCheck.check(person, relationships, persons);
    doc('childBeforeMarriage', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.description).to.contain('Mary Adams');
  });

});
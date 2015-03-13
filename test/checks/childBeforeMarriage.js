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
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.children).to.deep.equal([ 
      { 
        spouseName: 'Mary Adams',
        spouseId: 'SPOUSE',
        childName: undefined,
        childId: 'CHILD',
        durationString: '1 year and 1 month'
      }
    ]);
  });
  
  it('should properly handle multiple marriages with problems', function(){
    var persons = {
      'CHILD1': utils.generatePerson({
        id: 'CHILD1',
        name: 'Elmer Fudd',
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            formalDate: '+1899-05-10'
          })
        ]
      }),
      'CHILD2': utils.generatePerson({
        id: 'CHILD2',
        name: 'Mary Sue',
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            formalDate: '+1899-05-10'
          })
        ]
      }),
      'SPOUSE1': utils.generatePerson({
        name: 'Mary Adams',
        id: 'SPOUSE1'
      }),
      'SPOUSE2': utils.generatePerson({
        name: 'Sarah Jane',
        id: 'SPOUSE2'
      })
    };
    
    var marriages = [
      new FamilySearch.Couple({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Marriage',
            formalDate: '+1900-07-03'
          })
        ]
      }),
      new FamilySearch.Couple({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Marriage',
            formalDate: '+1900-10-03'
          })
        ]
      })
    ];
    marriages[0].$getSpouseId = function(){ return 'SPOUSE1'; };
    marriages[1].$getSpouseId = function(){ return 'SPOUSE2'; };
    
    var relationships = {
      getSpouseRelationships: function(){ 
        return marriages;
      },
      getChildRelationshipsOf: function(spouseId){ 
        if(spouseId === 'SPOUSE1'){
          return [
            new FamilySearch.ChildAndParents({
              child: 'CHILD1'
            })
          ];
        } else {
          return [
            new FamilySearch.ChildAndParents({
              child: 'CHILD2'
            })
          ];
        }
      }
    };
    
    var person = utils.generatePerson({
      id: 'PPPP-PPP',
      name: 'John Adams'
    });
    
    var opportunity = fsCheck.check(person, relationships, persons);
    utils.validateSchema(fsCheck, opportunity);
    doc('childBeforeMarriage', opportunity);
    expect(opportunity.template.children).to.deep.equal([ 
      { 
        spouseName: 'Mary Adams',
        spouseId: 'SPOUSE1',
        childName: 'Elmer Fudd',
        childId: 'CHILD1',
        durationString: '1 year and 4 months'
      },
      { 
        spouseName: 'Sarah Jane',
        spouseId: 'SPOUSE2',
        childName: 'Mary Sue',
        childId: 'CHILD2',
        durationString: '1 year and 4 months'
      }
    ]);
  });
  
  it('should properly handle multiple marriages where some have problems and others dont', function(){
    var persons = {
      'CHILD1': new FamilySearch.Person({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            formalDate: '+1899-05-10'
          })
        ]
      }),
      'CHILD2': new FamilySearch.Person({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            formalDate: '+1901-05-10'
          })
        ]
      }),
      'SPOUSE1': new FamilySearch.Person(),
      'SPOUSE2': new FamilySearch.Person()
    };
    persons.CHILD1.id = 'CHILD1';
    persons.CHILD2.id = 'CHILD2';
    persons.SPOUSE1.id = 'SPOUSE1';
    persons.SPOUSE1.display = { name: 'Mary Adams' };
    persons.SPOUSE2.id = 'SPOUSE2';
    persons.SPOUSE2.display = { name: 'Sarah Jane' };
    
    var marriages = [
      new FamilySearch.Couple({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Marriage',
            formalDate: '+1900-07-03'
          })
        ]
      }),
      new FamilySearch.Couple({
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Marriage',
            formalDate: '+1900-10-03'
          })
        ]
      })
    ];
    marriages[0].$getSpouseId = function(){ return 'SPOUSE1'; };
    marriages[1].$getSpouseId = function(){ return 'SPOUSE2'; };
    
    var relationships = {
      getSpouseRelationships: function(){ 
        return marriages;
      },
      getChildRelationshipsOf: function(spouseId){ 
        if(spouseId === 'SPOUSE1'){
          return [
            new FamilySearch.ChildAndParents({
              child: 'CHILD1'
            })
          ];
        } else {
          return [
            new FamilySearch.ChildAndParents({
              child: 'CHILD2'
            })
          ];
        }
      }
    };
    
    var person = new FamilySearch.Person();
    person.id = 'PPPP-PPP';
    
    var opportunity = fsCheck.check(person, relationships, persons);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.template.children).to.deep.equal([{ 
      spouseName: 'Mary Adams',
      spouseId: 'SPOUSE1',
      childName: undefined,
      childId: 'CHILD1',
      durationString: '1 year and 4 months'
    }]);
  });
  
});
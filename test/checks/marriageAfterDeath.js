var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('marriageAfterDeath'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('marriageAfterDeath', function(){

  describe('should return nothing', function(){

    it('no death date', function(){
      var opportunity = fsCheck.check(generatePerson(), generateRelationships({
          'SPOUSE1': {}
        }), {});
      expect(opportunity).to.not.exist;
    });
    
    it('cant extract formal death date', function(){
      var opportunity = fsCheck.check(generatePerson({
        date: '1st June 1980'
      }), generateRelationships({
          'SPOUSE1': {}
        }), {});
      expect(opportunity).to.not.exist;
    });

    it('death date but no marriages', function(){
      var opportunity = fsCheck.check(generatePerson({
        date: '1 June 1980'
      }), generateRelationships(), {});
      expect(opportunity).to.not.exist;
    });
    
    it('marriage has no facts', function(){
      var person = generatePerson({
          date: '1 June 1980'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {}
        }), {});
      expect(opportunity).to.not.exist;
    });
    
    it('marriage fact with no date', function(){
      var person = generatePerson({
          date: '1 June 1980'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            facts: [ {} ]
          }
        }), {});
      expect(opportunity).to.not.exist;
    });

    describe('death is after the marriage', function(){
    
      it('both formal', function(){
        var person = generatePerson({
          date: '1 June 1980',
          formalDate: '+1980-06-01'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            facts: [
              {
                formalDate: '+1960-09-28'
              }
            ]
          }
        }), {});
        expect(opportunity).to.not.exist;
      });
      
      it('death non-formal', function(){
        var person = generatePerson({
          date: '1 June 1980'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            facts: [
              {
                formalDate: '+1960-09-28'
              }
            ]
          }
        }), {});
        expect(opportunity).to.not.exist;
      });
      
      describe('marriage non-formal', function(){
        
        it('different year', function(){
          var person = generatePerson({
            formalDate: '+1980-01-28'
          }),
          opportunity = fsCheck.check(person, generateRelationships({
            'SPOUSE1': {
              facts: [
                {
                  date: '28 Sep 1960'
                }
              ]
            }
          }), {});
          expect(opportunity).to.not.exist;
        });
        
      });
      
      describe('both non-formal', function(){
        
        it('different year', function(){
          var person = generatePerson({
            date: '1 June 1980'
          }),
          opportunity = fsCheck.check(person, generateRelationships({
            'SPOUSE1': {
              facts: [
                {
                  date: '28 Sep 1960'
                }
              ]
            }
          }), {});
          expect(opportunity).to.not.exist;
        });
        
        it('multiple marriages', function(){
          var person = generatePerson({
            date: '1 June 1980'
          }),
          opportunity = fsCheck.check(person, generateRelationships({
            'SPOUSE1': {
              facts: [
                {
                  date: '28 Sep 1960'
                }
              ]
            },
            'SPOUSE2': {
              facts: [
                {
                  date: '14 July 1973'
                }
              ]              
            }
          }), {});
          expect(opportunity).to.not.exist;
        });
        
      });

    });
  
  });
  
  describe('death before marriage', function(){
  
    describe('single marriage', function(){
  
      it('both formal', function(){
        var person = generatePerson({
          formalDate: '+1950-06-01',
          id: 'PPP-PPP',
          name: 'Elmer Gate'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            name: 'Molly Sue',
            coupleId: 'COUPLE1',
            facts: [
              {
                formalDate: '+1950-09-28'
              }
            ]
          }
        }), {});
        utils.validateSchema(fsCheck, opportunity);
      });
        
      it('death non-formal', function(){
        var person = generatePerson({
          date: '1 June 1950',
          id: 'PPP-PPP',
          name: 'Elmer Gate'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            name: 'Molly Sue',
            coupleId: 'COUPLE1',
            facts: [
              {
                formalDate: '+1951-09-28'
              }
            ]
          }
        }), {});
        utils.validateSchema(fsCheck, opportunity);
      });
      
      it('marriage non-formal', function(){
        var person = generatePerson({
          formalDate: '+1950-06-01',
          id: 'PPP-PPP',
          name: 'Elmer Gate'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            name: 'Molly Sue',
            coupleId: 'COUPLE1',
            facts: [
              {
                date: '28 September 1955'
              }
            ]
          }
        }), {});
        utils.validateSchema(fsCheck, opportunity);
      });
      
      it('both non-formal', function(){       
        var person = generatePerson({
          date: '1 June 1950',
          id: 'PPP-PPP',
          name: 'Elmer Gate'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            name: 'Molly Sue',
            coupleId: 'COUPLE1',
            facts: [
              {
                date: '28 September 1955'
              }
            ]
          }
        }), {});
        utils.validateSchema(fsCheck, opportunity);
      });
      
    });
    
    describe('multiple marriages', function(){
    
      it('one good; one bad', function(){
        var person = generatePerson({
          formalDate: '+1950-06-01',
          id: 'PPP-PPP',
          name: 'Elmer Gate'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            name: 'Molly Sue',
            coupleId: 'COUPLE1',
            facts: [
              {
                formalDate: '+1950-09-28'
              }
            ]
          },
          'SPOUSE2': {
            name: 'Sarah Jane',
            coupleId: 'COUPLE2',
            facts: [
              {
                formalDate: '+1948-03-07'
              }
            ]
          }
        }), {});
        utils.validateSchema(fsCheck, opportunity);
        expect(opportunity.description).to.contain('Molly Sue');
        expect(opportunity.description).to.not.contain('Sarah Jane');
      });
      
      it('two bad', function(){
        var person = generatePerson({
          formalDate: '+1950-06-01',
          id: 'PPP-PPP',
          name: 'Elmer Gate'
        }),
        opportunity = fsCheck.check(person, generateRelationships({
          'SPOUSE1': {
            name: 'Molly Sue',
            coupleId: 'COUPLE1',
            facts: [
              {
                formalDate: '+1950-09-28'
              }
            ]
          },
          'SPOUSE2': {
            name: 'Sarah Jane',
            coupleId: 'COUPLE2',
            facts: [
              {
                date: '7 March 1952'
              }
            ]
          }
        }), {});
        utils.validateSchema(fsCheck, opportunity);
        expect(opportunity.description).to.contain('Molly Sue');
        expect(opportunity.description).to.contain('Sarah Jane');
        doc('marriageAfterDeath', opportunity);
      });
    
    });
  
  });
  
  /**
   * Generate person with an id, name, and death fact
   */
  function generatePerson(data){
    if(!data){
      data = {};
    }
    if(data.date || data.formalDate){
      data.facts = [
        {
          type: 'http://gedcomx.org/Death',
          date: data.date,
          formalDate: data.formalDate
        }
      ];
    }
    return utils.generatePerson(data);
  };

  /**
   * Return an object that mocks the FS SDK Relationships object.
   * Expected input data format:
     {
      spouseId: {
        coupleId: couple Id,
        name: spouses display name,
        facts: [
          { type, date, formalDate }
        ]
      }
     }
   */
  function generateRelationships(spouses){
    if(!spouses){
      spouses = {};
    }
    return {
      getSpouseIds: function(){
        var ids = []
        for(var i in spouses){
          ids.push(i);
        }
        return ids;
      },
      getSpouseRelationship: function(spouseId){
        return {
          id: spouses[spouseId].coupleId,
          $getFacts: function(){
            var originalFacts = spouses[spouseId].facts,
                newFacts = [];
            if(originalFacts){
              for(var i = 0; i < originalFacts.length; i++){
                newFacts.push(new FamilySearch.Fact(originalFacts[i]));
              }
            }
            return newFacts;
          }
        };
      },
      getPerson: function(spouseId){
        return {
          id: spouseId,
          $getDisplayName: function(){
            return spouses[spouseId].name;
          }
        }
      }
    };
  };
});
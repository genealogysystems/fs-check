var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('missingFather'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('missingFather', function(){

  it('should return nothing when there is a father', function() {
    var child = new FamilySearch.Person({}),
        mother = new FamilySearch.Person({}),
        father = new FamilySearch.Person({}),
        relationship = new FamilySearch.ChildAndParents(),
        opportunity = fsCheck.check(child, mother, father, relationship);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there is no father', function() {
    var child = new FamilySearch.Person({
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
              formalDate: '+1900-01-01',
              place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        mother = new FamilySearch.Person({
          names: [
            new FamilySearch.Name({
              givenName: 'Thelma',
              surname: 'Louise'
            })
          ]
        }),
        father,
        relationship = new FamilySearch.ChildAndParents({
          mother: mother,
          child: child
        });
    
    mother.display = { name: 'Thelma Louise' };
    relationship.id = 'RRRR-RRR';
    child.id = 'PPPP-PPP';
    child.display = { name: 'Bob Freemer' };
    
    var opportunity = fsCheck.check(child, mother, father, relationship);
    
    doc('missingFather', opportunity);
    utils.validateSchema(fsCheck, opportunity, true, true);
    expect(opportunity.findarecord.tags).to.deep.equal(['birth']);
    expect(opportunity.findarecord.from).to.equal(1897);
    expect(opportunity.findarecord.to).to.equal(1903);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
  });
  
});
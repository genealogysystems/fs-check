var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('missingMother'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('missingMother', function(){

  it('should return nothing when there is a mother', function() {
    var child = new FamilySearch.Person({}),
        mother = new FamilySearch.Person({}),
        father = new FamilySearch.Person({}),
        relationship = new FamilySearch.ChildAndParents(),
        opportunity = fsCheck.check(child, mother, father, relationship);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there is no mother', function() {
    var child = new FamilySearch.Person({
          names: [
            new FamilySearch.Name({
              givenName: 'Thelma',
              surname: 'Louise'
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
        father = new FamilySearch.Person({
          names: [
            new FamilySearch.Name({
              givenName: 'Bob',
              surname: 'Freemer'
            })
          ]
        }),
        mother,
        relationship = new FamilySearch.ChildAndParents({
          father: father,
          child: child
        });
     
    father.display = { name: 'Bob Freemer' };
    relationship.id = 'RRRR-RRR';
     
    var opportunity = fsCheck.check(child, mother, father, relationship);
        
    doc('missingMother', opportunity);
    utils.validateSchema(fsCheck, opportunity, true, true);
    expect(opportunity.findarecord.tags).to.deep.equal(['birth']);
    expect(opportunity.findarecord.from).to.equal(1897);
    expect(opportunity.findarecord.to).to.equal(1903);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.givenName).to.equal('Thelma');
    expect(opportunity.gensearch.familyName).to.equal('Louise');
    expect(opportunity.gensearch.birthPlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.birthDate).to.equal('1900');
    expect(opportunity.gensearch.fatherGivenName).to.equal('Bob');
    expect(opportunity.gensearch.fatherFamilyName).to.equal('Freemer');
  });
  
});
var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'parents', 'missing-parents.js')),
    doc = require('../../docs/util.js');

describe('missingParents', function(){

  it('should return nothing when there is a parent', function() {
    var child = new FamilySearch.Person({}),
        parent = new FamilySearch.Person({}),
        opportunity = fsCheck(child, [parent]);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there are no parents', function() {
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
        });

    child.id = 'PPPP-PPP';
        
    var opportunity = fsCheck(child, []);
    
    doc('missingParents', opportunity);
    
    expect(opportunity).to.exist;
    expect(opportunity.type).to.equal('family');
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
var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'checks','many-alternate-names.js')),
    doc = require('../../docs/util.js');

describe('manyAlternateNames', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck(new FamilySearch.Person());
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there are only 4 alternate names', function(){
    var person = new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Preferred Name',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 1',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 2',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 3',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 4',
          preferred: false
        })
      ]
    });
    var opportunity = fsCheck(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when there are more than 4 alternate names', function(){
    var person = new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Preferred Name',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 1',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 2',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 3',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 4',
          preferred: false
        }),
        new FamilySearch.Name({
          fullText: 'Alternate Name 5',
          preferred: false
        })
      ]
    });
    person.id = 'PPPP-PPP';
    var opportunity = fsCheck(person);
    doc('manyAlternateNames', opportunity);
    expect(opportunity).to.exist;
    expect(opportunity.type).to.equal('cleanup');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.not.exist;
    expect(opportunity.gensearch).to.not.exist;
  });
  
});
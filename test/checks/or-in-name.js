var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'checks','or-in-name.js')),
    doc = require('../../docs/util.js');

describe('orInName', function(){

  it('should return nothing when there is no name', function(){
    var opportunity = fsCheck(new FamilySearch.Person());
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is a name with no or', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          fullText: 'Mary Adams'
        })
      ]
    });
    var opportunity = fsCheck(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when there is a name with or as a substring', function(){
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [
        new FamilySearch.Name({
          fullText: 'Theodore Adams'
        })
      ]
    });
    var opportunity = fsCheck(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when the preferred name has an or', function(){
    var opportunity = fsCheck(new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe or Joey'
        })
      ]
    }));
    expect(opportunity).to.exist;
    expect(opportunity.type).to.equal('cleanup');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity.description).to.contain('preferred');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.not.exist;
    expect(opportunity.gensearch).to.not.exist;
  });
  
  it('should return nothing when the alternate names have no or', function(){
    var opportunity = fsCheck(new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Joey',
          preferred: false
        })
      ]
    }));
    expect(opportunity).to.not.exist;
  });
  
  it('should return an opportunity when the alternate names have an or', function(){
    var person = new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Joey or Joseph',
          preferred: false
        })
      ]
    });
    person.id = 'PPPP-PPP';
    var opportunity = fsCheck(person);
    doc('orInName', opportunity);
    expect(opportunity).to.exist;
    expect(opportunity.type).to.equal('cleanup');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity.description).to.contain('These alternate names');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.not.exist;
    expect(opportunity.gensearch).to.not.exist;
  });
  
  it('should return an opportunity when the preferred and alternate names have an or', function(){
    var opportunity = fsCheck(new FamilySearch.Person({
      names: [
        new FamilySearch.Name({
          fullText: 'Joe or Joseph',
          preferred: true
        }),
        new FamilySearch.Name({
          fullText: 'Joey or Joe',
          preferred: false
        })
      ]
    }));
    expect(opportunity).to.exist;
    expect(opportunity.type).to.equal('cleanup');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity.description).to.contain('preferred');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.not.exist;
    expect(opportunity.gensearch).to.not.exist;
  });
  
});
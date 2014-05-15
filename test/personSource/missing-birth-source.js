var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'personSource','missing-birth-source.js'));

describe('missingBirth', function(){

  it('should return nothing', function(){
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
      getSourceRefs: function() {return [];}
    };

    var opportunity = fsCheck(person, sourceRefs);
    //console.log(opportunity);
    //expect(opportunity).to.equal(undefined);
    //expect(opportunity).to.be.instanceof(Object);
    //expect(opportunity.title).to.equal('Find a birth');
    //expect(opportunity.person).to.be.instanceof(FamilySearch.Person);

  });

});
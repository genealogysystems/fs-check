var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('deathBeforeBirth'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('deathBeforeBirth', function(){

  it('should return nothing when there is no birth fact', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is no birth date', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is no death fact', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900-01-01'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is no death date', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900-01-01'
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when birth is same date as death', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900-01-01'
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          formalDate: '+1900-01-01'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when birth is before death', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900-01-01'
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: 'January 2, 1900'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when death date is an invalid format', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: "+1639",
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: 'Deceased',
        })
      ]
    });
    
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when birth date is an invalid format', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: "12 Jan 1564 or 1592"
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          formalDate: '+1678-08-27'
        })
      ]
    });
    
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when birth and death are non-formal', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: "12 Jan 1564"
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: '27 August 1648'
        })
      ]
    });
    
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return an opportunity when death is before birth', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          formalDate: '+1900-01-02'
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          formalDate: '+1900-01-01'
        })
      ]
    });
    person.id = 'PPPP-PPP';
    person.display = { name: 'Mary Sue' };

    var opportunity = fsCheck.check(person);

    doc('deathBeforeBirth', opportunity);
    utils.validateSchema(fsCheck, opportunity);
  });

});
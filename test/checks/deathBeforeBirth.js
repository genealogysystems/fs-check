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

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no birth date', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          place: {
            original: 'Provo, Utah, United States of America'
          }
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no death fact', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: {
            original: 'January 1, 1900',
            formal: '+1900-01-01',
          },
          place: {
            original: 'Provo, Utah, United States of America'
          }
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no death date', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: {
            original: 'January 1, 1900',
            formal: '+1900-01-01',
          },
          place: {
            original: 'Provo, Utah, United States of America'
          }
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          place: {
            original: 'Provo, Utah, United States of America'
          }
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });
  
  it('should return nothing when birth is same date as death', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: {
            original: 'January 1, 1900',
            formal: '+1900-01-01',
          },
          place: {
            original: 'Provo, Utah, United States of America'
          }
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: {
            original: 'January 1, 1900',
            formal: '+1900-01-01',
          },
          place: {
            original: 'Provo, Utah, United States of America'
          }
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when birth is before death', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: {
            original: 'January 1, 1900',
            formal: '+1900-01-01',
          },
          place: {
            original: 'Provo, Utah, United States of America'
          }
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: {
            original: 'January 2, 1900',
            formal: '+1900-01-02',
          },
          place: {
            original: 'Provo, Utah, United States of America'
          }
        })
      ]
    });

    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });
  
  it('should return nothing when death date is an invalid format', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: {
            formal: "+1639",
          }
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: {
            original: 'Deceased',
          }
        })
      ]
    });
    
    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });
  
  it('should return nothing when birth date is an invalid format', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: {
            original: "12 Jan 1564 or 1592",
          }
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: {
            formal: '+1678-08-27',
          }
        })
      ]
    });
    
    var opportunity = fsCheck.check(person);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when death is before birth', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: {
            original: 'January 2, 1900',
            formal: '+1900-01-02',
          },
          place: {
            original: 'Provo, Utah, United States of America'
          }
        }),
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Death',
          date: {
            original: 'January 1, 1900',
            formal: '+1900-01-01',
          },
          place: {
            original: 'Provo, Utah, United States of America'
          }
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
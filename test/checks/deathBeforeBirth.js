var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('deathBeforeBirth'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('deathBeforeBirth', function(){

  it('should return nothing when there is no birth fact', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is no birth date', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is no death fact', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900-01-01'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is no death date', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900-01-01'
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Death'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when birth is same date as death', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900-01-01'
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $formalDate: '+1900-01-01'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing when birth is before death', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900-01-01'
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $date: 'January 2, 1900'
        })
      ]
    });

    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when death date is an invalid format', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: "+1639",
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $date: 'Deceased',
        })
      ]
    });
    
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when birth date is an invalid format', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: "12 Jan 1564 or 1592"
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $formalDate: '+1678-08-27'
        })
      ]
    });
    
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });
  
  it('should return nothing when birth and death are non-formal', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: "12 Jan 1564"
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $date: '27 August 1648'
        })
      ]
    });
    
    var opportunity = fsCheck.check(person);
    expect(opportunity).to.not.exist;
  });

  it('should return an opportunity when death is before birth', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900-01-02'
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $formalDate: '+1900-01-01'
        })
      ]
    });
    person.id = 'PPPP-PPP';
    person.display = { name: 'Mary Sue' };

    var opportunity = fsCheck.check(person);

    doc('deathBeforeBirth', opportunity);
    utils.validateSchema(fsCheck, opportunity);
  });
  
  it('should work for date ranges', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900/+1904'
        }),
        FS.createFact({
          type: 'http://gedcomx.org/Death',
          $formalDate: '+1885/+1900'
        })
      ]
    });
    person.id = 'PPPP-PPP';
    var opportunity = fsCheck.check(person);
    utils.validateSchema(fsCheck, opportunity);
  });

});
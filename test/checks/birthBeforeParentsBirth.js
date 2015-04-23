var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('birthBeforeParentsBirth'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('birthBeforeParentsBirth', function(){

  it('should return nothing when there is no birth fact', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });
    var opportunity = fsCheck.check(person, []);
    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no birth date', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    var opportunity = fsCheck.check(person, []);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return nothing when the birth date has no extractable formal value for comparison', function(){
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $place: 'Provo, Utah, United States of America',
          $date: 'Oct 6th'
        })
      ]
    });
    var opportunity = fsCheck.check(person, [
      FS.createPerson({
        gender: 'http://gedcomx.org/Male',
        names: [
          FS.createName({
            givenName: 'Bob',
            surname: 'Freemer'
          })
        ],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1895',
            $formalDate: '+1895-01-01',
            $place: 'Provo, Utah, United States of America'
          })
        ]
      })  
    ]);
    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there are no parents', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: 'January 1, 1900',
          $formalDate: '+1900-01-01',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    var opportunity = fsCheck.check(person, []);
    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there are no parents birth dates', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: 'January 1, 1920',
          $formalDate: '+1920-01-01',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    var parents = [
      FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        names: [],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $place: 'Provo, Utah, United States of America'
          })
        ]
      })
    ];
    var opportunity = fsCheck.check(person, parents);
    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there are no parents birth dates after person', function() {
    // Here we are also testing that we do more than just a simple comparison of the birth years.
    // While it is impossible for parents and children to be born the same year, that would be
    // a different check. We are strictly looking for birth __before__ parents birth.
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: 'May 1, 1920',
          $formalDate: '+1920-05-01',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var parents = [
      FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        names: [
          FS.createName({
            $givenName: 'Thelma',
            $surname: 'Louise'
          })
        ],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1920',
            $formalDate: '+1920-01-01',
            $place: 'Provo, Utah, United States of America'
          })
        ]
      }),
      FS.createPerson({
        gender: 'http://gedcomx.org/Male',
        names: [
          FS.createName({
            $givenName: 'Bob',
            $surname: 'Freemer'
          })
        ],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1895',
            $formalDate: '+1895-01-01',
            $place: 'Provo, Utah, United States of America'
          })
        ]
      })
    ];
    var opportunity = fsCheck.check(person, parents);
    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there are parents birth dates after person', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $date: 'January 1, 1820',
          $formalDate: '+1820-01-01',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    person.id = 'XXX-123';
    person.display = {name: 'Thing One',birthDate: 'January 1, 1820'}
    var parents = [
      FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        names: [
          FS.createName({
            $givenName: 'Thelma',
            $surname: 'Louise'
          })
        ],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1900',
            $formalDate: '+1900-01-01',
            $place: 'Provo, Utah, United States of America'
          })
        ]
      }),
      FS.createPerson({
        gender: 'http://gedcomx.org/Male',
        names: [
          FS.createName({
            $givenName: 'Bob',
            $surname: 'Freemer'
          })
        ],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1895',
            $place: 'Provo, Utah, United States of America'
          })
        ]
      })
    ];
    parents[0].id = 'XXX-456';
    parents[0].display = {name: 'Thelma Louise', birthDate: 'January 1, 1900'}
    parents[1].id = 'XXX-789';
    parents[1].display = {name: 'Bob Freemer', birthDate: 'January 1, 1895'}
    
    var opportunity = fsCheck.check(person, parents);
    doc('birthBeforeParentsBirth', opportunity);
    utils.validateSchema(fsCheck, opportunity);
  });
  
  it('should return an opportunity when there are parents birth dates after person; non-formal dates', function() {
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      id: 'XXX-123',
      display: {
        name: 'Thing One',
        birthDate: 'January 1, 1820'
      },
      facts: [
        {
          type: 'http://gedcomx.org/Birth',
          $date: 'January 1, 1820',
          $place: 'Provo, Utah, United States of America'
        }
      ]
    });
    var parents = [
      FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        names: [
          FS.createName({
            givenName: 'Thelma',
            surname: 'Louise'
          })
        ],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1900',
            $place: 'Provo, Utah, United States of America'
          })
        ]
      }),
      FS.createPerson({
        gender: 'http://gedcomx.org/Male',
        names: [
          FS.createName({
            givenName: 'Bob',
            surname: 'Freemer'
          })
        ],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1895',
            $place: 'Provo, Utah, United States of America'
          })
        ]
      })
    ];
    parents[0].id = 'XXX-456';
    parents[0].display = {name: 'Thelma Louise', birthDate: 'January 1, 1900'}
    parents[1].id = 'XXX-789';
    parents[1].display = {name: 'Bob Freemer', birthDate: 'January 1, 1895'}
    
    var opportunity = fsCheck.check(person, parents);
    doc('birthBeforeParentsBirth', opportunity);
    utils.validateSchema(fsCheck, opportunity);
  });
  
  it('should handle date ranges', function(){
    var person = FS.createPerson({
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1820-01-01/+1821-12-31'
        })
      ],
      id: 'XXX-123'
    });
    var parents = [
      FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $formalDate: '+1900/+1905'
          })
        ]
      }),
      FS.createPerson({
        gender: 'http://gedcomx.org/Male',
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1895'
          })
        ]
      })
    ];
    parents[0].id = 'XXX-456';
    parents[1].id = 'XXX-789';
    
    var opportunity = fsCheck.check(person, parents);
    utils.validateSchema(fsCheck, opportunity);
  });

});
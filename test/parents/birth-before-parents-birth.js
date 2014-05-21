var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'parents','birth-before-parents-birth.js')),
    doc = require('../../docs/util.js');

describe('birthBeforeParentsBirth', function(){

  it('should return nothing when there is no birth fact', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var opportunity = fsCheck(person, []);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no birth date', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck(person, []);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there are no parents', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1900',
          formalDate: '+1900-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var opportunity = fsCheck(person, []);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there are no parents birth dates', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1920',
          formalDate: '+1920-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var parents = [
      new FamilySearch.Person({
        gender: 'http://gedcomx.org/Female',
        names: [],
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            date: 'January 1, 1900',
            formalDate: '+1900-01-01',
            place: 'Provo, Utah, United States of America'
          })
        ]
      })
    ];

    var opportunity = fsCheck(person, parents);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there are no parents birth dates before person', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1920',
          formalDate: '+1920-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var parents = [
      new FamilySearch.Person({
        gender: 'http://gedcomx.org/Female',
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
      new FamilySearch.Person({
        gender: 'http://gedcomx.org/Male',
        names: [
          new FamilySearch.Name({
            givenName: 'Bob',
            surname: 'Freemer'
          })
        ],
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            date: 'January 1, 1895',
            formalDate: '+1895-01-01',
            place: 'Provo, Utah, United States of America'
          })
        ]
      })
    ];

    var opportunity = fsCheck(person, parents);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there are parents birth dates before person', function() {
    var person = new FamilySearch.Person({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        new FamilySearch.Fact({
          type: 'http://gedcomx.org/Birth',
          date: 'January 1, 1820',
          formalDate: '+1820-01-01',
          place: 'Provo, Utah, United States of America'
        })
      ]
    });
    person.id = 'XXX-123';
    person.display = {name: 'Thing One',birthDate: 'January 1, 1820'}

    var parents = [
      new FamilySearch.Person({
        gender: 'http://gedcomx.org/Female',
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
      new FamilySearch.Person({
        gender: 'http://gedcomx.org/Male',
        names: [
          new FamilySearch.Name({
            givenName: 'Bob',
            surname: 'Freemer'
          })
        ],
        facts: [
          new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            date: 'January 1, 1895',
            formalDate: '+1895-01-01',
            place: 'Provo, Utah, United States of America'
          })
        ]
      })
    ];
    parents[0].id = 'XXX-456';
    parents[0].display = {name: 'Thelma Louise', birthDate: 'January 1, 1900'}
    parents[1].id = 'XXX-789';
    parents[1].display = {name: 'Bob Freemer', birthDate: 'January 1, 1895'}


    var opportunity = fsCheck(person, parents);

    doc('birthBeforeParentsBirth', opportunity);

    expect(opportunity.type).to.equal('problem');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    expect(opportunity.findarecord).to.equal(undefined);
    expect(opportunity.gensearch).to.equal(undefined);
  });

});
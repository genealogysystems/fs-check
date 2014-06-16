var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('missingMarriageSource'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('missingMarriageSource', function(){

  it('should return nothing if there is no marriageFact', function() {
    var husband = new FamilySearch.Person({}),
        wife = new FamilySearch.Person({}),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: []
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is no husband or wife', function() {
    var husband = undefined,
        wife = undefined,
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              date: 'January 1, 1900',
              formalDate: '+1900-01-01',
              place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is not exactly 1 marriageFact', function() {
    var husband = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Male',
          names: [
            new FamilySearch.Name({
              givenName: 'Bob',
              surname: 'Freemer'
            })
          ]
        }),
        wife = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Female',
          names: [
            new FamilySearch.Name({
              givenName: 'Thelma',
              surname: 'Louise'
            })
          ]
        }),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              date: 'January 1, 1900',
              formalDate: '+1900-01-01',
              place: 'Provo, Utah, United States of America'
            }),
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              date: 'January 1, 1900',
              formalDate: '+1900-01-01',
              place: 'Orem, Utah, United States of America'
            })
          ]
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is no marriage date', function() {
    var husband = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Male',
          names: [
            new FamilySearch.Name({
              givenName: 'Bob',
              surname: 'Freemer'
            })
          ]
        }),
        wife = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Female',
          names: [
            new FamilySearch.Name({
              givenName: 'Thelma',
              surname: 'Louise'
            })
          ]
        }),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is no marriage place', function() {
    var husband = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Male',
          names: [
            new FamilySearch.Name({
              givenName: 'Bob',
              surname: 'Freemer'
            })
          ]
        }),
        wife = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Female',
          names: [
            new FamilySearch.Name({
              givenName: 'Thelma',
              surname: 'Louise'
            })
          ]
        }),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              date: 'January 1, 1900',
              formalDate: '+1900-01-01'
            })
          ]
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is at least one source', function() {
    var husband = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Male',
          names: [
            new FamilySearch.Name({
              givenName: 'Bob',
              surname: 'Freemer'
            })
          ]
        }),
        wife = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Female',
          names: [
            new FamilySearch.Name({
              givenName: 'Thelma',
              surname: 'Louise'
            })
          ]
        }),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              date: 'January 1, 1900',
              formalDate: '+1900-01-01',
              place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = ['1'];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity if there is no source', function() {
    var husband = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Male',
          names: [
            new FamilySearch.Name({
              givenName: 'Bob',
              surname: 'Freemer'
            })
          ]
        }),
        wife = new FamilySearch.Person({
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
              formalDate: '+1880',
              place: 'Orem, Utah, United States of America'
            }),
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Death',
              formalDate: '+1950',
              place: 'Lehi, Utah, United States of America'
            })
          ]
        }),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              date: 'January 1, 1900',
              formalDate: '+1900-01-01',
              place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = [];

    wife.display = {name: 'Thelma Louise'};
    husband.display = {name: 'Bob Freemer'};
    marriage.id = 'MMMM-MMM';

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    doc('missingMarriageSource', opportunity);
    utils.validateSchema(fsCheck, opportunity, true, true);
    expect(opportunity.findarecord.tags).to.deep.equal(['marriage']);
    expect(opportunity.findarecord.from).to.equal(1890);
    expect(opportunity.findarecord.to).to.equal(1910);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.givenName).to.equal('Thelma');
    expect(opportunity.gensearch.familyName).to.equal('Louise');
    expect(opportunity.gensearch.marriagePlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.marriageDate).to.equal('1900');
    expect(opportunity.gensearch.spouseGivenName).to.equal('Bob');
    expect(opportunity.gensearch.spouseFamilyName).to.equal('Freemer');
    expect(opportunity.gensearch.birthPlace).to.equal('Orem, Utah, United States of America');
    expect(opportunity.gensearch.birthDate).to.equal('1880');
    expect(opportunity.gensearch.deathPlace).to.equal('Lehi, Utah, United States of America');
    expect(opportunity.gensearch.deathDate).to.equal('1950');
  });

  it('should default to husband when wife is missing', function() {
    var husband = new FamilySearch.Person({
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
              formalDate: '+1880',
              place: 'Orem, Utah, United States of America'
            }),
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Death',
              formalDate: '+1950',
              place: 'Lehi, Utah, United States of America'
            })
          ]
        }),
        wife = undefined,
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              date: 'January 1, 1900',
              formalDate: '+1900-01-01',
              place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = [];
    
    var opportunity = fsCheck.check(wife, husband, marriage, sources);
    utils.validateSchema(fsCheck, opportunity, true, true);
    expect(opportunity.findarecord.tags).to.deep.equal(['marriage']);
    expect(opportunity.findarecord.from).to.equal(1890);
    expect(opportunity.findarecord.to).to.equal(1910);
    expect(opportunity.findarecord.place).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.marriagePlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.marriageDate).to.equal('1900');
    expect(opportunity.gensearch.birthPlace).to.equal('Orem, Utah, United States of America');
    expect(opportunity.gensearch.birthDate).to.equal('1880');
    expect(opportunity.gensearch.deathPlace).to.equal('Lehi, Utah, United States of America');
    expect(opportunity.gensearch.deathDate).to.equal('1950');
  });

});
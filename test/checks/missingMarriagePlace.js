var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('missingMarriagePlace'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe.skip('missingMarriagePlace', function(){

  it('should return nothing when there is no marriage fact', function() {
    var husband = new FamilySearch.Person({}),
        wife = new FamilySearch.Person({}),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: []
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is more than one marriage fact', function() {
    var husband = new FamilySearch.Person({}),
        wife = new FamilySearch.Person({}),
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
              place: 'Provo, Utah, United States of America'
            })
          ]
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a marriage and a place', function() {
    var husband = new FamilySearch.Person({}),
        wife = new FamilySearch.Person({}),
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
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a marriage, no place, and no date', function() {
    var husband = new FamilySearch.Person({}),
        wife = new FamilySearch.Person({}),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage'
            })
          ]
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a marriage and no place', function() {
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
        });

    var opportunity = fsCheck.check(wife, husband, marriage);
    utils.validateSchema(fsCheck, opportunity, true);
    expect(opportunity.person).to.equal(wife);
    expect(opportunity.gensearch.givenName).to.equal('Thelma');
    expect(opportunity.gensearch.familyName).to.equal('Louise');
    expect(opportunity.gensearch.marriageDate).to.equal('1900');
    expect(opportunity.gensearch.spouseGivenName).to.equal('Bob');
    expect(opportunity.gensearch.spouseFamilyName).to.equal('Freemer');
  });

  it('should return nothing when spouse is undefined', function() {
    var husband = new FamilySearch.Person({
          gender: 'http://gedcomx.org/Male',
          names: [
            new FamilySearch.Name({
              givenName: 'Bob',
              surname: 'Freemer'
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
              formalDate: '+1900-01-01'
            })
          ]
        });

    var opportunity = fsCheck.check(wife, husband, marriage);
    expect(opportunity).to.not.exist;
  });

  it('should return nothing if husband and wife are missing', function() {
    var husband = undefined,
        wife = undefined,
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: [
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Marriage',
              place: 'Provo, Utah, United States of America'
            })
          ]
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should include birth and death information in gensearch', function() {
    var husband = utils.generatePerson({
          id: 'HUSBAND',
          name: 'Bob Freemer',
          gender: 'http://gedcomx.org/Male',
          names: [
            new FamilySearch.Name({
              givenName: 'Bob',
              surname: 'Freemer'
            })
          ]
        }),
        wife = utils.generatePerson({
          id: 'WIFE',
          name: 'Thelma Louise',
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
              place: 'Orem, Utah, United States of America'
            }),
            new FamilySearch.Fact({
              type: 'http://gedcomx.org/Death',
              date: 'January 1, 1950',
              formalDate: '+1950-01-01',
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
              date: 'January 1, 1920',
              formalDate: '+1920-01-01'
            })
          ]
        });

    marriage.id = 'RRRR-RRR';    
        
    var opportunity = fsCheck.check(wife, husband, marriage);

    doc('missingMarriagePlace', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
    expect(opportunity.person).to.equal(wife);
    expect(opportunity.gensearch.givenName).to.equal('Thelma');
    expect(opportunity.gensearch.familyName).to.equal('Louise');
    expect(opportunity.gensearch.marriageDate).to.equal('1920');
    expect(opportunity.gensearch.spouseGivenName).to.equal('Bob');
    expect(opportunity.gensearch.spouseFamilyName).to.equal('Freemer');
    expect(opportunity.gensearch.birthPlace).to.equal('Orem, Utah, United States of America');
    expect(opportunity.gensearch.birthDate).to.equal('1900');
    expect(opportunity.gensearch.deathPlace).to.equal('Lehi, Utah, United States of America');
    expect(opportunity.gensearch.deathDate).to.equal('1950');
  });

});
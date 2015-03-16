var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingMarriageSource'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('missingMarriageSource', function(){

  it('should return nothing if there is no marriageFact', function() {
    var husband = FS.createPerson({}),
        wife = FS.createPerson({}),
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: []
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is no husband or wife', function() {
    var husband = undefined,
        wife = undefined,
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: [
            FS.createFact({
              type: 'http://gedcomx.org/Marriage',
              $date: 'January 1, 1900',
              $formalDate: '+1900-01-01',
              $place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is not exactly 1 marriageFact', function() {
    var husband = FS.createPerson({
          $gender: 'http://gedcomx.org/Male',
          names: [
            FS.createName({
              $givenName: 'Bob',
              $surname: 'Freemer'
            })
          ]
        }),
        wife = FS.createPerson({
          $gender: 'http://gedcomx.org/Female',
          names: [
            FS.createName({
              $givenName: 'Thelma',
              $surname: 'Louise'
            })
          ]
        }),
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: [
            FS.createFact({
              type: 'http://gedcomx.org/Marriage',
              $date: 'January 1, 1900',
              $formalDate: '+1900-01-01',
              $place: 'Provo, Utah, United States of America'
            }),
            FS.createFact({
              type: 'http://gedcomx.org/Marriage',
              $date: 'January 1, 1900',
              $formalDate: '+1900-01-01',
              $place: 'Orem, Utah, United States of America'
            })
          ]
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is no marriage date', function() {
    var husband = FS.createPerson({
          $gender: 'http://gedcomx.org/Male',
          names: [
            FS.createName({
              $givenName: 'Bob',
              $surname: 'Freemer'
            })
          ]
        }),
        wife = FS.createPerson({
          $gender: 'http://gedcomx.org/Female',
          names: [
            FS.createName({
              $givenName: 'Thelma',
              $surname: 'Louise'
            })
          ]
        }),
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: [
            FS.createFact({
              type: 'http://gedcomx.org/Marriage',
              $place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is no marriage place', function() {
    var husband = FS.createPerson({
          $gender: 'http://gedcomx.org/Male',
          names: [
            FS.createName({
              $givenName: 'Bob',
              $surname: 'Freemer'
            })
          ]
        }),
        wife = FS.createPerson({
          $gender: 'http://gedcomx.org/Female',
          names: [
            FS.createName({
              $givenName: 'Thelma',
              $surname: 'Louise'
            })
          ]
        }),
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: [
            FS.createFact({
              type: 'http://gedcomx.org/Marriage',
              $date: 'January 1, 1900',
              $formalDate: '+1900-01-01'
            })
          ]
        }),
        sources = [];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing if there is at least one source', function() {
    var husband = FS.createPerson({
          $gender: 'http://gedcomx.org/Male',
          names: [
            FS.createName({
              $givenName: 'Bob',
              $surname: 'Freemer'
            })
          ]
        }),
        wife = FS.createPerson({
          $gender: 'http://gedcomx.org/Female',
          names: [
            FS.createName({
              $givenName: 'Thelma',
              $surname: 'Louise'
            })
          ]
        }),
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: [
            FS.createFact({
              type: 'http://gedcomx.org/Marriage',
              $date: 'January 1, 1900',
              $formalDate: '+1900-01-01',
              $place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = ['1'];

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity if there is no source', function() {
    var husband = FS.createPerson({
          $gender: 'http://gedcomx.org/Male',
          names: [
            FS.createName({
              $givenName: 'Bob',
              $surname: 'Freemer'
            })
          ]
        }),
        wife = FS.createPerson({
          $gender: 'http://gedcomx.org/Female',
          names: [
            FS.createName({
              $givenName: 'Thelma',
              $surname: 'Louise'
            })
          ],
          facts: [
            FS.createFact({
              type: 'http://gedcomx.org/Birth',
              $formalDate: '+1880',
              $place: 'Orem, Utah, United States of America'
            }),
            FS.createFact({
              type: 'http://gedcomx.org/Death',
              $formalDate: '+1950',
              $place: 'Lehi, Utah, United States of America'
            })
          ]
        }),
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: [
            FS.createFact({
              type: 'http://gedcomx.org/Marriage',
              $date: 'January 1, 1900',
              $formalDate: '+1900-01-01',
              $place: 'Provo, Utah, United States of America'
            })
          ]
        }),
        sources = [];

    wife.display = {name: 'Thelma Louise'};
    husband.display = {name: 'Bob Freemer'};
    marriage.id = 'MMMM-MMM';

    var opportunity = fsCheck.check(wife, husband, marriage, sources);

    doc('missingMarriageSource', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
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

});
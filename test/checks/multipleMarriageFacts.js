var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('multipleMarriageFacts'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('multipleMarriageFacts', function(){
  
  it('should return nothing when husband and wife are undefined', function() {
    var husband = undefined,
        wife = undefined,
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: []
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there are no marriage facts', function() {
    var husband = FS.createPerson({}),
        wife = FS.createPerson({}),
        marriage = FS.createCouple({
          $husband: husband,
          $wife: wife,
          facts: []
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is one marriage fact', function() {
    var husband = FS.createPerson({}),
        wife = FS.createPerson({}),
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
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is more than one marriage fact', function() {
    var husband = FS.createPerson({}),
        wife = FS.createPerson({}),
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
              $place: 'Provo, Utah, United States of America'
            })
          ]
        });

    marriage.id = 'MMMM-MMM';
    husband.display = { name: 'Elmer Fudd' };
    wife.display = { name: 'Thelma Lousie' };
        
    var opportunity = fsCheck.check(wife, husband, marriage);

    doc('multipleMarriageFacts', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
    expect(opportunity.person).to.equal(wife);
  });

});
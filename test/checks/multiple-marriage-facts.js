var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('multipleMarriageFacts'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe('multipleMarriageFacts', function(){
  
  it('should return nothing when husband and wife are undefined', function() {
    var husband = undefined,
        wife = undefined,
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: []
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there are no marriage facts', function() {
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

  it('should return nothing when there is one marriage fact', function() {
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

  it('should return an opportunity when there is more than one marriage fact', function() {
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

    marriage.id = 'MMMM-MMM';
    husband.display = { name: 'Elmer Fudd' };
    wife.display = { name: 'Thelma Lousie' };
        
    var opportunity = fsCheck.check(wife, husband, marriage);

    doc('multipleMarriageFacts', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.person).to.equal(wife);
  });

  it('should use husband when wife is missing', function() {
    var husband = new FamilySearch.Person({}),
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
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.person).to.equal(husband);
  });

});
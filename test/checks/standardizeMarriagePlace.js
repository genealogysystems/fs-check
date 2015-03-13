var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('standardizeMarriagePlace'),
    utils = require('../test-utils.js'),
    doc = require('../../docs/util.js');

describe.skip('standardizeMarriagePlace', function(){

it('should return nothing when the wife or husband is missing', function(){
    var husband,
        wife = new FamilySearch.Person({}),
        marriage = new FamilySearch.Couple({
          husband: husband,
          wife: wife,
          facts: []
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.not.exist;
  });

  it('should return nothing when there is no marriage facts', function() {
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

  it('should return nothing when there is multiple marriage facts', function() {
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

  it('should return nothing when there is no original place', function() {
    var husband = new FamilySearch.Person({}),
        wife = new FamilySearch.Person({}),
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

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a normalized place', function() {
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
              place: 'Provo, Utah, United States of America',
              normalizedPlace: 'Provo, Utah, United States of America'
            })
          ]
        });

    var opportunity = fsCheck.check(wife, husband, marriage);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a original but no normalized place', function() {
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
        
    marriage.id = 'MMMM-MMM';
    husband.display = { name: 'Elmer Fudd' };
    wife.display = { name: 'Thelma Lousie' };

    var opportunity = fsCheck.check(wife, husband, marriage);

    doc('standardizeMarriagePlace', opportunity);
    utils.validateSchema(fsCheck, opportunity);
    expect(opportunity.person).to.equal(wife);
  });

});
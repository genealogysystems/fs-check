var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingMother'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('missingMother', function(){

  it('should return nothing when there is a mother', function() {
    var child = FS.createPerson({}),
        mother = FS.createPerson({}),
        father = FS.createPerson({}),
        relationship = FS.createChildAndParents(),
        opportunity = fsCheck.check(child, mother, father, relationship);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there is no mother', function() {
    var child = FS.createPerson({
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
        father = FS.createPerson({
          names: [
            FS.createName({
              $givenName: 'Bob',
              $surname: 'Freemer'
            })
          ]
        }),
        mother,
        relationship = FS.createChildAndParents({
          $father: father,
          $child: child
        });
     
    father.display = { name: 'Bob Freemer' };
    relationship.id = 'RRRR-RRR';
    child.id = 'PPPP-PPP';
    child.display = { name: 'Thelma Louise' };
     
    var opportunity = fsCheck.check(child, mother, father, relationship);
        
    doc('missingMother', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
  });
  
});
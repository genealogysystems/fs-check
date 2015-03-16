var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingFather'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('missingFather', function(){

  it('should return nothing when there is a father', function() {
    var child = FS.createPerson({}),
        mother = FS.createPerson({}),
        father = FS.createPerson({}),
        relationship = FS.createChildAndParents(),
        opportunity = fsCheck.check(child, mother, father, relationship);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there is no father', function() {
    var child = FS.createPerson({
          names: [
            FS.createName({
              $givenName: 'Bob',
              $surname: 'Freemer'
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
        mother = FS.createPerson({
          names: [
            FS.createName({
              $givenName: 'Thelma',
              $surname: 'Louise'
            })
          ]
        }),
        father,
        relationship = FS.createChildAndParents({
          $mother: mother,
          $child: child
        });
    
    mother.display = { name: 'Thelma Louise' };
    relationship.id = 'RRRR-RRR';
    child.id = 'PPPP-PPP';
    child.display = { name: 'Bob Freemer' };
    
    var opportunity = fsCheck.check(child, mother, father, relationship);
    
    doc('missingFather', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
  });
  
});
var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingParents'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('missingParents', function(){

  it('should return nothing when there is a parent', function() {
    var child = FS.createPerson({}),
        parent = FS.createPerson({}),
        opportunity = fsCheck.check(child, [parent]);
    expect(opportunity).to.equal(undefined);
  });
  
  it('should return an opportunity when there are no parents', function() {
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
        });

    child.id = 'PPPP-PPP';
    child.display = { name: 'Bob Freemer' };
        
    var opportunity = fsCheck.check(child, []);
    
    doc('missingParents', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
  });
  
});
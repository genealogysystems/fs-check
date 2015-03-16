var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingBirthSource'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('missingBirthSource', function(){

  it('should return nothing when there is no birth', function(){
    var person = FS.createPerson({
      gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var sourceRefs = {
      getSourceRefs: function() {return [];}
    };

    var opportunity = fsCheck.check(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no birth year', function(){
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [];
      }
    };

    var opportunity = fsCheck.check(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no birth place',function(){
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [];
      }
    };

    var opportunity = fsCheck.check(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is a source attached and tagged', function(){
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [
          FS.createSourceRef({
            $tags: ['http://gedcomx.org/Birth']
          })
        ];
      }
    };

    var opportunity = fsCheck.check(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a birth and no sources', function(){
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [
        FS.createName({
          $givenName: 'Bob',
          $surname: 'Freemer'
        })
      ],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    person.display = { name: 'Bob Freemer' };

    var sourceRefs = {
      getSourceRefs: function() {
        return [];
      }
    };

    var opportunity = fsCheck.check(person, sourceRefs);
    utils.validateSchema(fsCheck, opportunity, true, true);
  });

  it('should return an opportunity when there is a birth and no sources tagged birth', function(){
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [
        FS.createName({
          $givenName: 'Bob',
          $surname: 'Freemer'
        })
      ],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Birth',
          $formalDate: '+1900',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });
    person.display = { name: 'Bob Freemer' };

    var sourceRefs = {
      getSourceRefs: function() {
        return [
          FS.createSourceRef({
            $tags: ['http://gedcomx.org/Death']
          })
        ];
      }
    };
    
    person.id = 'PPPP-PPP';

    var opportunity = fsCheck.check(person, sourceRefs);
    
    doc('missingBirthSource', opportunity);
    utils.validateSchema(fsCheck, opportunity, true, true);
  });

});
var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('missingDeathSource'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS,
    GedcomXDate = require('gedcomx-date');

describe('missingDeathSource', function(){

  it('should return nothing when there is no death', function(){
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: []
    });

    var sourceRefs = {
      getSourceRefs: function() {return [];}
    };

    var opportunity = fsCheck.check(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return nothing when there is no death year', function(){
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Death',
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

  it('should return nothing when there is no death place',function(){
    var person = FS.createPerson({
      $gender: 'http://gedcomx.org/Female',
      names: [],
      facts: [
        FS.createFact({
          type: 'http://gedcomx.org/Death',
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
          type: 'http://gedcomx.org/Death',
          $formalDate: '+1900',
          $place: 'Provo, Utah, United States of America'
        })
      ]
    });

    var sourceRefs = {
      getSourceRefs: function() {
        return [
          FS.createSourceRef({
            $tags: ['http://gedcomx.org/Death']
          })
        ];
      }
    };

    var opportunity = fsCheck.check(person, sourceRefs);

    expect(opportunity).to.equal(undefined);
  });

  it('should return an opportunity when there is a death and no sources', function(){
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
          type: 'http://gedcomx.org/Death',
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
    utils.validateSchema(fsCheck, opportunity, true);
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.deathPlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.deathDate).to.equal('1900');
  });

  it('should return an opportunity when there is a death and no sources tagged death', function(){
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
          type: 'http://gedcomx.org/Death',
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
            $tags: ['http://gedcomx.org/Birth']
          })
        ];
      }
    };
    
    person.id = 'PPPP-PPP';

    var opportunity = fsCheck.check(person, sourceRefs);
    
    doc('missingDeathSource', opportunity);
    utils.validateSchema(fsCheck, opportunity, true);
    expect(opportunity.gensearch.givenName).to.equal('Bob');
    expect(opportunity.gensearch.familyName).to.equal('Freemer');
    expect(opportunity.gensearch.deathPlace).to.equal('Provo, Utah, United States of America');
    expect(opportunity.gensearch.deathDate).to.equal('1900');
  });

});
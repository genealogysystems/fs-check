var expect = require('chai').expect,
    FSCheck = require('../');

var signatureCounts = {
  person: 18,
  personSource: 2,
  marriage: 6,
  marriageSource: 1,
  child: 2,
  children: 1,
  parents: 2,
  relationships: 4,
  duplicates: 1,
  recordHints: 1
};

var typeCounts = {
  source: 4,
  person: 9,
  family: 8,
  cleanup: 11,
  problem: 6
};

describe('FSCheck', function(){

  it('should expose seven functions', function(){
    expect(Object.keys(FSCheck)).to.have.length(9);
    expect(FSCheck).to.have.property('all');
    expect(FSCheck).to.have.property('id');
    expect(FSCheck).to.have.property('signature');
    expect(FSCheck).to.have.property('signatures');
    expect(FSCheck).to.have.property('type');
    expect(FSCheck).to.have.property('types');
    expect(FSCheck).to.have.property('utils');
    expect(FSCheck).to.have.property('language');
    expect(FSCheck).to.have.property('translate');
  });

  describe('FSCheck.all', function(){
    
    it('should return proper number of checks', function(){
      var checks = FSCheck.all();
      expect(checks).to.have.length(38);
    });
    
    it('checks should all have the correct format', function(){
      var checks = FSCheck.all();
      validateChecks(checks);
    });
    
    it('checks should all have unique ids', function(){
      var checks = FSCheck.all();
      // If calling fscheck by the check's id returns the
      // check itself for all checks then we know that all
      // checks have a unique id because if they didn't then
      // requesting a check by itss id would return whichever
      // check duplicated its id and stamped over it
      for(var i = 0; i < checks.length; i++){
        expect(FSCheck.id(checks[i].id)).to.equal(checks[i]);
      }
    });
    
  });
  
  describe('FSCheck.id', function(){
  
    it('should return the correct check', function(){
      var check = FSCheck.id('birthBeforeParentsBirth');
      expect(check.id).to.equal('birthBeforeParentsBirth');
      expect(check.type).to.equal('problem');
      expect(check.signature).to.equal('parents');
    });
  
  });
  
  describe('FSCheck.signatures', function(){
    
    it('should return correct number of signatures', function(){
      expect(FSCheck.signatures()).to.have.members(['person','personSource','marriage','marriageSource','child','children','parents','relationships','duplicates','recordHints']);
    });
    
  });
  
  describe('FSCheck.signature', function(){
    
    it('should return correct number of checks by signature', function(){
      for(var signature in signatureCounts){
        expect(FSCheck.signature(signature)).to.have.length(signatureCounts[signature]);
      }
    });
    
  });
  
  describe('FSCheck.type', function(){
  
    it('should return correct number of checks by type', function(){
      for(var type in typeCounts){
        expect(FSCheck.type(type)).to.have.length(typeCounts[type]);
      }
    });
  
  });
  
  describe('FSCheck.types', function(){
    
    it('should return correct number of types', function(){
      expect(FSCheck.types()).to.have.members(['person','source','family','problem','cleanup']);
    });
    
  });
  
  describe('languages', function(){
    
    before(function(){
      FSCheck.language(getFooLang());
    })

    it('should translate', function(){
      var opportunity = {
        checkId: 'bar',
        template: {
          name: 'Grand Stand'
        }
      };
      FSCheck.translate(opportunity, 'foo');
      expect(opportunity.title).to.equal('Fizz Buzz');
      expect(opportunity.description).to.equal('<p>Grand Stand has a fizz buzz named fooz bazz.</p>\n');
    })
    
    it('partials', function(){
      var opportunity = {
        checkId: 'bang'
      };
      FSCheck.translate(opportunity, 'foo');
      expect(opportunity.title).to.equal('Lorum Ipsum');
      expect(opportunity.description).to.equal('<p><strong>partialing</strong></p>\n');
    })
    
  })

});

function validateChecks(checks){
  for(var i = 0; i < checks.length; i++){
    validateCheck(checks[i]);
  }
};

function validateCheck(check){
  try {
    expect(check).to.exist;
    expect(check).to.have.keys(['id','type','signature','help','check']);
    
    // Validate type
    expect(['source','person','family','problem','cleanup']).to.include.members([check.type]);
    
    // Validate number of function args
    var argsLength;
    switch(check.signature){
      case 'person':
        argsLength = 1;
        break;
      case 'personSource':
      case 'children':
      case 'parents':
      case 'duplicates':
      case 'recordHints':
        argsLength = 2;
        break;
      case 'marriage':
      case 'relationships':
        argsLength = 3;
        break;
      case 'marriageSource':
      case 'child':
        argsLength = 4;
        break;
    };
    expect(check.check.length).to.equal(argsLength);
  } catch(error) {
    console.error(check.id + ' failed');
    throw error;
  }
}

/**
 * Mock template language for testing
 */
function getFooLang(){
  return {
    code: 'foo',
    checks: {
      bar: {
        title: 'Fizz Buzz',
        description: '{{name}} has a fizz buzz named fooz bazz.'
      },
      bang: {
        title: 'Lorum Ipsum',
        description: '{{> part1}}'
      }
    },
    partials: {
      part1: '__partialing__'
    }
  };
}
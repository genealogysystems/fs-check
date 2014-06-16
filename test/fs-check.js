var libPath = process.env.TEST_COV ? '../lib-cov' : '../lib',
    path = require('path'),
    expect = require('chai').expect,
    FSCheck = require(path.join(libPath, 'index.js'));

describe('FSCheck', function(){

  it('should expose four functions', function(){
    expect(Object.keys(FSCheck)).to.have.length(4);
    expect(FSCheck).to.have.property('all');
    expect(FSCheck).to.have.property('id');
    expect(FSCheck).to.have.property('signature');
    expect(FSCheck).to.have.property('type');
  });
  
  describe('FSCheck.all', function(){
    
    it('should return proper number of checks', function(){
      var checks = FSCheck.all();
      expect(checks).to.have.length(34);
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
      expect(check.title).to.equal('Person Born Before their Parent(s)');
      expect(check.type).to.equal('problem');
      expect(check.signature).to.equal('parents');
    });
  
  });
  
  describe('FSCheck.signature', function(){
    
    it('should return correct number of person checks', function(){
      var checks = FSCheck.signature('person');
      expect(checks).to.have.length(18);
    });
    
    it('should return correct number of personSource checks', function(){
      var checks = FSCheck.signature('personSource');
      expect(checks).to.have.length(2);
    });
    
    it('should return correct number of marriage checks', function(){
      var checks = FSCheck.signature('marriage');
      expect(checks).to.have.length(6);
    });
    
    it('should return correct number of marriageSource checks', function(){
      var checks = FSCheck.signature('marriageSource');
      expect(checks).to.have.length(1);
    });
    
    it('should return correct number of child checks', function(){
      var checks = FSCheck.signature('child');
      expect(checks).to.have.length(2);
    });
    
    it('should return correct number of parents checks', function(){
      var checks = FSCheck.signature('parents');
      expect(checks).to.have.length(2);
    });
    
    it('should return correct number of relationships checks', function(){
      var checks = FSCheck.signature('relationships');
      expect(checks).to.have.length(3);
    });
    
  });
  
  describe('FSCheck.type', function(){
  
    it('should return correct number of source checks', function(){
      var checks = FSCheck.type('source');
      expect(checks).to.have.length(3);
    });
    
    it('should return correct number of person checks', function(){
      var checks = FSCheck.type('person');
      expect(checks).to.have.length(9);
    });
    
    it('should return correct number of family checks', function(){
      var checks = FSCheck.type('family');
      expect(checks).to.have.length(6);
    });
    
    it('should return correct number of cleanup checks', function(){
      var checks = FSCheck.type('cleanup');
      expect(checks).to.have.length(12);
    });
  
    it('should return correct number of problem checks', function(){
      var checks = FSCheck.type('problem');
      expect(checks).to.have.length(4);
    });
  
  });

});

function validateChecks(checks){
  for(var i = 0; i < checks.length; i++){
    validateCheck(checks[i]);
  }
};

function validateCheck(check){
  try {
    expect(check).to.exist;
    expect(check).to.have.keys(['id','title','type','signature','check']);
    
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
};
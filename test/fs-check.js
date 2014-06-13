var libPath = process.env.TEST_COV ? '../lib-cov' : '../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FSCheck = require(path.join(libPath, 'index.js'));

describe('FSCheck', function(){

  // TODO need a way to make sure that no two checks have the same id

  // TODO validate schema of all checks

  it('should expose three functions', function(){
    expect(Object.keys(FSCheck)).to.have.length(3);
    expect(FSCheck).to.have.property('id');
    expect(FSCheck).to.have.property('signature');
    expect(FSCheck).to.have.property('type');
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
    
    // TODO validate signature of check functions
    //      to make sure they have the correct arguments
    
    it('should return correct number of parents checks', function(){
      var checks = FSCheck.signature('parents');
      expect(checks).to.have.length(1);
    });
    
  });
  
  describe('FSCheck.type', function(){
  
    it('should return correct number of problem checks', function(){
      var checks = FSCheck.type('problem');
      expect(checks).to.have.length(1);
    });
  
  });

});
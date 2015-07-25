var loadLang = require('../../lang/load-language'),
    data = loadLang('en'),
    expect = require('chai').expect;

describe('fs-check-en', function(){
    
  it('en', function(){
    expect(data.code).to.equal('en');
  })
  
  it('all checks have a title and description', function(){
    for(var name in data.checks){
      try {
        expect(data.checks[name].title).to.have.length.above(1);
        expect(data.checks[name].description).to.have.length.above(1);
        expect(data.checks[name].description).to.contain('\n');
      } catch(e) {
        console.error('Error validating ' + name);
        throw(e);
      }
    }
  })
    
  it('partials loaded properly', function(){
    for(var name in data.partials){
      expect(data.partials[name]).to.have.length.above(1);
    }
  })
    
})
var expect = require('chai').expect,
    FamilySearch = require('../vendor/familysearch-javascript-sdk.js');

module.exports = {

  /**
   * Mka
   */
  validateSchema: function(check, opportunity, findarecord, gensearch){
    expect(opportunity).to.exist;
    
    expect(opportunity).to.contain.keys(['id','type','title','description','person']);
    expect(opportunity.id).to.match(new RegExp('^' + check.id + ':'));
    expect(opportunity.type).to.equal(check.type);
    expect(opportunity.title).to.equal(check.title);
    expect(opportunity.description).to.have.length.above(1);
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    
    if(findarecord){
      expect(opportunity).to.have.property('findarecord');
    } else {
      expect(opportunity.findarecord).to.not.exist;
    }
    
    if(gensearch){
      expect(opportunity).to.have.property('gensearch');
    } else {
      expect(opportunity.gensearch).to.not.exist;
    }
  },
  
  /**
   * Generate person with an id, name, and death fact
   */
  generatePerson: function(data){
    if(!data){
      data = {};
    }
    var person = new FamilySearch.Person(data);
    person.id = data.id;
    person.display = { name: data.name };
    return person;
  }

};
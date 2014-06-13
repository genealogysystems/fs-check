var expect = require('chai').expect,
    FamilySearch = require('../vendor/familysearch-javascript-sdk.js');

module.exports = {

  validateSchema: function(opportunity, schema){
    expect(opportunity).to.contain.keys(['id','type','title','description','person']);
    expect(opportunity.id).to.match(new RegExp('^' + schema.id + ':'));
    expect(opportunity.type).to.equal(schema.type);
    expect(opportunity.title).to.equal(schema.title);
    expect(opportunity.description).to.have.length.above(1);
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    
    if(schema.findarecord){
      expect(opportunity).to.have.property('findarecord');
    } else {
      expect(opportunity.findarecord).to.not.exist;
    }
    
    if(schema.gensearch){
      expect(opportunity).to.have.property('gensearch');
    } else {
      expect(opportunity.gensearch).to.not.exist;
    }
  }

};
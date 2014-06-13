var expect = require('chai').expect,
    FamilySearch = require('../vendor/familysearch-javascript-sdk.js');

module.exports = {

  validateOpportunitySchema: function(opportunity, findarecord, gensearch){
    expect(opportunity).to.have.property('id');
    expect(opportunity).to.have.property('type');
    expect(opportunity).to.have.property('title');
    expect(opportunity).to.have.property('description');
    expect(opportunity).to.have.property('person');
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
  }

};
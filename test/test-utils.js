var expect = require('chai').expect,
    FamilySearch = require('../vendor/familysearch-javascript-sdk.js'),
    q = require('q');

module.exports = {

  /**
   * All tests share the same SDK client
   */
  FS: new FamilySearch({
    client_id: 'ID',
    environment: 'sandbox',
    access_token: 'SOME_ACCESS_TOKEN',
    redirect_uri: '/', // https://github.com/rootsdev/familysearch-javascript-sdk/issues/87
    http_function: function(){},
    deferred_function: q.defer
  }),

  /**
   * Mka
   */
  validateSchema: function(check, opportunity, gensearch){
    expect(opportunity).to.exist;
    
    expect(opportunity).to.contain.keys(['id','type','template','checkId', 'personId','person']);
    expect(opportunity.id).to.match(new RegExp('^' + check.id + ':'));
    expect(opportunity.type).to.equal(check.type);
    expect(opportunity.person).to.be.instanceof(FamilySearch.Person);
    
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
    if(data.gender){
      data.$gender = data.gender;
      delete data.gender;
    }
    var person = this.FS.createPerson(data);
    person.id = data.id;
    person.display = { name: data.name };
    return person;
  },
  
  asyncTest: function(done, f){
    try {
      f();
      done();
    } catch(e) {
      done(e);
    }
  }

};
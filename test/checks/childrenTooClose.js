var libPath = process.env.TEST_COV ? '../../lib-cov' : '../../lib',
    path = require('path'),
    expect = require('chai').expect,
    FamilySearch = require('../../vendor/familysearch-javascript-sdk.js'),
    fsCheck = require(path.join(libPath, 'index.js')).id('childrenTooClose'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    GedcomXDate = require('gedcomx-date');

describe('childrenTooClose', function(){

  it('should return nothing for males', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Male'
    });
    expect(fsCheck.check(person, generateChildren([
      {formalDate: '+1900-01-01'},
      {formalDate: '+1900-03-05'}
    ]))).to.not.exist;
  });
  
  it('should return nothing for females with no children', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Female'
    });
    expect(fsCheck.check(person, [])).to.not.exist;
  });
  
  it('should return nothing for females with children more than 9 months apart', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Female'
    });
    expect(fsCheck.check(person, generateChildren([
      {formalDate: '+1900-01-01'},
      {formalDate: '+1901-11-01'}
    ]))).to.not.exist;
  });
  
  it('should return nothing for females with children exactly 9 months apart', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Female'
    });
    expect(fsCheck.check(person, generateChildren([
      {formalDate: '+1900-01-01'},
      {formalDate: '+1900-10-01'}
    ]))).to.not.exist;
  });
  
  it('should return opportunity for females with children closer than 9 months', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Female'
    });
    var opportunity = fsCheck.check(person, generateChildren([
      {formalDate: '+1900-01-01'},
      {formalDate: '+1900-09-30'}
    ]));
    utils.validateSchema(fsCheck, opportunity);
  });
  
  it('should return opportunity for females with multiple children close than 9 months', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Female',
      name: 'Sarah Sue'
    });
    var opportunity = fsCheck.check(person, generateChildren([
      {formalDate: '+1899-01-01', name: 'Sally Smith'},
      {formalDate: '+1900-01-01', name: 'Joe Adams'},
      {formalDate: '+1900-09-30', name: 'Adam Smith'},
      {name: 'David John'},
      {formalDate: '+1900-12-15', name: 'Mary Jane'},
      {formalDate: '+1901-05-01', name: 'Laura Doe'}
    ]));
    utils.validateSchema(fsCheck, opportunity);
    doc('childrenTooClose', opportunity);
  });
  
});

/**
 * Generate a list of children with the given birth dates
 */
function generateChildren(dates){
  var children = [];
  for(var i = 0; i < dates.length; i++){
    children.push(generateChild(dates[i]));
  }
  return children;
};

function generateChild(data){
  if(data){
    data.facts = [
      {
        type: 'http://gedcomx.org/Birth',
        formalDate: data.formalDate
      }
    ];
  }
  return utils.generatePerson(data);
};
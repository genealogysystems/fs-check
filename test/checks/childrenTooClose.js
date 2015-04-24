var expect = require('chai').expect,
    fsCheck = require('../../lib/index.js').id('childrenTooClose'),
    doc = require('../../docs/util.js'),
    utils = require('../test-utils.js'),
    FS = utils.FS;

describe('childrenTooClose', function(){

  it('should return nothing for males', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Male'
    });
    expect(fsCheck.check(person, generateChildren([
      {$formalDate: '+1900-01-01'},
      {$formalDate: '+1900-03-05'}
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
      {$formalDate: '+1900-01-01'},
      {$formalDate: '+1901-11-01'}
    ]))).to.not.exist;
  });
  
  it('should return nothing for females with children exactly 9 months apart', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Female'
    });
    expect(fsCheck.check(person, generateChildren([
      {$formalDate: '+1900-01-01'},
      {$formalDate: '+1900-10-01'}
    ]))).to.not.exist;
  });
  
  it('should return opportunity for females with children closer than 9 months', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Female'
    });
    var opportunity = fsCheck.check(person, generateChildren([
      {$formalDate: '+1900-01-01'},
      {$formalDate: '+1900-09-30'}
    ]));
    utils.validateSchema(fsCheck, opportunity);
  });
  
  it('should return opportunity for females with multiple children closer than 9 months', function(){
    var person = utils.generatePerson({
      gender: 'http://gedcomx.org/Female',
      name: 'Sarah Sue'
    });
    var opportunity = fsCheck.check(person, generateChildren([
      {$formalDate: '+1899-01-01', name: 'Sally Smith'},
      {$formalDate: '+1900-01-01', name: 'Joe Adams'},
      {$formalDate: '+1900-09-30', name: 'Adam Smith'},
      {name: 'David John'},
      {$formalDate: '+1900-12-15', name: 'Mary Jane'},
      {$formalDate: '+1901-05-01', name: 'Laura Doe'}
    ]));
    utils.validateSchema(fsCheck, opportunity);
    doc('childrenTooClose', opportunity);
  });
  
  it('should ignore approximate flag on dates', function(){
    function invalid(){
      var person = utils.generatePerson({
        gender: 'http://gedcomx.org/Female'
      });
      fsCheck.check(person, generateChildren([
        {$formalDate: 'A+1776'},
        {$formalDate: '+1776'}
      ]));
    };
    expect(invalid).to.not.throw(Error);
  });
  
  it('should work for partial dates', function(){
    function invalid(){
      var person = utils.generatePerson({
        gender: 'http://gedcomx.org/Female'
      });
      fsCheck.check(person, generateChildren([
        {$formalDate: '+1562-02-12'},
        {$formalDate: 'A+1562'},
        {$formalDate: '+1562-01-11/+1563-01-10'},
        {$formalDate: 'A+1562'},
        {$formalDate: '+1562-02-12'},
        {$date: 'about 1562'},
      ]));
    };
    expect(invalid).to.not.throw(Error);
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

function generateChild(birth){
  var data = {};
  if(birth){
    birth.type = 'http://gedcomx.org/Birth';
    data.facts = [ birth ];
  }
  return utils.generatePerson(data);
};
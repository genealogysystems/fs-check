var expect = require('chai').expect,
    FSCheck = require('../lib/index.js'),
    util = require('../lib/util'),
    FS = require('./test-utils').FS;

describe('util', function(){

  it('utils exposes 4 functions', function(){
    expect(FSCheck.utils).to.have.property('getFactYear');
    expect(FSCheck.utils).to.have.property('getFactPlace');
    expect(FSCheck.utils).to.have.property('gedcomxDate');
    expect(FSCheck.utils).to.have.property('gensearchPerson');
  });

  describe('getFactPlace()', function(){

    it('should return undefined when no place is set', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: 'January 1, 1900'
      });

      var place = util.getFactPlace(fact);

      expect(place).to.equal(undefined);
    });

    it('should return the normalized place when only normalized is set', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: 'January 1, 1900',
        $normalizedPlace: 'Provo, Utah, United States of America'
      });

      var place = util.getFactPlace(fact);

      expect(place).to.equal('Provo, Utah, United States of America');
    });

    it('should return the original place when only original is set', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: 'January 1, 1900',
        $place: 'Provo, Utah, United States of America'
      });

      var place = util.getFactPlace(fact);

      expect(place).to.equal('Provo, Utah, United States of America');
    });

    it('should return the normalized place when original and normalized are set', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: 'January 1, 1900',
        $place: 'Orem, Utah, United States of America',
        $normalizedPlace: 'Provo, Utah, United States of America'
      });

      var place = util.getFactPlace(fact);

      expect(place).to.equal('Provo, Utah, United States of America');
    });

  });

  describe('getFactYear()', function(){

    it('should return undefined when no date is set', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $place: 'Provo, Utah, United States of America'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal(undefined);
    });

    it('should return the formal year when only formal date is set', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '+1900-01-01',
        $place: 'Provo, Utah, United States of America'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal(1900);
    });

    it('should return the original year when only original date is set', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: 'January 1, 1900',
        $place: 'Provo, Utah, United States of America'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal(1900);
    });

    it('should return the formal year when original and formal date is set', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: 'January 1, 1901',
        $formalDate: 'A+1900-01-01',
        $place: 'Provo, Utah, United States of America'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal(1900);
    });

    it('should return the start formal year in a range/', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '+1900-01-01/',
        $place: 'Provo, Utah, United States of America'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal(1900);
    });

    it('should return the start formal year in a /range', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '/+1900-01-01',
        $place: 'Provo, Utah, United States of America'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal(1900);
    });

    it('should return the middle formal year in a start/end range', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '+1900-01-01/+1910-01-01',
        $place: 'Provo, Utah, United States of America'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal(1905);
    });
    
    it('should return the middle formal year in a start/end range', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '+1707-02-22/+1707-03-09',
        $place: 'Provo, Utah, United States of America'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal(1707);
    });
    
    it('should catch the exception thrown by parsing an invalid GEDCOMX date', function() {
      var fact = FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $formalDate: '+1900-02-31',
            $place: 'Provo, Utah, United States of America'
          }),
          fn = function(){
            util.getFactYear(fact);
          };
      expect(fn).to.not.throw(Error);
    });
    
    it('should return the original year', function(){
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Death',
        $date: '1901'
      });
      var year = util.getFactYear(fact);
      expect(year).to.equal('1901');
    });
    
    it('should return undefined for "Deceased"', function() {
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Death',
        $date: 'Deceased'
      });

      var year = util.getFactYear(fact);

      expect(year).to.not.exist;
    });

  });
  
  describe('getFormalDate()', function(){
    
    it('should return simple as-is', function(){
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '+1569-04-27'
      });
      var date = util.getFormalDate(fact);
      expect(date).to.equal('+1569-04-27');
    });
    
    it('should return start date of open-ended future range', function(){
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '+1569-04-27/'
      });
      var date = util.getFormalDate(fact);
      expect(date).to.equal('+1569-04-27');
    });
    
    it('should return end date of open-ended past range', function(){
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '/+1569-04-27'
      });
      var date = util.getFormalDate(fact);
      expect(date).to.equal('+1569-04-27');
    });
    
    it('should return middle of closed range', function(){
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $formalDate: '+1569-04-10/+1571-04-10'
      });
      var date = util.getFormalDate(fact);
      expect(date).to.equal('+1570-04-10');
    });
    
    it('should return simple date created by parsing into js date', function(){
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: '4 Mar 1845'
      });
      var date = util.getFormalDate(fact);
      expect(date).to.equal('+1845-03-04');
    });
    
    it('should return simple date with just the year', function(){
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: '1845'
      });
      var date = util.getFormalDate(fact);
      expect(date).to.equal('+1845');
    });
    
    it('should return undefined with unparsable format', function(){
      var fact = FS.createFact({
        type: 'http://gedcomx.org/Birth',
        $date: 'octber 7th 1845'
      });
      var date = util.getFormalDate(fact);
      expect(date).to.not.exist;
    });
    
  });
  
  describe('getSimpleFormalDate()', function(){
  
    it('simple date', function(){
      var originalFormal = '+1707-03-09',
          date = util.getSimpleFormalDate(originalFormal),
          newFormal = date.toFormalString();
      expect(newFormal).to.equal(originalFormal);
    });
    
    it('date range open start', function(){
      var originalFormal = '/+1707-03-09',
          date = util.getSimpleFormalDate(originalFormal),
          newFormal = date.toFormalString();
      expect(newFormal).to.equal('+1707-03-09');
    });
    
    it('date range open end', function(){
      var originalFormal = '+1707-02-22/',
          date = util.getSimpleFormalDate(originalFormal),
          newFormal = date.toFormalString();
      expect(newFormal).to.equal('+1707-02-22');
    });
    
    it('date range closed', function(){
      var originalFormal = '+1707-02-22/+1707-03-09',
          date = util.getSimpleFormalDate(originalFormal),
          newFormal = date.toFormalString();
      expect(newFormal).to.equal('+1707-03-02');
    });
    
    it('should not hit a parse error on tricky ranges', function(){
      var ranges = [
        '+1771-08-30/+1771-10-01',
        '+1827-10-30/+1827-12-01',
        '+1615-01-28/+1615-03-01',
        '+1909-01-30/+1909-03-03',
        '+1694-10-30/+1694-12-01'
      ];
      for(var i = 0; i < ranges.length; i++){
        expect(util.getSimpleFormalDate(ranges[i])).to.exist;
      }
    })
  
  });

  describe('markdown()', function(){
    
    it('should return html', function() {
      var html = util.markdown('# h1\n## h2\n### h3\nStuff!');
      expect(html).to.equal("<h1>h1</h1>\n<h2>h2</h2>\n<h3>h3</h3>\n<p>Stuff!</p>\n");
    });

    it('should replace mustache vars', function() {
      var html = util.markdown('number {{one}}\nnumber {{two}}\nmissing {{three}}',{one:'one', two: 'two'});
      expect(html).to.equal("<p>number one\nnumber two\nmissing </p>\n");
    });

  });
  
  describe('gensearchPerson()', function(){
  
    it('should return an object with just givenName', function(){
      var person = FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        names: [
          FS.createName({
            $givenName: 'Mary'
          })
        ]
      });
      var gensearch = util.gensearchPerson(person);
      expect(gensearch).to.deep.equal({
        givenName: 'Mary'
      });
    });
    
    it('should return an object with familyName', function(){
      var person = FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        names: [
          FS.createName({
            $surname: 'Adams'
          })
        ]
      });
      var gensearch = util.gensearchPerson(person);
      expect(gensearch).to.deep.equal({
        familyName: 'Adams'
      });
    });
    
    it('should return an object with birthDate', function(){
      var person = FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1900',
            $formalDate: '+1900-01-01',
          })
        ]
      });
      var gensearch = util.gensearchPerson(person);
      expect(gensearch).to.deep.equal({
        birthDate: '1900'
      });
    });
    
    it('should return an object with birthPlace', function(){
      var person = FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $place: 'Provo, Utah, Utah, United States'
          })
        ]
      });
      var gensearch = util.gensearchPerson(person);
      expect(gensearch).to.deep.equal({
        birthPlace: 'Provo, Utah, Utah, United States'
      });
    });
    
    it('should return an object with deathDate', function(){
      var person = FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Death',
            $date: 'January 1, 1900',
            $formalDate: '+1900-01-01',
          })
        ]
      });
      var gensearch = util.gensearchPerson(person);
      expect(gensearch).to.deep.equal({
        deathDate: '1900'
      });
    });
    
    it('should return an object with deathPlace', function(){
      var person = FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Death',
            $place: 'Provo, Utah, Utah, United States'
          })
        ]
      });
      var gensearch = util.gensearchPerson(person);
      expect(gensearch).to.deep.equal({
        deathPlace: 'Provo, Utah, Utah, United States'
      });
    });
    
    it('should return a gensearch object with name, birth, and death info', function(){
      var person = FS.createPerson({
        gender: 'http://gedcomx.org/Female',
        names: [
          FS.createName({
            $givenName: 'Mary',
            $surname: 'Adams'
          })
        ],
        facts: [
          FS.createFact({
            type: 'http://gedcomx.org/Birth',
            $date: 'January 1, 1900',
            $formalDate: '+1900-01-01',
            $place: 'Provo, Utah, United States'
          }),
          FS.createFact({
            type: 'http://gedcomx.org/Death',
            $date: 'January 1, 2000',
            $formalDate: '+2000-01-01',
            $place: 'Orem, Utah, United States'
          })
        ]
      });
      var gensearch = util.gensearchPerson(person);
      expect(gensearch).to.deep.equal({
        givenName: 'Mary',
        familyName: 'Adams',
        birthDate: '1900',
        birthPlace: 'Provo, Utah, United States',
        deathDate: '2000',
        deathPlace: 'Orem, Utah, United States'
      });
    });
  
  });
  
  describe('compareFormalDates()', function(){
  
    it('same dates return 0', function(){
      var result = util.compareFormalDates('+1980-01-01', '+1980-01-01');
      expect(result).to.equal(0);
    });
    
    it('first date is earlier', function(){
      var result = util.compareFormalDates('+1970-01-01', '+1980-01-01');
      expect(result).to.equal(-1);
    });
    
    it('first date is later', function(){
      var result = util.compareFormalDates('+1990-01-01', '+1980-01-01');
      expect(result).to.equal(1);
    });
    
    it('ignore approximate when comparing', function(){
      var result = util.compareFormalDates('A+1662', '+1662');
      expect(result).to.equal(0);
      result = util.compareFormalDates('+1662', 'A+1662');
      expect(result).to.equal(0);
    });
    
    it('work for partial dates', function(){
      var result = util.compareFormalDates('+1880', '+1880-02-04');
      expect(result).to.equal(0);
      result = util.compareFormalDates('+1880-02', '+1880-02-04');
      expect(result).to.equal(0);
      result = util.compareFormalDates('+1880', '+1880-02');
      expect(result).to.equal(0);
      
      result = util.compareFormalDates('+1881', '+1880-02-04');
      expect(result).to.equal(1);
      result = util.compareFormalDates('+1881-02', '+1880-02-04');
      expect(result).to.equal(1);
      result = util.compareFormalDates('+1881', '+1880-02');
      expect(result).to.equal(1);
    })
  
  });

});
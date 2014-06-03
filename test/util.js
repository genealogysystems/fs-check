var libPath = process.env.TEST_COV ? '../lib-cov' : '../lib',
    path = require('path'),
    fs = require('fs'),
    expect = require('chai').expect,
    FamilySearch = require('../vendor/familysearch-javascript-sdk.js'),
    util = require(path.join(libPath, 'util.js'));

describe('util', function(){

  describe('#getFactPlace()', function(){

    it('should return undefined when no place is set', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        date: 'January 1, 1900'
      });

      var place = util.getFactPlace(fact);

      expect(place).to.equal(undefined);
    });

    it('should return the normalized place when only normalized is set', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        date: 'January 1, 1900',
        normalizedPlace: 'Provo, Utah, United States of America'
      });

      var place = util.getFactPlace(fact);

      expect(place).to.equal('Provo, Utah, United States of America');
    });

    it('should return the original place when only original is set', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        date: 'January 1, 1900',
        place: 'Provo, Utah, United States of America'
      });

      var place = util.getFactPlace(fact);

      expect(place).to.equal('Provo, Utah, United States of America');
    });

    it('should return the normalized place when original and normalized are set', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        date: 'January 1, 1900',
        place: 'Orem, Utah, United States of America',
        normalizedPlace: 'Provo, Utah, United States of America'
      });

      var place = util.getFactPlace(fact);

      expect(place).to.equal('Provo, Utah, United States of America');
    });

  });

  describe('#getFactYear()', function(){

    it('should return undefined when no date is set', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        place: 'Provo, Utah, United States of America'
      });

      var year = util.getFactYear(fact);

      expect(year).to.equal(undefined);
    });

    it('should return the formal year when only formal date is set', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        formalDate: '+1900-01-01',
        place: 'Provo, Utah, United States of America'
      });

      var year = util.getFactYear(fact);

      expect(year).to.equal(1900);
    });

    it('should return the original year when only original date is set', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        date: 'January 1, 1900',
        place: 'Provo, Utah, United States of America'
      });

      var year = util.getFactYear(fact);

      expect(year).to.equal(1900);
    });

    it('should return the formal year when original and formal date is set', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        date: 'January 1, 1901',
        formalDate: 'A+1900-01-01',
        place: 'Provo, Utah, United States of America'
      });

      var year = util.getFactYear(fact);

      expect(year).to.equal(1900);
    });

    it('should return the start formal year in a range/', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        formalDate: '+1900-01-01/',
        place: 'Provo, Utah, United States of America'
      });

      var year = util.getFactYear(fact);

      expect(year).to.equal(1900);
    });

    it('should return the start formal year in a /range', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        formalDate: '/+1900-01-01',
        place: 'Provo, Utah, United States of America'
      });

      var year = util.getFactYear(fact);

      expect(year).to.equal(1900);
    });

    it('should return the middle formal year in a start/end range', function() {
      var fact = new FamilySearch.Fact({
        type: 'http://gedcomx.org/Birth',
        formalDate: '+1900-01-01/+1910-01-01',
        place: 'Provo, Utah, United States of America'
      });

      var year = util.getFactYear(fact);

      expect(year).to.equal(1905);
    });
    
    it('should catch the exception thrown by parsing an invalid GEDCOMX date', function() {
      var fact = new FamilySearch.Fact({
            type: 'http://gedcomx.org/Birth',
            formalDate: '+1900-02-31',
            place: 'Provo, Utah, United States of America'
          }),
          fn = function(){
            util.getFactYear(fact);
          };
      expect(fn).to.not.throw(Error);
    });

  });

  describe('#markdown()', function(){
    
    it('should return html', function() {
      var html = util.markdown(function(){/*
        # h1
        ## h2
        ### h3
        Stuff!
      */});

      expect(html).to.equal("<h1>h1</h1>\n<h2>h2</h2>\n<h3>h3</h3>\n<p>Stuff!</p>\n");
    });

    it('should replace mustache vars', function() {
      var html = util.markdown(function(){/*
        number {{one}}
        number {{two}}
        missing {{three}}
      */},{one:'one', two: 'two'});

      expect(html).to.equal("<p>number one\nnumber two\nmissing </p>\n");
    });

  });

});
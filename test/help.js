var help = require('../lib/help'),
    expect = require('chai').expect;

describe('help', function(){
  
  describe('links', function(){
    
    it('returns nothing with no arguments', function(){
      expect(help.links()).to.deep.equal([]);
    });
    
    it('returns one link', function(){
      expect(help.links('nonexactDates')).to.deep.equal(['https://familysearch.org/ask/salesforce/viewArticle?urlname=Do-not-know-exact-birth-date-or-death-date']);
    });
    
    it('returns multiple links', function(){
      expect(help.links('nonexactDates','addingAndCorrecting')).to.deep.equal([
        'https://familysearch.org/ask/salesforce/viewArticle?urlname=Do-not-know-exact-birth-date-or-death-date',
        'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-and-Correcting-Information-about-People-and-Relationships'
      ])
    });
    
    it('ignores invalid args', function(){
      expect(help.links('foobaz',null,2)).to.deep.equal([]);
    });
    
  })
  
})
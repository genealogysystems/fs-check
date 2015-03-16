/**
 * Central control of help doc links
 */
 
var docs = {
  addingAndCorrecting: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-and-Correcting-Information-about-People-and-Relationships',
  alreadyInTree: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree',
  correctingInformation: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Correcting-Information-about-a-Person',
  customEvents: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-a-Custom-Event-or-Fact-to-a-Person',
  nonexactDates: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Do-not-know-exact-birth-date-or-death-date'
};

module.exports = {
  
  links: function(){
    var links = [];
    for(var i = 0; i < arguments.length; i++){
      if(docs[arguments[i]]){
        links.push(docs[arguments[i]]);
      }
    }
    return links;
  }
  
};
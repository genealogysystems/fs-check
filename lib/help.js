/**
 * Central control of help doc links
 */
 
var docs = {
  addingAndCorrecting: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-and-Correcting-Information-about-People-and-Relationships',
  alreadyInTree: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree',
  correctingInformation: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Correcting-Information-about-a-Person',
  customEvents: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-a-Custom-Event-or-Fact-to-a-Person',
  deletingInformation: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Deleting-a-Person-from-the-System',
  mergingDuplicates: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Merging-Duplicate-Records-in-Family-Tree-1381814853391',
  nonexactDates: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Do-not-know-exact-birth-date-or-death-date',
  recordHints: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Record-Hints'
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
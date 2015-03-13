/**
 * Central control of help doc links
 */
 
var docs = {
  addingAndCorrecting: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-and-Correcting-Information-about-People-and-Relationships',
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
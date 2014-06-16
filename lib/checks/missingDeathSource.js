var utils = require('../util.js');

module.exports = {
  id: 'missingDeathSource',
  type: 'source',
  title: 'Find a Death Record',
  signature: 'personSource',
  check: function(person, sourceRefs) {

    var death = person.$getDeath();

    // If we have no death return
    if(!death) {
      return;
    }

    var year = utils.getFactYear(death),
        place = utils.getFactPlace(death);

    // If we have no year or place
    if(year === undefined || place == undefined) {
      return;
    }

    // See if we have sources tagged for this death
    var sourceArr = sourceRefs.getSourceRefs(),
        tagged = false;
    for(var x in sourceArr) {
      if(sourceArr[x].$getTags().indexOf('http://gedcomx.org/Death') !== -1) {
        tagged = true;
      }
    }

    if(!tagged) {

      var descr = utils.markdown(function(){/*
        Start by searching collections containing Death records for the place and time you are looking for.
        If you haven't found a record in any of those collections, try expanding your search to some of the popular online repositories.
        If you still haven't found it, try using Find-A-Record to look for collections that are not available online (like microfilm).
        Once you have found a record of the death, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and enter it as a source.

        ## Help
    
        * [Adding a source to the Family Tree](https://familysearch.org/ask/productSupport#/Attaching-Sources-to-People-and-Relationships)
      */}, {pid:  person.id});

      return {
        id: this.id + ':' + person.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: person,
        findarecord: {
          tags: ['death'],
          from: (year)? year-3:undefined,
          to: (year)? year+3:undefined,
          place: place
        },
        gensearch: {
          givenName: person.$getGivenName(),
          familyName: person.$getSurname(),
          deathPlace: place,
          deathDate: year+'',
        }
      };
    }
    
  }
};
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

      var findarecord = {
        tags: ['death'],
        from: (year)? year-3:undefined,
        to: (year)? year+3:undefined,
        place: place
      };
    
      var descr = utils.markdown(function(){/*
        Follow these steps to find a death record for [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}):

        1. Review the [record hints](https://familysearch.org/tree/#view=allMatchingRecords&person={{pid}}) in FamilySearch.
        1. Do a broad searches on popular genealogy websites using the links below or the [RootsSearch](https://chrome.google.com/webstore/detail/rootssearch/aolcffalbhpnojekmimmelebjchjmmgn?hl=en) Chrome Extension.
        1. Use the record search feature of [Find-A-Record]({{farUrl}}).
        1. Ask for help at the [Genealogy and Family History](http://genealogy.stackexchange.com/) Stack Exchange website.
        1. Visit a local [Family History Center](https://familysearch.org/ask/help#localResource).
        1. Hire a researcher from the [genlighten](http://www.genlighten.com/) community.
      */}, {
        pid:  person.id,
        name: person.$getDisplayName(),
        farUrl: utils.farSearchUrl(findarecord)
      });

      return {
        id: this.id + ':' + person.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: person,
        findarecord: findarecord,
        gensearch: utils.gensearchPerson(person)
      };
    }
    
  }
};
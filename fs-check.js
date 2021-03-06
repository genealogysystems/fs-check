!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.FSCheck=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. Person has a birth fact
 *  2. Person has a birth date
 *  3. A Parent has a birth date before Person
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'birthBeforeParentsBirth',
  type: 'problem',
  signature: 'parents',
  help: ['nonexactDates','addingAndCorrecting'],
  check: function(person, parents) {

    var birthBeforeParentBirth = [],
        birth = person.$getBirth(),
        addParent = function(parent){
          birthBeforeParentBirth.push({
            id: parent.id,
            name: parent.$getDisplayName(),
            birth: parent.$getDisplayBirthDate()
          });
        };
        
    if(!birth || !birth.date) {
      return;
    }
    
    var birthFormal = utils.getFormalDate(birth);
    
    if(!birthFormal || !utils.isFullDate(birthFormal)){
      return;
    }
    
    for(var i = 0; i < parents.length; i++){
      var parentBirth = parents[i].$getBirth();
      if(parentBirth){
        var parentBirthDate = utils.getFormalDate(parentBirth);
        if(parentBirthDate && utils.isFullDate(parentBirthDate) && utils.compareFormalDates(birthFormal, parentBirthDate) === -1){
          addParent(parents[i]);
        }
      }
    }

    if(birthBeforeParentBirth.length > 0) {
      var template = {
        pid:  person.id,
        personName: person.$getDisplayName(),
        personBirth: person.$getDisplayBirthDate(),
        parents: birthBeforeParentBirth
      };
      return utils.createOpportunity(this, person, template);
    }
  }
}
},{"../help":39,"../util":41}],2:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  - The person has a marriage with children where at least one of the children
 *    was born before the marriage.
 */
var utils = _dereq_('../util'),
    GedcomXDate = _dereq_('gedcomx-date');

module.exports = {
  id: 'childBeforeMarriage',
  type: 'problem',
  signature: 'relationships',
  help: ['addingAndCorrecting', 'parentRelationshipType'],
  check: function(person, relationships, persons) {

    var marriages = relationships.getSpouseRelationships(),
        childrenBeforeMarriage = [];
    
    // Short-circuit if there are no marriages
    if(marriages.length === 0){
      return;
    }
    
    // For each marriage that has a marriage date,
    // look to see if the children were born before the marriage
    for(var i = 0; i < marriages.length; i++){
      
      var marriage = marriages[i],
          marriageFacts = marriage.$getFacts(),
          marriageDates = [];
      
      // Collect all available formal marriage dates
      for(var j = 0; j < marriageFacts.length; j++){
        var fact = marriageFacts[j];
        if(fact.type === 'http://gedcomx.org/Marriage'){
          var date = utils.getFormalDate(fact);
          if(date){
            date = new GedcomXDate(date);
            utils.ensureFullDate(date, 1, 1);
            marriageDates.push(date);
          }
        }
      }
      
      if(marriageDates.length === 0){
        continue;
      }
      
      // Sort the marriage dates to find the earliest one
      marriageDates.sort(utils.compareFormalDates);
      
      var marriageDate = marriageDates[0];
      
      // Get a list of children in this marriage
      var children = relationships.getChildRelationshipsOf(marriage.$getSpouseId(person.id));
      
      // Short circuit if there are no children in this marriage
      if(children.length === 0){
        continue;
      }
      
      // For each child in this marriage, check to see if they
      // have a birth date, if the relationships are biologica,
      // and if the birth date is before the marriage date
      for(var j = 0; j < children.length; j++){
      
        var rel = children[j],
            childId = rel.$getChildId(),
            child = persons[childId];
        
        // Short-circuit if we can't find the child. This should never happen.
        if(!child){
          continue;
        }
        
        // Short-circuit if the relationships are not biological
        if(!utils.isBiologicalChildAndParents(rel)){
          continue;
        }
        
        var birth = child.$getBirth();
        
        // Short-circuit if the child has no birth fact
        if(!birth){
          continue;
        }
        
        var birthDate = utils.getFormalDate(birth);
        
        // Short-circuit if the birth fact doesn't have a formal date
        if(!birthDate){
          continue;
        }
        
        birthDate = new GedcomXDate(birthDate);
        utils.ensureFullDate(birthDate, 12, 31);
        
        if(utils.compareFormalDates(marriageDate, birthDate) === 1){
          childrenBeforeMarriage.push({
            marriage: marriage,
            child: child,
            birthDate: birthDate
          });
        }
      }
    }

    if(childrenBeforeMarriage.length > 0) {
    
      var children = [];
      for(var i = 0; i < childrenBeforeMarriage.length; i++){
        var data = childrenBeforeMarriage[i],
            spouseId = data.marriage.$getSpouseId(person.id),
            spouse = persons[spouseId],
            child = data.child;
        children.push({
          spouseName: spouse.$getDisplayName(),
          spouseId: spouseId,
          childName: child.$getDisplayName(),
          childId: child.id
        });
      }

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        children: children
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../util":41,"gedcomx-date":48}],3:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if two children are born less than 9 months apart
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'childrenTooClose',
  type: 'problem',
  signature: 'children',
  help: [],
  check: function(person, children) {

    // Only look at women
    if(person.gender.type !== 'http://gedcomx.org/Female'){
      return;
    }
    
    if(children.length === 0){
      return;
    }
    
    // Gather a list of all children with a birth date.
    // If a formal date is not set, do our best to create one.
    var compareList = [];
    for(var i = 0; i < children.length; i++){
      var child = children[i],
          birth = child.$getBirth();
      if(!birth || !birth.date){
        continue;
      }
      var newFormalDate = utils.getFormalDate(birth);
      
      // Make sure we have a full (not partial) formal date 
      if(newFormalDate && utils.isFullDate(newFormalDate)){
        compareList.push({
          id: child.id,
          date: newFormalDate,
          name: child.$getDisplayName()
        });
      }
    }

    // Sort children based on birth date
    compareList.sort(function(a, b){
      return utils.compareFormalDates(a.date, b.date);
    });
    
    // Gather list of children born less than 9 months apart
    var problemPairs = [];
    for(var i = 1; i < compareList.length; i++){
      var previous = compareList[i-1],
          current = compareList[i],
          previousGedcomXDate = new utils.GedcomXDate(previous.date),
          currentGedcomXDate = new utils.GedcomXDate(current.date);
      
      // If the dates are not equal (ignore twins) then calculate time between dates
      if(utils.compareFormalDates(previousGedcomXDate, currentGedcomXDate) !== 0){
        var birthDuration = utils.GedcomXDate.getDuration(previousGedcomXDate, currentGedcomXDate);
        if(!birthDuration.getYears() && birthDuration.getMonths() < 9){
          problemPairs.push({
            firstName: previous.name,
            id1: previous.id,
            secondName: current.name,
            id2: current.id
          });
        }
      }
    }
    
    if(problemPairs.length === 0){
      return;
    }
    
    var template = {
      pid: person.id,
      name: person.$getDisplayName(),
      pairs: problemPairs
    };

    return utils.createOpportunity(this, person, template);

  }
};

/**
 * Returns true of the formal dates are exactly equal.
 * If one of the dates is a partial date, such as +1904,
 * then compare the dates using all dates parts that
 * both dates have specified. In other words, consider
 * +1904 to equal any formal date in 1904 and consider
 * +1904-02 to equal any formal date in Feb 1904.
 */
function formalDatesEqual(date1, date2){
  if(date1 === date2){
    
  }
};
},{"../util.js":41}],4:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is a birth date
 *  3. There is a death fact
 *  4. There is a death date
 */
var utils = _dereq_('../util'),
    GedcomXDate = _dereq_('gedcomx-date');

module.exports = {
  id: 'deathBeforeBirth',
  type: 'problem',
  signature: 'person',
  help: ['addingAndCorrecting', 'nonexactDates'],
  check: function(person) {

    var birth = person.$getBirth(),
        death = person.$getDeath();

    // If we don't have a birth
    if(!birth || !birth.date) {
      return;
    }
    
    // If we don't have a death
    if(!death || !death.date) {
      return;
    }

    // If either the birth or death date doesn't
    // have a formal then we just compare years.
    if(!birth.$getFormalDate() || !death.$getFormalDate()){
      var birthYear = utils.getFactYear(birth),
          deathYear = utils.getFactYear(death);
      if(!birthYear || !deathYear || birthYear <= deathYear) {
        return;
      }
    }
    
    // If they both have full formal values then we compare
    else {
      var birthGedx = new GedcomXDate(utils.getFormalDate(birth)),
          deathGedx = new GedcomXDate(utils.getFormalDate(death));
          
      // If the birth date is partial then we make it a full
      // leaning towards the earliest date to avoid false positives
      // For death we lean towards the latest
      utils.ensureFullDate(birthGedx, 1, 1);
      utils.ensureFullDate(deathGedx, 12, 31);
          
      if(utils.compareFormalDates(birthGedx, deathGedx) !== 1) {
        return;
      }
    }
    
    var template = {
      pid: person.id,
      name: person.$getDisplayName()
    };

    return utils.createOpportunity(this, person, template);

  }
};
},{"../util":41,"gedcomx-date":48}],5:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There are duplicates names (ignoring capitalization and punctuation)
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'duplicateNames',
  type: 'cleanup',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {

    var names = person.$getNames(),
        simplified = {},
        duplicates = [];

    // Track which names are similar
    for(var i = 0; i < names.length; i++){
      var name = names[i],
          fullText = name.$getFullText();
      if(fullText){
        var simple = fullText.toLowerCase().replace(/[\W]/g, '');
        if(simplified[simple]){
          simplified[simple].push(fullText);
        } else {
          simplified[simple] = [fullText];
        }
      }
    }
    
    // Extract similar names
    for(var s in simplified){
      if(simplified[s].length > 1){
        duplicates.push(simplified[s]);
      }
    }
        
    if(duplicates.length > 0) {

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        duplicates: duplicates
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../help":39,"../util":41}],6:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There are 5 or more alternate names
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'manyAlternateNames',
  type: 'cleanup',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {

    var names = person.$getNames();

    // Compare to 6 instead of 5 to allow for the preferred name
    if(names && names.length >= 6) {

      var alternates = [];
      for(var i = 0; i < names.length; i++){
        if(!names[i].preferred){
          alternates.push(names[i].$getFullText());
        }
      }
      
      var template = {
        pid: person.id, 
        names: alternates
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../help":39,"../util":41}],7:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if a marriage date is after the person's death date
 */
var utils = _dereq_('../util.js'),
    GedcomXDate = _dereq_('gedcomx-date');

module.exports = {
  id: 'marriageAfterDeath',
  type: 'problem',
  signature: 'relationships',
  help: [],
  check: function(person, relationships, people) {

    var death = person.$getDeath(),
        spouseIds = relationships.getSpouseIds(),
        problemMarriages = [];
  
    // Can't run if there is no death or no spouses
    if(!death || spouseIds.length == 0) {
      return;
    }
    
    var formalDeathDate = utils.getFormalDate(death, true);
    
    // Can't run if there is no date to work with
    if(!formalDeathDate){
      return;
    }
    
    var formalDeathGedx = new GedcomXDate(formalDeathDate);
    utils.ensureFullDate(formalDeathGedx, 12, 31);
    
    // For each couple relationship, compare death date with all marriage events
    for(var i = 0; i < spouseIds.length; i++){
      var coupleRelationship = relationships.getSpouseRelationship(spouseIds[i]),
          coupleFacts = coupleRelationship.$getFacts(),
          problemMarriage = false;
      for(var j = 0; !problemMarriage && j < coupleFacts.length; j++){
        var fact = coupleFacts[j];
        if(!fact.date){
          continue;
        }
        var formalMarriageDate = utils.getFormalDate(fact);
        if(formalMarriageDate){
          var formalMarriageGedx = new GedcomXDate(formalMarriageDate);
          utils.ensureFullDate(formalMarriageGedx);
          if(utils.compareFormalDates(formalMarriageGedx, formalDeathGedx) === 1){
            problemMarriage = true;
            problemMarriages.push({
              spouseId: spouseIds[i],
              coupleId: coupleRelationship.id,
              fact: fact,
              formalDate: formalMarriageDate
            });
          }
        }
      }
    }

    if(problemMarriages.length > 0) {
    
      var spouses = [];
      for(var i = 0; i < problemMarriages.length; i++){
        var spouseId = problemMarriages[i].spouseId;
        spouses.push({
          spouseName: people[spouseId].$getDisplayName(),
          coupleId: problemMarriages[i].coupleId
        });
      }
      
      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        spouses: spouses 
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../util.js":41,"gedcomx-date":48}],8:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. Person has one or more marriages
 *  2. Person has no children
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'marriageWithNoChildren',
  type: 'family',
  signature: 'relationships',
  help: [],
  check: function(person, relationships, people) {

    var allSpouseIds = relationships.getSpouseIds(),
        spouseIdsWithoutChildren = [];
  
    if(allSpouseIds.length == 0) {
      return;
    }
    
    for(var i = 0; i < allSpouseIds.length; i++){
      if(relationships.getChildRelationshipsOf(allSpouseIds[i]).length === 0){
        spouseIdsWithoutChildren.push(allSpouseIds[i]);
      }
    }

    if(spouseIdsWithoutChildren.length > 0) {

      var spouses = [];
      for(var i = 0; i < spouseIdsWithoutChildren.length; i++){
        spouses.push({
          id: relationships.getSpouseRelationship(spouseIdsWithoutChildren[i]).id,
          name: people[spouseIdsWithoutChildren[i]].$getDisplayName()
        });
      }
      
      var template = {
        pid:  person.id,
        name: person.$getDisplayName(),
        multipleSpouses: spouses.length > 1,
        spouse: spouses[0],
        spouses: spouses
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../util.js":41}],9:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is no birth fact OR place and date are both undefined
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingBirth',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var birth = person.$getBirth();

    if(birth) {
      if(utils.getFactPlace(birth) !== undefined || utils.getFactYear(birth) !== undefined) {
        return;
      }
    }

    // TODO if they have a christening event, change the description

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};
},{"../util.js":41}],10:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is no date
 *  3. There is a place
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingBirthDate',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var birth = person.$getBirth();

    if(!birth) {
      return;
    }

    // If we already have a birth date
    if(utils.getFactYear(birth) !== undefined) {
      return;
    }

    var place = utils.getFactPlace(birth)

    // If we don't have a date AND place, then we count it as not having a birth
    if(place === undefined) {
      return;
    }

    // TODO if they have a christening record, change the description

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};
},{"../util.js":41}],11:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is no place
 *  3. There is a date
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingBirthPlace',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var birth = person.$getBirth();

    if(!birth) {
      return;
    }

    // If we already have a birth place
    if(utils.getFactPlace(birth) !== undefined) {
      return;
    }

    var year = utils.getFactYear(birth)

    // If we don't have a date AND place, then we count it as not having a birth
    if(year === undefined) {
      return;
    }

    // TODO if they have a christening record, change the description

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};
},{"../util.js":41}],12:[function(_dereq_,module,exports){
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingBirthSource',
  type: 'source',
  signature: 'personSource',
  help: [],
  check: function(person, sourceRefs) {

    var birth = person.$getBirth();

    // If we have no birth return
    if(!birth) {
      return;
    }

    var year = utils.getFactYear(birth),
        place = utils.getFactPlace(birth);

    // If we have no year or place
    if(year === undefined || place === undefined) {
      return;
    }

    // See if we have sources tagged for this birth
    var sourceArr = sourceRefs.getSourceRefs(),
        tagged = false;
    for(var x in sourceArr) {
      if(sourceArr[x].$getTags().indexOf('http://gedcomx.org/Birth') !== -1) {
        tagged = true;
      }
    }

    if(!tagged) {

      var findarecord = {
        tags: ['birth'],
        from: (year)? year-3:undefined,
        to: (year)? year+3:undefined,
        place: place
      };
    
      var template = {
        name: person.$getDisplayName(),
        pid:  person.id
      };

      return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

    }
    
  }
};
},{"../util.js":41}],13:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is no death fact OR place and date are both undefined
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingDeath',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var death = person.$getDeath();

    if(death) {
      if(utils.getFactPlace(death) !== undefined || utils.getFactYear(death) !== undefined) {
        return;
      }
    }

    // TODO if they have a christening record, change the description

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};
},{"../util.js":41}],14:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is no date
 *  3. There is a place
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingDeathDate',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var death = person.$getDeath();

    if(!death) {
      return;
    }

    if(utils.getFactYear(death) !== undefined) {
      return;
    }

    var place = utils.getFactPlace(death)

    if(place === undefined) {
      return;
    }

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
}
},{"../util.js":41}],15:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is no place
 *  3. There is a date
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingDeathPlace',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var death = person.$getDeath();

    if(!death) {
      return;
    }

    // If we already have a death place
    if(utils.getFactPlace(death) !== undefined) {
      return;
    }

    var year = utils.getFactYear(death)

    // If we don't have a date AND place, then we count it as not having a death
    if(year === undefined) {
      return;
    }

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};
},{"../util.js":41}],16:[function(_dereq_,module,exports){
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingDeathSource',
  type: 'source',
  signature: 'personSource',
  help: [],
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
      
      var template = {
        name: person.$getDisplayName(),
        pid:  person.id
      };
  
      return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

    }
    
  }
};
},{"../util.js":41}],17:[function(_dereq_,module,exports){
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingFather',
  type: 'family',
  signature: 'child',
  help: [],
  check: function(child, mother, father, childRelationship) {

    // Only generate an opportunity if there is no father
    if(!father) {
    
      var birth = child.$getBirth(),
          birthYear, birthPlace;
      if(birth) {
        birthYear = utils.getFactYear(birth);
        birthPlace = utils.getFactPlace(birth);
      }
      
      var template = {
        mothername: mother.$getDisplayName(),
        mid: mother.id,
        name: child.$getDisplayName(),
        pid: child.id
      };
      
      var gensearch = {
        givenName: child.$getGivenName(),
        familyName: child.$getSurname(),
        birthPlace: birthPlace,
        birthDate: birthYear+'',
        motherGivenName: mother.$getGivenName(),
        motherFamilyName: mother.$getSurname()
      };
  
      return utils.createOpportunity(this, child, template, gensearch);

    }
    
  }
};
},{"../util.js":41}],18:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. The preferred name does not have a given name but has a surname
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'missingGivenName',
  type: 'person',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {

    var givenName = person.$getGivenName(),
        surname = person.$getSurname();

    if(surname && (givenName === undefined || givenName === '')) {
      return utils.createOpportunity(this, person, {}, utils.gensearchPerson(person));
    }
  }
};
},{"../help":39,"../util":41}],19:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is a place
 */
var utils = _dereq_('../util');

module.exports = {
  id: 'missingMarriageDate',
  type: 'family',
  signature: 'marriage',
  help: [],
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
      return;
    }

    // If we have more than one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type == 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count != 1) {
      return;
    }
    
    var marriageFact = marriage.$getMarriageFact();

    // If we already have a marriage date
    if(utils.getFactYear(marriageFact) !== undefined) {
      return;
    }

    var place = utils.getFactPlace(marriageFact)

    // If we don't have a date AND place, then we count it as not having a marriage
    if(place === undefined) {
      return;
    }
    
    var template = {
      crid: marriage.id,
      wid: wife.id,
      hid: husband.id,
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName()
    };
    
    var gensearch = utils.gensearchPerson(wife);
    
    gensearch.marriagePlace = place;
    gensearch.spouseGivenName = husband.$getGivenName();
    gensearch.spouseFamilyName = husband.$getSurname();

    return utils.createOpportunity(this, wife, template, gensearch);
  }
};
},{"../util":41}],20:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if there is a marriage but no marriage fact,
 * or there is 1 marriage fact with no date and place
 */
var utils = _dereq_('../util');

module.exports = {
  id: 'missingMarriageFact',
  type: 'family',
  signature: 'marriage',
  help: [],
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
      return;
    }

    // If we have more than one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type == 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count > 1) {
      return;
    }

    // End if we have a marriage date or place
    var marriageFact = marriage.$getMarriageFact();
    if(marriageFact && (utils.getFactYear(marriageFact) !== undefined || utils.getFactPlace(marriageFact) !== undefined)){
      return;
    }
    
    var template = {
      crid: marriage.id,
      wid: wife.id,
      hid: husband.id,
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName()
    };
    
    var gensearch = utils.gensearchPerson(wife);
    gensearch.spouseGivenName = husband.$getGivenName();
    gensearch.spouseFamilyName = husband.$getSurname();

    return utils.createOpportunity(this, wife, template, gensearch);
  }
};
},{"../util":41}],21:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is a date
 */
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingMarriagePlace',
  type: 'family',
  signature: 'marriage',
  help: [],
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
      return;
    }

    // If we have more than one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type == 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count != 1) {
      return;
    }
    
    var marriageFact = marriage.$getMarriageFact();

    // If we already have a marriage place
    if(utils.getFactPlace(marriageFact) !== undefined) {
      return;
    }

    var date = utils.getFactYear(marriageFact)

    // If we don't have a date AND place, then we count it as not having a marriage
    if(date === undefined) {
      return;
    }
    
    var template = {
      crid: marriage.id,
      wid: wife.id,
      hid: husband.id,
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName()
    };
    
    var gensearch = utils.gensearchPerson(wife);
    gensearch.marriageDate = date+'';
    gensearch.spouseGivenName = husband.$getGivenName();
    gensearch.spouseFamilyName = husband.$getSurname();

    return utils.createOpportunity(this, wife, template, gensearch);

  }
};
},{"../util.js":41}],22:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. Marriage fact exists
 *  2. There is a husband or a wife
 *  2. There is only one marriage fact
 *  3. Marriage has a place
 *  4. Marriage has a date
 *  5. SourceRefs is empty
 */
var utils = _dereq_('../util');

module.exports = {
  id: 'missingMarriageSource',
  type: 'source',
  signature: 'marriageSource',
  help: [],
  check: function(wife, husband, marriage, sourceRefs) {

    var marriageFact = marriage.$getMarriageFact();

    if(!marriageFact) {
      return;
    }

    var person = wife,
        spouse = husband;

    if(!person) {
      return;
    }

    // If we have more than one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type == 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count != 1) {
      return;
    }

    var marriageYear = utils.getFactYear(marriageFact),
        marriagePlace = utils.getFactPlace(marriageFact);

    // If we don't have a mrriage date or place
    if(marriageYear == undefined || marriagePlace == undefined) {
      return;
    }

    if(sourceRefs.length > 0) {
      return;
    }
    
    var template ={
      cid: marriage.id, 
      couple: wife.$getDisplayName() + ' and ' + husband.$getDisplayName(),
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName(),
      wid: wife.id,
      hid: husband.id
    };
    
    var gensearch = utils.gensearchPerson(person);
    gensearch.marriageDate = marriageYear+'';
    gensearch.marriagePlace = marriagePlace;
    if(spouse !== undefined) {
      gensearch.spouseGivenName = spouse.$getGivenName();
      gensearch.spouseFamilyName = spouse.$getSurname();
    }

    return utils.createOpportunity(this, person, template, gensearch);

  }
};
},{"../util":41}],23:[function(_dereq_,module,exports){
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingMother',
  type: 'family',
  signature: 'child',
  help: [],
  check: function(child, mother, father, childRelationship) {

    // Only generate an opportunity if there is no mother
    if(!mother) {
    
      var birth = child.$getBirth(),
          birthYear, birthPlace;
      if(birth) {
        birthYear = utils.getFactYear(birth);
        birthPlace = utils.getFactPlace(birth);
      }
      
      var template = {
        fathername: father.$getDisplayName(),
        fid: father.id,
        name: child.$getDisplayName(),
        pid: child.id
      };
      
      var gensearch = {
        givenName: child.$getGivenName(),
        familyName: child.$getSurname(),
        birthPlace: birthPlace,
        birthDate: birthYear+'',
        fatherGivenName: father.$getGivenName(),
        fatherFamilyName: father.$getSurname()
      };
  
      return utils.createOpportunity(this, child, template, gensearch);
    }
    
  }
};
},{"../util.js":41}],24:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is no name
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'missingName',
  type: 'person',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {
    if(!person.names || person.names.length === 0) {
      return utils.createOpportunity(this, person, {}, utils.gensearchPerson(person));
    }
  }
};
},{"../help":39,"../util":41}],25:[function(_dereq_,module,exports){
var utils = _dereq_('../util.js');

module.exports = {
  id: 'missingParents',
  type: 'family',
  signature: 'parents',
  help: [],
  check: function(child, parents) {

    // Only generate an opportunity if there are no parents
    if(!parents || parents.length === 0) {
    
      var birth = child.$getBirth(),
          birthYear, birthPlace;
      if(birth) {
        birthYear = utils.getFactYear(birth);
        birthPlace = utils.getFactPlace(birth);
      }
      
      var template = {
        name: child.$getDisplayName(),
        pid:  child.id
      };
  
      return utils.createOpportunity(this, child, template, utils.gensearchPerson(child));
    }
    
  }
};
},{"../util.js":41}],26:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. The preferred name does not have a surname but does have a given name
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'missingSurname',
  type: 'person',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {

    var givenName = person.$getGivenName(),
        surname = person.$getSurname();

    if(givenName && (surname === undefined || surname === '')) {
      return utils.createOpportunity(this, person, {}, utils.gensearchPerson(person));
    }
  }
};
},{"../help":39,"../util":41}],27:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is more than one marriage fact
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'multipleMarriageFacts',
  type: 'cleanup',
  signature: 'marriage',
  help: ['addingAndCorrecting'],
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
      return;
    }

    // If we have more than one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type === 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count < 2) {
      return;
    }

    var template = {
      crid:  marriage.id,
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName()
    };

    return utils.createOpportunity(this, wife, template, utils.gensearchPerson(wife));

  }
};
},{"../help":39,"../util":41}],28:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. Person has more than one parent relationship
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'multipleParents',
  type: 'family',
  signature: 'relationships',
  help: ['addingAndCorrecting', 'parentRelationshipType'],
  check: function(person, relationships, people) {

    var parentRelationships = relationships.getParentRelationships();
  
    if(parentRelationships.length < 2) {
      return;
    }
    
    var biologicalParentIds = {};
    
    for(var i = 0; i < parentRelationships.length; i++){
      var relationship = parentRelationships[i],
          fatherId = relationship.$getFatherId(),
          motherId = relationship.$getMotherId(),
          fatherFacts = relationship.$getFatherFacts(),
          motherFacts = relationship.$getMotherFacts();
      if(fatherId && fatherFacts){
        for(var j = 0; j < fatherFacts.length; j++){
          if(fatherFacts[j].type === 'http://gedcomx.org/BiologicalParent'){
            biologicalParentIds[fatherId] = true;
          }
        }
      }
      if(motherId && motherFacts){
        for(var j = 0; j < motherFacts.length; j++){
          if(motherFacts[j].type === 'http://gedcomx.org/BiologicalParent'){
            biologicalParentIds[motherId] = true;
          }
        }
      }
    }
    
    if(Object.keys(biologicalParentIds).length > 2){
      var template = {
        name: person.$getDisplayName(),
        pid:  person.id
      };
      return utils.createOpportunity(this, person, template);
    }
  }
};
},{"../help":39,"../util":41}],29:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. The person's preferred name has an "or" in it (Joe or Joey Adams)
 *  2. The person's preferred name doesn't have an or but an alternate name does
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help'),
    regex = / or /;

// TODO: suggest what the new preferred name and alternate names should be
//       this can easily be done by examining the given name and surname separately
    
module.exports = {
  id: 'orInName',
  type: 'cleanup',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {

    var name = person.$getPreferredName(),
        nameText = name && name.$getFullText() ? name.$getFullText() : '',
        nameMatches = nameText.match(regex),
        template = {
          pid: person.id
        };

    // Have an "or" in the preferred name
    if(nameMatches) {
      template.preferred = true;
      return utils.createOpportunity(this, person, template);
    } 
    
    // If the preferred name doesn't have a problem
    // then examine the alternate names
    else if(person.$getNames().length > 1){
      
      var names = person.$getNames(),
          badNames = [];
          
      for(var i = 0; i < names.length; i++){
        
        var name = names[i],
            fullText = name.$getFullText();
        
        // Skip the preferred name
        if(name.preferred) continue;

        if(fullText && fullText.match(regex) !== null){
          badNames.push(fullText);
        }
      }
      
      if(badNames.length > 0){
        
        template.badNames = badNames;
        template.preferred = false;
        
        return utils.createOpportunity(this, person, template);
      }
    }
    
  }
};
},{"../help":39,"../util":41}],30:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. Person has possible matches
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'possibleDuplicates',
  type: 'problem',
  signature: 'duplicates',
  help: ['mergingDuplicates'],
  check: function(person, matches) {
  
    // Short-circuit if there are no matches
    var count = matches.getResultsCount();
    if(count === 0){
      return;
    }
  
    // Ignore results of low confidence like the web client does
    var goodMatches = 0,
        results = matches.getSearchResults();
    for(var i = 0; i < results.length; i++){
      if(results[i].confidence >= 3){
        goodMatches++;
      }
    }
    
    // Short-circuit if we have no good matches
    if(goodMatches === 0){
      return;
    }
    
    var template = {
      pid: person.id,
      name: person.$getDisplayName(),
      count: goodMatches,
      singular: goodMatches === 1
    };

    return utils.createOpportunity(this, person, template);

  }
};
},{"../help":39,"../util":41}],31:[function(_dereq_,module,exports){
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'recordHints',
  type: 'source',
  signature: 'recordHints',
  help: ['recordHints'],
  check: function(person, matches) {

    // Short-circuit if there are no hints
    var count = matches.getResultsCount();
    if(count === 0){
      return;
    }
    
    var results = matches.getSearchResults(),
        titles = [];
    for(var i = 0; i < results.length; i++){
      titles.push(results[i].title);
    }

    var template = {
      titles: titles,
      name: person.$getDisplayName(),
      pid: person.id
    };

    return utils.createOpportunity(this, person, template);

  }
};
},{"../help":39,"../util":41}],32:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is an original date
 *  3. There is no formal date
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'standardizeBirthDate',
  type: 'cleanup',
  signature: 'person',
  help: ['standardizing'],
  check: function(person) {

    var birth = person.$getBirth();

    // If we have no birth return
    if(!birth) {
      return;
    }

    // If we have an original date without a formal date
    if(birth.$getDate() !== undefined && birth.$getNormalizedDate() === undefined) {
      
      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        date: birth.$getDate()
      };
  
      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../help":39,"../util":41}],33:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is an original place
 *  3. There is no normalized place
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'standardizeBirthPlace',
  type: 'cleanup',
  signature: 'person',
  help: ['standardizing'],
  check: function(person) {

    var birth = person.$getBirth();

    // If we have no birth return
    if(!birth) {
      return;
    }

    // If we have an original place without a normalized place
    if(birth.$getPlace() !== undefined && birth.$getNormalizedPlace() === undefined) {

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        place: birth.$getPlace()
      };
  
      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../help":39,"../util":41}],34:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is an original date
 *  3. There is no formal date
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'standardizeDeathDate',
  type: 'cleanup',
  signature: 'person',
  help: ['standardizing'],
  check: function(person) {

    var death = person.$getDeath();

    // If we have no death return
    if(!death) {
      return;
    }

    // If we have an original date without a formal date
    if(death.$getDate() !== undefined && death.$getNormalizedDate() === undefined) {

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        date: death.$getDate()
      };
  
      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../help":39,"../util":41}],35:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is an original place
 *  3. There is no normalized place
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'standardizeDeathPlace',
  type: 'cleanup',
  signature: 'person',
  help: ['standardizing'],
  check: function(person) {

    var death = person.$getDeath();

    // If we have no death return
    if(!death) {
      return;
    }

    // If we have an original place without a normalized place
    if(death.$getPlace() !== undefined && death.$getNormalizedPlace() === undefined) {

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        place: death.$getPlace()
      };
  
      return utils.createOpportunity(this, person, template);

    }
  }
};
},{"../help":39,"../util":41}],36:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is an original date
 *  4. There is no formal date
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'standardizeMarriageDate',
  type: 'cleanup',
  signature: 'marriage',
  help: ['standardizing'],
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
      return;
    }

    var marriageFact = marriage.$getMarriageFact();

    // If we don't have exactly one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type == 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count != 1) {
      return;
    }

    // If we have an original date without a formal date
    if(marriageFact.$getDate() !== undefined && marriageFact.$getNormalizedDate() === undefined) {

      var template = {
        crid: marriage.id, 
        wifeName: wife.$getDisplayName(),
        husbandName: husband.$getDisplayName(),
        date: facts[0].$getDate()
      };
  
      return utils.createOpportunity(this, wife, template);

    }
  }
};
},{"../help":39,"../util":41}],37:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is an original place
 *  4. There is no normalized place
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help');

module.exports = {
  id: 'standardizeMarriagePlace',
  type: 'cleanup',
  signature: 'marriage',
  help: ['standardizing'],
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
      return;
    }

    var marriageFact = marriage.$getMarriageFact();

    // If we don't have exactly one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type == 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count != 1) {
      return;
    }

    // If we have an original place without a normalized place
    if(marriageFact.$getPlace() !== undefined && marriageFact.$getNormalizedPlace() === undefined) {

      var template = {
        crid: marriage.id,
        wifeName: wife.$getDisplayName(),
        husbandName: husband.$getDisplayName(),
        place: marriageFact.$getPlace()
      };
  
      return utils.createOpportunity(this, wife, template);

    }
  }
};
},{"../help":39,"../util":41}],38:[function(_dereq_,module,exports){
/**
 * Returns an opportunity if:
 *  1. There are unusual characters in the preferred name
 *  2. There are no unusual characters in the preferred name but there are unusual characters in an alternate name
 */
var utils = _dereq_('../util'),
    help = _dereq_('../help'),
    badChars = /[\{\}\[\]\(\)\<\>\!\@\#\$\%\^\&\*\+\=\/\|\\\?\_]/g;

// TODO: suggest what the new preferred name and alternate names should be
//       this can easily be done by examining the given name and surname separately
    
module.exports = {
  id: 'unusualCharactersInName',
  type: 'cleanup',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {

    var name = person.$getPreferredName(),
        nameText = name && name.$getFullText() ? name.$getFullText() : '',
        nameMatches = nameText.match(badChars),
        template;

    if(nameMatches) {
      template = {
        chars: '`' + nameMatches.join('`, `') + '`',
        pid: person.id,
        brackets: nameText.match(/(\([^\)]*\))|(\{[^\}]*\})|(\[[^\]]*\])|(\<[^\>]*\>)/) !== null,
        preferred: true
      };
    } 
    
    // If the preferred name doesn't have any unusual characters
    // then examine the alternate names
    else if(person.$getNames().length > 1){
      
      var names = person.$getNames(),
          badNames = [];
          
      for(var i = 0; i < names.length; i++){
        
        var name = names[i],
            fullText = name.$getFullText();
        
        // Skip the preferred name
        if(name.preferred) continue;

        if(fullText && fullText.match(badChars) !== null){
          badNames.push(fullText);
        }
      }
      
      if(badNames.length > 0){
        template = {
          badNames: badNames,
          pid: person.id,
          preferred: false
        };
      }
    }
    
    if(template){
      return utils.createOpportunity(this, person, template);
    }
  }
};
},{"../help":39,"../util":41}],39:[function(_dereq_,module,exports){
/**
 * Central control of help doc links
 */
module.exports = {
  addingAndCorrecting: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-and-Correcting-Information-about-People-and-Relationships',
  customEvents: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-a-Custom-Event-or-Fact-to-a-Person',
  deletingInformation: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Deleting-a-Person-from-the-System',
  mergingDuplicates: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Merging-Duplicate-Records-in-Family-Tree-1381814853391',
  nonexactDates: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Do-not-know-exact-birth-date-or-death-date',
  recordHints: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Record-Hints',
  standardizing: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Entering-Standardized-Dates-and-Places',
  parentRelationshipType: 'https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-Changing-and-Deleting-Relationship-Types-between-Parents-and-Children'
};
},{}],40:[function(_dereq_,module,exports){
var utils = _dereq_('./util'),
    help = _dereq_('./help');

// Index checks by ID
var ids = {};

// Index checks by signature
var signatures = {};

// Index checks by type
var types = {};

var languages = {};

module.exports = {

  all: function(){
    return checks;
  },

  /**
   * Get a check by ID
   */
  id: function(checkId){
    return ids[checkId];
  },
  
  /**
   * Get all checks that match a given signature
   */
  signature: function(signature){
    return signatures[signature];
  },
  
  /**
   * Get a list of all valid signatures
   */
  signatures: function(){
    var list = [];
    for(var s in signatures){
      list.push(s);
    }
    return list;
  },
  
  /**
   * Get all checks that match a given type
   */
  type: function(type){
    return types[type];
  },
  
  /**
   * Get a list of all valid types
   */
  types: function(){
    var list = [];
    for(var t in types){
      list.push(t);
    }
    return list;
  },
  
  /**
   * Add a custom check
   */
  add: function(check, templates){
    ids[check.id] = check;
    
    // Register signature
    var signature = check.signature;
    if(!signatures[signature]){
      signatures[signature] = [];
    }
    signatures[signature].push(check);
    
    // Register type
    var type = check.type;
    if(!types[type]){
      types[type] = [];
    }
    types[type].push(check);
    
    // Add language templates
    if(templates){
      for(var lang in templates){
        if(!languages[lang]){
          languages[lang] = {
            code: lang,
            help: {},
            checks: {}
          };
        }
        languages[lang].checks[check.id] = templates[lang];
      }
    }
  },
  
  /**
   * Remove a check.
   */
  remove: function(checkId){
    var check = ids[checkId];
    if(check){
      delete ids[checkId];
      
      var signature = check.signature;
      for(var i = 0; i < signatures[signature].length; i++){
        if(signatures[signature][i].id === checkId){
          signatures[signature].splice(i, 1);
          break;
        }
      }
      if(signatures[signature].length === 0){
        delete signatures[signature];
      }
      
      var type = check.type;
      for(var i = 0; i < types[type].length; i++){
        if(types[type][i].id === checkId){
          types[type].splice(i, 1);
          break;
        }
      }
      if(types[type].length === 0){
        delete types[type];
      }
      
      for(var lang in languages){
        delete languages[lang].checks[checkId];
      }
    }
  },
  
  /**
   * Add a language
   */
  language: function(data){
    languages[data.code] = data;
  },
  
  /**
   * Translate an opportunity
   */
  translate: function(opportunity, lang){
    if(!lang){
      throw new Error('Second parameter `lang` is required');
    }
    if(!languages[lang]){
      throw new Error('The given language is not defined: ' + lang);
    }
    if(languages[lang]){
      var translation = languages[lang].checks[opportunity.checkId];
      if(translation){
        opportunity.title = translation.title;
        opportunity.description = utils.markdown(translation.description, opportunity.template, languages[lang].partials);
      }
    }
  },
  
  /**
   * Get the title for a check
   */
  title: function(checkId, lang){
    if(!lang){
      throw new Error('Second parameter `lang` is required');
    }
    if(!languages[lang]){
      throw new Error('The given language is not defined: ' + lang);
    }
    if(languages[lang] && languages[lang].checks[checkId]){
      return languages[lang].checks[checkId].title;
    }
  },
  
  /**
   * Get the url and title for a help link
   */
  help: function(helpId, lang){
    if(!lang){
      throw new Error('Second parameter `lang` is required');
    }
    if(!languages[lang]){
      throw new Error('The given language is not defined: ' + lang);
    }
    if(Array.isArray(helpId)){
      var links = [];
      for(var i = 0; i < helpId.length; i++){
        links.push(_help(helpId[i], lang));
      }
      return links;
    } else {
      return _help(helpId, lang);
    }
  },
  
  /**
   * Expose useful internals
   */
  utils: {
    getFactYear: utils.getFactYear,
    getFactPlace: utils.getFactPlace,
    gensearchPerson: utils.gensearchPerson,
    gedcomxDate: _dereq_('gedcomx-date')
  }
  
};

var checks = [
  _dereq_('./checks/birthBeforeParentsBirth'),
  _dereq_('./checks/childBeforeMarriage'),
  _dereq_('./checks/childrenTooClose'),
  _dereq_('./checks/deathBeforeBirth'),
  _dereq_('./checks/duplicateNames'),
  _dereq_('./checks/manyAlternateNames'),
  _dereq_('./checks/marriageAfterDeath'),
  _dereq_('./checks/marriageWithNoChildren'),
  _dereq_('./checks/missingBirth'),
  _dereq_('./checks/missingBirthDate'),
  _dereq_('./checks/missingBirthPlace'),
  _dereq_('./checks/missingBirthSource'),
  _dereq_('./checks/missingDeath'),
  _dereq_('./checks/missingDeathDate'),
  _dereq_('./checks/missingDeathPlace'),
  _dereq_('./checks/missingDeathSource'),
  _dereq_('./checks/missingFather'),
  _dereq_('./checks/missingGivenName'),
  _dereq_('./checks/missingMarriageDate'),
  _dereq_('./checks/missingMarriageFact'),
  _dereq_('./checks/missingMarriagePlace'),
  _dereq_('./checks/missingMarriageSource'),
  _dereq_('./checks/missingMother'),
  _dereq_('./checks/missingName'),
  _dereq_('./checks/missingParents'),
  _dereq_('./checks/missingSurname'),
  _dereq_('./checks/multipleMarriageFacts'),
  _dereq_('./checks/multipleParents'),
  _dereq_('./checks/orInName'),
  _dereq_('./checks/possibleDuplicates'),
  _dereq_('./checks/recordHints'),
  _dereq_('./checks/standardizeBirthDate'),
  _dereq_('./checks/standardizeBirthPlace'),
  _dereq_('./checks/standardizeDeathDate'),
  _dereq_('./checks/standardizeDeathPlace'),
  _dereq_('./checks/standardizeMarriageDate'),
  _dereq_('./checks/standardizeMarriagePlace'),
  _dereq_('./checks/unusualCharactersInName')
];

for(var i = 0; i < checks.length; i++){
  module.exports.add(checks[i]);
}

/**
 * Help link helper
 */
function _help(helpId, lang){
  if(languages[lang] && languages[lang].help[helpId]){
    return {
      title: languages[lang].help[helpId],
      url: help[helpId]
    };
  }
};
},{"./checks/birthBeforeParentsBirth":1,"./checks/childBeforeMarriage":2,"./checks/childrenTooClose":3,"./checks/deathBeforeBirth":4,"./checks/duplicateNames":5,"./checks/manyAlternateNames":6,"./checks/marriageAfterDeath":7,"./checks/marriageWithNoChildren":8,"./checks/missingBirth":9,"./checks/missingBirthDate":10,"./checks/missingBirthPlace":11,"./checks/missingBirthSource":12,"./checks/missingDeath":13,"./checks/missingDeathDate":14,"./checks/missingDeathPlace":15,"./checks/missingDeathSource":16,"./checks/missingFather":17,"./checks/missingGivenName":18,"./checks/missingMarriageDate":19,"./checks/missingMarriageFact":20,"./checks/missingMarriagePlace":21,"./checks/missingMarriageSource":22,"./checks/missingMother":23,"./checks/missingName":24,"./checks/missingParents":25,"./checks/missingSurname":26,"./checks/multipleMarriageFacts":27,"./checks/multipleParents":28,"./checks/orInName":29,"./checks/possibleDuplicates":30,"./checks/recordHints":31,"./checks/standardizeBirthDate":32,"./checks/standardizeBirthPlace":33,"./checks/standardizeDeathDate":34,"./checks/standardizeDeathPlace":35,"./checks/standardizeMarriageDate":36,"./checks/standardizeMarriagePlace":37,"./checks/unusualCharactersInName":38,"./help":39,"./util":41,"gedcomx-date":48}],41:[function(_dereq_,module,exports){
var GedcomXDate = _dereq_('gedcomx-date'),
    marked = _dereq_('marked'),
    renderer = new marked.Renderer(),
    mustache = _dereq_('mustache');

var utils = module.exports = {
  GedcomXDate: GedcomXDate
};

renderer.heading = function (text, level) {
  return '<h'
    + level
    + '>'
    + text
    + '</h'
    + level
    + '>\n';
};

/**
 * Do all we can to extract a 4 digit year from a Fact.
 * Returns undefined if we fail.
 */
utils.getFactYear = function(fact) {
  if(fact.$getFormalDate()) {
    var simple = utils.getSimpleFormalDate(fact.$getFormalDate());
    if(simple){
      return simple.getYear();
    }
  } else if(fact.$getDate()) {
    return utils.extractYearFromDateString(fact.$getDate());
  }
};

/**
 * Extract a place string from a fact.
 * Returns undefined if there is no place.
 */
utils.getFactPlace = function(fact) {
  if(fact.$getNormalizedPlace()) {
    return fact.$getNormalizedPlace();
  } else if(fact.$getPlace()) {
    return fact.$getPlace();
  }
};

/**
 * Do our best to return a simple formal gedcomx date from a fact.
 * - If the date has a formal date 
 *   - If the date is already a simple formal date, just return it.
 *   - If the date is an open-ended date range, return a date representing the beginning or end
 *   - If the date is a closed date range, return a date representing the middle
 * - If the date does not have a formal value
 *   - Try to parse with JS date object and generate a simple formal date with it
 *   - Return undefined if this fails
 */
utils.getFormalDate = function(fact){
  if(fact.$getFormalDate()) {
    var date = utils.getSimpleFormalDate(fact.$getFormalDate());
    if(date){
      return date.toFormalString();
    }
  } else if(fact.$getDate()) {
    if(/^\d{4}$/.test(fact.$getDate())){
      return '+' + fact.$getDate();
    } else {
      var date = new Date(fact.$getDate());
      // Invalid date
      if(isNaN(date.getTime())){
        return;
      } 
      // Valid date
      else {
        // Substring to remove time component
        return GedcomXDate.fromJSDate(date).toFormalString().substring(0, 11);
      }
    }
  }
};

/**
 * Given a formal date, return a simple formal date.
 * - If the date is already a simple formal date, just return it.
 * - If the date is an open-ended date range, return a date representing the beginning or end
 * - If the date is a closed date range, return a date representing the middle
 * Think twice before using this directly. You should probably use utils.getFormalDate
 * instead. It will simplify your life immensly.
 */
utils.getSimpleFormalDate = function(formalDateString){
  var date = new GedcomXDate(formalDateString);
  if(date.getType() != 'single') {
    if(date.getStart() && !date.getEnd()) {
      date = date.getStart();
    } else if(!date.getStart() && date.getEnd()) {
      date = date.getEnd();
    } else {
      var start = date.getStart(),
          duration = date.getDuration(),
          halfDuration = GedcomXDate.multiplyDuration(duration, .5);
      date = GedcomXDate.addDuration(start, halfDuration);
    }
  }
  return date;
};

/**
 * Do all we can to extract a 4 digit year from an arbitraty date string.
 * Returns undefined if we can't get anything
 */
utils.extractYearFromDateString = function(date){
  if(/^\d{4}$/.test(date)){
    return date;
  } else {
    var year = new Date(date).getFullYear();
    if(parseInt(year) == year){
      return year;
    }
  }
};

/**
 * Convert mustache markdown template into HTML
 */
utils.markdown = function(text, data, partials) {
  return marked(mustache.render(text, data, partials), { renderer: renderer });
};

/**
 * Generate a gensearch object with as much
 * person data as we can get
 */
utils.gensearchPerson = function(person){
  var gensearch = {};
  
  var givenName = person.$getGivenName();
  if(givenName){
    gensearch.givenName = givenName;
  }
  
  var familyName = person.$getSurname();
  if(familyName){
    gensearch.familyName = familyName;
  }
  
  var birth = person.$getBirth();
  if(birth !== undefined){
    var birthPlace = utils.getFactPlace(birth);
    if(birthPlace){
      gensearch.birthPlace = birthPlace;
    }
    var birthDate = utils.getFactYear(birth);
    if(birthDate){
      gensearch.birthDate = birthDate+'';
    }
  }
  
  var death = person.$getDeath();
  if(death !== undefined){
    var deathPlace = utils.getFactPlace(death);
    if(deathPlace){
      gensearch.deathPlace = deathPlace;
    }
    var deathDate = utils.getFactYear(death);
    if(deathDate){
      gensearch.deathDate = deathDate+'';
    }
  }
  
  return gensearch;
};

/**
 * Compare two formal dates
 */
utils.compareFormalDates = function(date1, date2){
  return GedcomXDate.compare(date1, date2);
};

/**
 * Generate an opportunity
 */
utils.createOpportunity = function(check, person, template, gensearch){
  return {
    id: check.id + ':' + person.id,
    type: check.type,
    checkId: check.id,
    personId: person.id,
    person: person,
    gensearch: gensearch,
    template: template
  };
};

/**
 * Returns true if the date is a full date.
 * Full means is has a year, month, and day.
 */
utils.isFullDate = function(date){
  if(isString(date)){
    return date.length >= 11;
  } else {
    try {
      if(isUndefined(date.getYear()) || isUndefined(date.getMonth()) || isUndefined(date.getDay())){
        return false; 
      } else {
        return true;
      }
    } catch(e) {
      throw new Error('Expected either a formal date string or a GedcomXDate simple object.');
    }
  }
};

/**
 * Make the date a full date by filling in missing month and day.
 * If the new value for month or day is not specified then 1 will be used.
 * Modifies the given object. Only works for GedX dates.
 */
utils.ensureFullDate = function(date, newMonth, newDay){
  try {
    if(!newMonth){
      newMonth = 1;
    }
    if(newMonth > 12){
      newMonth = 12;
    }
    if(!newDay){
      newDay = 1;
    }
    
    // TODO: user setters if they're ever available.
    // https://github.com/trepo/gedcomx-date-js/issues/13
    if(isUndefined(date.getMonth())){
      date._month = newMonth;
    }
    if(isUndefined(date.getDay())){
      var validDayMax = GedcomXDate.daysInMonth(date.getMonth(), date.getYear());
      if(newDay > validDayMax){
        newDay = validDayMax;
      }
      date._day = newDay;
    }
  } catch(e) {
    throw new Error('Expected date to be a GedcomXDate object.');
  }
}



/**
 * Returns true if both parents are biological
 * or true if only one parents exists and that parent is biological.
 * Returns false if any non-biological parent relationships exist.
 */
utils.isBiologicalChildAndParents = function(childAndParents){
  var fatherFacts = childAndParents.$getFatherFacts(),
      motherFacts = childAndParents.$getMotherFacts();
      
  if(childAndParents.$getFatherId()){
    if(!fatherFacts || !containsBiologicalParentFact(fatherFacts)){
      return false;
    }
  }
  
  if(childAndParents.$getMotherId()){
    if(!motherFacts || !containsBiologicalParentFact(motherFacts)){
      return false;
    }
  }
  
  return true;
};

/**
 * Helper function used by isBiologicalChildAndParents.
 * Returns true if the array of facts contains a BiologicalParent fact.
 */
function containsBiologicalParentFact(facts){
  for(var i = 0; i < facts.length; i++){
    if(facts[i].type === 'http://gedcomx.org/BiologicalParent'){
      return true;
    }
  }
  return false;
};

/**
 * Polyfill. Returns true or false;
 */
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

// http://stackoverflow.com/a/9436948/879121
function isString(obj){
  return typeof obj === 'string' || obj instanceof String;
}

function isUndefined(obj){
  return typeof obj === 'undefined';
}
},{"gedcomx-date":48,"marked":54,"mustache":55}],42:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],43:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],44:[function(_dereq_,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],45:[function(_dereq_,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = _dereq_('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = _dereq_('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,_dereq_("/home/ubuntu/workspace/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":44,"/home/ubuntu/workspace/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":42,"inherits":43}],46:[function(_dereq_,module,exports){
var util = _dereq_('util'),
    Simple = _dereq_('./simple.js');

/**
 * An approximate GedcomX Date.
 * Inherits from Simple.
 */
function Approximate() {

  if(arguments.length > 0) {

    if(arguments[0].length < 1 || arguments[0].charAt(0) != 'A') {
      throw new Error('Invalid Approximate Date');
    }
    try {
      Simple.call(this, arguments[0].substr(1));
    } catch(e) {
      throw new Error(e.message+' in Approximate Date');
    }
  } else {
    Simple.call(this);
  }
}

util.inherits(Approximate, Simple);

/**
 * An approximate date is approximate.
 */
Approximate.prototype.isApproximate = function() {
  return true;
}

/**
 * Output Formalized approximate string.
 */
Approximate.prototype.toFormalString = function() {
  return 'A'+Approximate.super_.prototype.toFormalString.call(this);
}

module.exports = Approximate;
},{"./simple.js":51,"util":45}],47:[function(_dereq_,module,exports){
/**
 * A gedcomX Duration
 */
function Duration(str) {

  // There must be at least a P
  if(str.length < 1 || str.charAt(0) != 'P') {
    throw new Error('Invalid Duration');
  }

  var duration = str.substr(1);

  if(duration.length < 1) {
    throw new Error('Invalid Duration');
  }

  // 5.3.2 allows for NON normalized durations
  // We assume that if there is a space, it is non-normalized
  if(/\s/.test(duration)) {
    throw new Error('Non normalized durations not implemented');
    //this._parseNonNormalized(duration);
  } else {
    this._parseNormalized(duration);
  }

}

/**
 * Parse a normalized duration.
 */
Duration.prototype._parseNormalized = function(str) {

  var duration = str.split(''),
      currentNum = '',
      inTime = false,
      seen = [],
      valid = ['Y', 'Mo', 'D', 'T', 'H', 'Mi', 'S'];

  for(var x in duration) {
    var character = duration[x];

    if(/[0-9]/.test(character)) {
      currentNum += character+'';
      continue;
    }

    switch(character) {
      case 'Y':
        if(currentNum.length < 1) {
          throw new Error('Invalid Duration: invalid years');
        }
        if(seen.indexOf('Y') != -1) {
          throw new Error('Invalid Duration: duplicate years');
        }
        if(valid.indexOf('Y') == -1) {
          throw new Error('Invalid Duration: years out of order');
        }
        this._years = parseInt(currentNum, 10);
        seen.push('Y');
        valid = valid.slice(valid.indexOf('Y')+1);
        currentNum = '';
        break;
      case 'M':
        if(inTime) {
          if(currentNum.length < 1) {
            throw new Error('Invalid Duration: invalid minutes');
          }
          if(seen.indexOf('Mi') != -1) {
            throw new Error('Invalid Duration: duplicate minutes');
          }
          if(valid.indexOf('Mi') == -1) {
            throw new Error('Invalid Duration: minutes out of order');
          }
          this._minutes = parseInt(currentNum, 10);
          seen.push('Mi');
          valid = valid.slice(valid.indexOf('Mi')+1);
          currentNum = '';
        } else {
          if(currentNum.length < 1) {
            throw new Error('Invalid Duration: invalid months');
          }
          if(seen.indexOf('Mo') != -1) {
            throw new Error('Invalid Duration: duplicate months');
          }
          if(valid.indexOf('Mo') == -1) {
            throw new Error('Invalid Duration: months out of order');
          }
          this._months = parseInt(currentNum, 10);
          valid = valid.slice(valid.indexOf('Mo')+1);
          seen.push('Mo');
          currentNum = '';
        }
        break;
      case 'D':
        if(currentNum.length < 1) {
          throw new Error('Invalid Duration: invalid days');
        }
        if(seen.indexOf('D') != -1) {
          throw new Error('Invalid Duration: duplicate days');
        }
        if(valid.indexOf('D') == -1) {
          throw new Error('Invalid Duration: days out of order');
        }
        this._days = parseInt(currentNum, 10);
        seen.push('D');
        valid = valid.slice(valid.indexOf('D')+1);
        currentNum = '';
        break;
      case 'H':
        if(!inTime) {
          throw new Error('Invalid Duration: Missing T before hours');
        }
        if(currentNum.length < 1) {
          throw new Error('Invalid Duration: invalid hours');
        }
        if(seen.indexOf('H') != -1) {
          throw new Error('Invalid Duration: duplicate hours');
        }
        if(valid.indexOf('H') == -1) {
          throw new Error('Invalid Duration: hours out of order');
        }
        this._hours = parseInt(currentNum, 10);
        seen.push('H');
        valid = valid.slice(valid.indexOf('H')+1);
        currentNum = '';
        break;
      case 'S':
        if(!inTime) {
          throw new Error('Invalid Duration: Missing T before seconds');
        }
        if(currentNum.length < 1) {
          throw new Error('Invalid Duration: invalid seconds');
        }
        if(seen.indexOf('S') != -1) {
          throw new Error('Invalid Duration: duplicate seconds');
        }
        // Note that you cannot have seconds out of order because it is last
        this._seconds = parseInt(currentNum, 10);
        seen.push('S');
        valid = [];
        currentNum = '';
        break;
      case 'T':
        if(seen.indexOf('T') != -1) {
          throw new Error('Invalid Duration: duplicate T');
        }
        inTime = true;
        seen.push('T');
        valid = valid.slice(valid.indexOf('T')+1);
        break;
      default:
        throw new Error('Invalid Duration: Unknown Letter '+character);
    }
  }

  // If there is leftover we have an invalid
  if(currentNum != '') {
    throw new Error('Invalid Duration: No letter after '+currentNum);
  }

}

/**
 * Return the string recurring.
 */
Duration.prototype.getType = function() {
  return 'duration';
}

/**
 * A duration is never approximate.
 */
Duration.prototype.isApproximate = function() {
  return false;
}

/**
 * Return the years as a number or undefined.
 */
Duration.prototype.getYears = function() {
  return this._years;
}

/**
 * Return the months as a number or undefined.
 */
Duration.prototype.getMonths = function() {
  return this._months;
}

/**
 * Return the days as a number or undefined.
 */
Duration.prototype.getDays = function() {
  return this._days;
}

/**
 * Return the hours as a number or undefined.
 */
Duration.prototype.getHours = function() {
  return this._hours;
}

/**
 * Return the minutes as a number or undefined.
 */
Duration.prototype.getMinutes = function() {
  return this._minutes;
}

/**
 * Return the seconds as a number or undefined.
 */
Duration.prototype.getSeconds = function() {
  return this._seconds;
}

/**
 * Output Formalized duration string.
 */
Duration.prototype.toFormalString = function() {
  var duration = 'P';

  if(this._years) {
    duration += this._years+'Y';
  }

  if(this._months) {
    duration += this._months+'M';
  }

  if(this._days) {
    duration += this._days+'D';
  }

  if(this._hours || this._minutes || this._seconds) {
    duration += 'T';

    if(this._hours) {
      duration += this._hours+'H';
    }

    if(this._minutes) {
      duration += this._minutes+'M';
    }

    if(this._seconds) {
      duration += this._seconds+'S';
    }
  }

  return duration;
}

module.exports = Duration;
},{}],48:[function(_dereq_,module,exports){
var GedUtil = _dereq_('./util.js'),
    Simple = _dereq_('./simple.js'),
    Approximate = _dereq_('./approximate.js'),
    Recurring = _dereq_('./recurring.js'),
    Range = _dereq_('./range.js');

/**
 * A GedcomX Date.
 * This will parse the passed in string and return
 * the appropriate GedcomX Date object.
 */
function GedcomXDate(str) {

  if(str == '') {
    throw new Error('Invalid Date');
  }

  if(str.charAt(0) == 'R') {
    return new Recurring(str);
  } else if(/\//.test(str)) {
    return new Range(str);
  } else if(str.charAt(0) == 'A') {
    return new Approximate(str);
  } else {
    return new Simple(str);
  }
}

/**
 * The version of this library.
 */
GedcomXDate.version = '0.3.2';

/**
 * Expose addDuration.
 */
GedcomXDate.addDuration = GedUtil.addDuration;

/**
 * Expose multiplyDuration.
 */
GedcomXDate.multiplyDuration = GedUtil.multiplyDuration;

/**
 * Expose getDuration.
 */
GedcomXDate.getDuration = GedUtil.getDuration;

/**
 * Expose daysInMonth.
 */
GedcomXDate.daysInMonth = GedUtil.daysInMonth;

/**
 * Expose now.
 */
GedcomXDate.now = GedUtil.now;

/**
 * Expose fromJSDate.
 */
GedcomXDate.fromJSDate = GedUtil.fromJSDate;

/**
 * Expose compare.
 */
GedcomXDate.compare = GedUtil.compare;

module.exports = GedcomXDate;
},{"./approximate.js":46,"./range.js":49,"./recurring.js":50,"./simple.js":51,"./util.js":53}],49:[function(_dereq_,module,exports){
var GedUtil = _dereq_('./util.js'),
    Simple = _dereq_('./simple.js'),
    Duration = _dereq_('./duration.js'),
    Approximate = _dereq_('./approximate.js');

/**
 * A GedcomX Range.
 * It will place a Singel date at this.start and this.end,
 * as well as a Duration at this.duration.
 */
function Range(str) {

  var range = str;

  // If range starts with A, its approximate
  if(range.charAt(0) == 'A') {
    this._approximate = true;
    range = str.substr(1);
  }

  var parts = range.split('/');

  if(parts.length != 2 || (!parts[0] && !parts[1])) {
    throw new Error('Invalid Date Range');
  }

  if(parts[0]) {
    try {
      this.start = new Simple(parts[0]);
    } catch(e) {
      throw new Error(e.message+' in Range Start Date');
    }
  }

  if(parts[1]) {
    if(parts[1].charAt(0) == 'P') {
      if(!this.start) {
        throw new Error('A Range may not end with a duration if missing a start date');
      }
      try {
        this.duration = new Duration(parts[1]);
      } catch(e) {
        throw new Error(e.message+' in Range End Date');
      }
      // Use duration and calculate end date
      this.end = GedUtil.addDuration(this.start, this.duration);
    } else {
      try {
        this.end = new Simple(parts[1]);
      } catch(e) {
        throw new Error(e.message+' in Range End Date');
      }
      if(this.start) {
        this.duration = GedUtil.getDuration(this.start, this.end);
      }
    }
  }

}

/**
 * Return the string range.
 */
Range.prototype.getType = function() {
  return 'range';
}

/**
 * Return true if range is approximate.
 */
Range.prototype.isApproximate = function() {
  if(this._approximate) {
    return true;
  } else {
    return false;
  }
}

/**
 * Return the start date or undefined.
 */
Range.prototype.getStart = function() {
  return this.start;
}

/**
 * Return the end date or undefined.
 */
Range.prototype.getDuration = function() {
  return this.duration;
}

/**
 * Return the duration or undefined.
 */
Range.prototype.getEnd = function() {
  return this.end;
}

/**
 * Output Formalized range string.
 */
Range.prototype.toFormalString = function() {
  var range = '';

  if(this._approximate) {
    range += 'A';
  }

  if(this.start) {
    range += this.start.toFormalString();
  }
  range += '/';

  if(this.duration) {
    range += this.duration.toFormalString();
  } else if(this.end) {
    range += this.end.toFormalString();
  }

  return range;
}

module.exports = Range;
},{"./approximate.js":46,"./duration.js":47,"./simple.js":51,"./util.js":53}],50:[function(_dereq_,module,exports){
var util = _dereq_('util'),
    GedUtil = _dereq_('./util.js'),
    Range = _dereq_('./range.js');

/**
 * A GedcomX Recurring Date.
 */
function Recurring(str) {
  
  var parts = str.split('/');

  if(str.charAt(0) != 'R' || parts.length != 3) {
    throw new Error('Invalid Recurring Date');
  }

  // We must have start and end. error if both aren't set
  if(!parts[1] || !parts[2]) {
    throw new Error('Recurring must have a start and end');
  }

  var countNum = parts[0].substr(1);

  // Validate count is a number if set
  if(countNum) {
    if(!(/^[0-9]+$/.test(countNum))) {
      throw new Error('Invalid recurrence count: not a number')
    }
    this.count = parseInt(countNum, 10);
    if(this.count < 0) throw new Error('Invalid recurrence count');
  }

  Range.call(this, parts[1]+'/'+parts[2]);

  // If we have a count, replace end with the actual end date or undefined.
  delete this.end;
  if(this.count) {
    this.end = this.getNth(this.count);
  }
}

util.inherits(Recurring, Range);

/**
 * Return the string recurring.
 */
Recurring.prototype.getType = function() {
  return 'recurring';
}

/**
 * Return the count or Infinity.
 */
Recurring.prototype.getCount = function() {
  if(this.count == undefined) {
    return Infinity;
  } else {
    return this.count;
  }
}

/**
 * Returns the nth instance of this recurring date.
 */
Recurring.prototype.getNth = function(multiplier) {
  
  var duration = GedUtil.multiplyDuration(this.duration, multiplier);

  return GedUtil.addDuration(this.start, duration);
  
}

/**
 * Output Formalized range string.
 */
Recurring.prototype.toFormalString = function() {
  var range = Recurring.super_.prototype.toFormalString.call(this);

  if(this.count) {
    return 'R'+this.count+'/'+range;
  } else {
    return 'R/'+range;
  }
}

module.exports = Recurring;
},{"./range.js":49,"./util.js":53,"util":45}],51:[function(_dereq_,module,exports){
var GlobalUtil = _dereq_('./util-global.js');
/**
 * The simplest representation of a date.
 */
function Simple() {

  // If arguments passed in, try and parse the simple date
  if(arguments.length > 0) {
    this._parse(arguments[0]);
  } else {
    // Note that all dates and times are UTC internally!
    var date = new Date();
    this._year = date.getUTCFullYear();
    this._month = date.getUTCMonth();
    this._day = date.getUTCDay();
    this._hours = date.getUTCHours();
    this._minutes = date.getUTCMinutes();
    this._seconds = date.getUTCSeconds();
    this._tzHours = 0;
    this._tzMinutes = 0;
  }
}

/**
 * Parse a simple date.
 * This function also does strict validation.
 */
Simple.prototype._parse = function(str) {

  var end = str.length,
      offset = 0;

  // There is a minimum length of 5 characters
  if(str.length < 5) throw new Error('Invalid Date');

  // Extract and validate year
  var year = str.substr(offset,5);
  if(year.match(/^[+-][0-9]{4}$/) === null) {
    throw new Error('Invalid Date: Malformed year');
  }
  this._year = parseInt(year, 10);
  offset += 5;

  if(offset == end) {
    return;
  }

  // If there is time
  if(str.charAt(offset) == 'T') {
    return this._parseTime(str.substr(offset+1));
  }

  if(str.charAt(offset) != '-') {
    throw new Error('Invalid Date: Malformed year-month separator');
  }

  if(end-offset < 3) {
    throw new Error('Invalid Date: Malformed month');
  }

  // Extract and validate month
  var month = str.substr(offset+1,2);
  if(month.match(/^(0[1-9]|1[0-2])$/) === null) {
    throw new Error('Invalid Date: Malformed month');
  }
  this._month = parseInt(month, 10);
  offset += 3;

  if(offset == end) {
    return;
  }

  // If there is time
  if(str.charAt(offset) == 'T') {
    return this._parseTime(str.substr(offset+1));
  }

  if(str.charAt(offset) != '-') {
    throw new Error('Invalid Date: Malformed month-day separator');
  }

  if(end-offset < 3) {
    throw new Error('Invalid Date: Malformed day');
  }

  // Extract and validate day
  var day = str.substr(offset+1,2);
  var daysInMonth = GlobalUtil.daysInMonth(this._month, this._year);

  switch(daysInMonth) {
    case 31:
      if(day.match(/^(0[1-9]|[1-2][0-9]|3[0-1])$/) === null) {
        throw new Error('Invalid Date: Malformed day (31 in month '+this._month+')');
      }
      break;
    case 30:
      if(day.match(/^(0[1-9]|[1-2][0-9]|30)$/) === null) {
        throw new Error('Invalid Date: Malformed day (30 in month '+this._month+')');
      }
      break;
    case 29:
      if(day.match(/^(0[1-9]|1[0-9]|2[0-9])$/) === null) {
        throw new Error('Invalid Date: Malformed day (29 in month '+this._month+' - leapyear)');
      }
      break;
    case 28:
      if(day.match(/^(0[1-9]|1[0-9]|2[0-8])$/) === null) {
        throw new Error('Invalid Date: Malformed day (28 in month '+this._month+')');
      }
      break;
  }
  this._day = parseInt(day, 10);
  offset += 3;

  if(offset == end) return;

  // If there is time
  if(str.charAt(offset) == 'T') {
    return this._parseTime(str.substr(offset+1));
  } else {
    throw new Error('Invalid Date');
  }

}

/**
 * Parse the time component.
 */
Simple.prototype._parseTime = function(str) {
  
  var offset = 0,
      end = str.length,
      flag24 = false;

  // Always initialize the Timezone to the local offset.
  // It may be overridden if set
  var tempDate = new Date(),
      tempOffset = tempDate.getTimezoneOffset();
  
  this._tzHours = tempOffset/60;
  this._tzMinutes = tempOffset%60;

  // There is a minimum length of 2 characters
  if(str.length < 2) throw new Error('Invalid Date: Malformed hours');

  // Extract and validate hours
  var hours = str.substr(offset,2);
  if(hours.match(/^([0-1][0-9]|2[0-3])$/) === null) {
    if(hours == '24') {
      flag24 = true;
    } else {
      throw new Error('Invalid Date: Malformed hours');
    }
  }
  this._hours = parseInt(hours, 10);
  offset += 2;

  if(offset == end) {
    return;
  }

  // If there is timezone offset
  if(str.charAt(offset) == '+' || str.charAt(offset) == '-' || str.charAt(offset) == 'Z') {
    return this._parseTimezone(str.substr(offset));
  }

  if(str.charAt(offset) != ':') {
    throw new Error('Invalid Date: Malformed hour-minute separator');
  }

  if(end-offset < 3) {
    throw new Error('Invalid Date: Malformed minutes');
  }

  var minutes = str.substr(offset+1,2);
  if(minutes.match(/^[0-5][0-9]$/) === null) {
    throw new Error('Invalid Date: Malformed minutes');
  }
  if(flag24 && minutes != '00') {
    throw new Error('Invalid Date: Hour of 24 requires 00 minutes');
  }
  this._minutes = parseInt(minutes, 10);
  offset += 3;

  if(offset == end) {
    return;
  }

  // If there is timezone offset
  if(str.charAt(offset) == '+' || str.charAt(offset) == '-' || str.charAt(offset) == 'Z') {
    return this._parseTimezone(str.substr(offset));
  }

  if(str.charAt(offset) != ':') {
    throw new Error('Invalid Date: Malformed minute-second separator');
  }

  if(end-offset < 3) {
    throw new Error('Invalid Date: Malformed seconds');
  }

  var seconds = str.substr(offset+1,2);
  if(seconds.match(/^[0-5][0-9]$/) === null) {
    throw new Error('Invalid Date: Malformed seconds');
  }
  if(flag24 && seconds != '00') {
    throw new Error('Invalid Date: Hour of 24 requires 00 seconds');
  }
  this._seconds = parseInt(seconds, 10);
  offset += 3;

  if(offset == end) {
    return;
  }

  // If there is timezone offset
  if(str.charAt(offset) == '+' || str.charAt(offset) == '-' || str.charAt(offset) == 'Z') {
    return this._parseTimezone(str.substr(offset));
  } else {
    throw new Error('Invalid Date: Malformed Time');
  }

}

/**
 * Parse the timezone component.
 */
Simple.prototype._parseTimezone = function(str) {
  
  var offset = 0,
      end = str.length;

  // If Z we're done
  if(str.charAt(0) == 'Z') {
    if(str.length == 1) {
      this._tzHours = 0;
      this._tzMinutes = 0;
      return;
    } else {
      throw new Error('Invalid Date: malformed timezone');
    }
  }

  if(end-offset < 3) {
    throw new Error('Invalid Date: Malformed timezone');
  }

  var tzHours = str.substr(offset,3);
  if(tzHours.match(/^[+-]([0-1][0-9]|2[0-3])$/) === null) {
    throw new Error('Invalid Date: Malformed timezone hours');
  }
  this._tzHours = parseInt(tzHours, 10);
  // set tz minutes to clear out default local tz offset
  this._tzMinutes = 0;
  offset += 3;

  if(offset == end) {
    return;
  }

  if(str.charAt(offset) != ':') {
    throw new Error('Invalid Date: Malformed timezone hour-minute separator');
  }

  if(end-offset < 3) {
    throw new Error('Invalid Date: Malformed timezone minutes');
  }
  
  var tzMinutes = str.substr(offset+1,2);
  if(tzMinutes.match(/^[0-5][0-9]$/) === null) {
    throw new Error('Invalid Date: Malformed timezone minutes');
  }
  this._tzMinutes = parseInt(tzMinutes, 10);
  offset += 3;

  if(offset == end) {
    return;
  } else {
    throw new Error('Invalid Date: Malformed timezone');
  }

}

/**
 * Return the string single.
 */
Simple.prototype.getType = function() {
  return 'single';
}

/**
 * A simple date is not approximate.
 */
Simple.prototype.isApproximate = function() {
  return false;
}

/**
 * Return the year as a number. 
 */
Simple.prototype.getYear = function() {
  return this._year;
}

/**
 * Return the month as a number. 
 */
Simple.prototype.getMonth = function() {
  return this._month;
}

/**
 * Return the day as a number. 
 */
Simple.prototype.getDay = function() {
  return this._day;
}

/**
 * Return the hours as a number. 
 */
Simple.prototype.getHours = function() {
  return this._hours;
}

/**
 * Return the minutes as a number. 
 */
Simple.prototype.getMinutes = function() {
  return this._minutes;
}

/**
 * Return the seconds as a number. 
 */
Simple.prototype.getSeconds = function() {
  return this._seconds;
}

/**
 * Return the timezone hours as a number. 
 */
Simple.prototype.getTZHours = function() {
  return this._tzHours;
}

/**
 * Return the timezone minutes as a number. 
 */
Simple.prototype.getTZMinutes = function() {
  return this._tzMinutes;
}

/**
 * Output Formalized simple string.
 */
Simple.prototype.toFormalString = function() {
  var simple = '';

  if(this._year >= 0) {
    simple += '+'+('0000'+this._year).substr(-4,4);
  } else {
    simple += '-'+('0000'+Math.abs(this._year)).substr(-4,4);
  }

  if(this._month) {
    simple += '-'+('00'+this._month).substr(-2,2);
  }

  if(this._day) {
    simple += '-'+('00'+this._day).substr(-2,2);
  }

  if(this._hours != undefined || this._minutes != undefined || this._seconds != undefined) {
    simple += 'T';
  }

  if(this._hours != undefined) {
    simple += ('00'+this._hours).substr(-2,2);
  }

  if(this._minutes != undefined) {
    simple += ':'+('00'+this._minutes).substr(-2,2);
  }

  if(this._seconds != undefined) {
    simple += ':'+('00'+this._seconds).substr(-2,2);
  }

  if(this._hours != undefined || this._minutes != undefined || this._seconds != undefined) {
    if(this._tzHours === 0 || this._tzMinutes === 0) {
      simple += 'Z';
    } else {
      if(this._tzHours != undefined) {
        if(this._tzHours >= 0) {
          simple += '+';
        } else {
          simple += '-';
        }
        simple += ('00'+Math.abs(this._tzHours)).substr(-2,2);
      }
      if(this._tzMinutes != undefined) {
        simple += ':'+('00'+this._tzMinutes).substr(-2,2);
      }
    }
  }

  return simple;
}

module.exports = Simple;
},{"./util-global.js":52}],52:[function(_dereq_,module,exports){
module.exports = {
  daysInMonth: daysInMonth
}

/**
 * Return the number of days in a month, 
 * taking leapyear into account.
 */
function daysInMonth(month, year) {
  switch(month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      var leapyear;
      if(year % 4 != 0) {
        leapyear = false;
      } else if(year % 100 != 0) {
        leapyear = true;
      } else if(year % 400 != 0) {
        leapyear = false;
      } else {
        leapyear = true;
      }
      if(leapyear) {
        return 29;
      } else {
        return 28;
      }
    default:
      throw new Error('Unknown Month');
  }
}
},{}],53:[function(_dereq_,module,exports){
var GlobalUtil = _dereq_('./util-global.js'),
    Duration = _dereq_('./duration.js'),
    Simple = _dereq_('./simple.js'),
    Approximate = _dereq_('./approximate.js');

module.exports = {
  getDuration: getDuration,
  daysInMonth: GlobalUtil.daysInMonth,
  addDuration: addDuration,
  multiplyDuration: multiplyDuration,
  now: now,
  fromJSDate: fromJSDate,
  compare: compare
}

/**
 * Takes in a start duration and a multiplier,
 * and returns a new Duration.
 * Rounds using Math.round
 */
function multiplyDuration(startDuration, multiplier) {

  if(!isFinite(multiplier) || multiplier <= 0) {
    throw new Error('Invalid Multiplier');
  }

  var newDuration = {},
      hasTime = false,
      duration = '';

  if(startDuration.getSeconds()) {
    newDuration.seconds = Math.round(startDuration.getSeconds()*multiplier);
  }

  if(startDuration.getMinutes()) {
    newDuration.minutes = Math.round(startDuration.getMinutes()*multiplier);
  }

  if(startDuration.getHours()) {
    newDuration.hours = Math.round(startDuration.getHours()*multiplier);
  }

  if(startDuration.getDays()) {
    newDuration.days = Math.round(startDuration.getDays()*multiplier);
  }

  if(startDuration.getMonths()) {
    newDuration.months = Math.round(startDuration.getMonths()*multiplier);
  }

  if(startDuration.getYears()) {
    newDuration.years = Math.round(startDuration.getYears()*multiplier);
  }

  if(newDuration.seconds) {
    hasTime = true;
    duration = newDuration.seconds+'S'+duration;
  }

  if(newDuration.minutes) {
    hasTime = true;
    duration = newDuration.minutes+'M'+duration;
  }

  if(newDuration.hours) {
    hasTime = true;
    duration = newDuration.hours+'H'+duration;
  }

  if(hasTime) {
    duration = 'T'+duration;
  }

  if(newDuration.days) {
    duration = newDuration.days+'D'+duration;
  }

  if(newDuration.months) {
    duration = newDuration.months+'M'+duration;
  }

  if(newDuration.years) {
    duration = newDuration.years+'Y'+duration;
  }

  if(!duration) {
    throw new Error('Invalid Duration Multiplier');
  }

  return new Duration('P'+duration);

}

/**
 * Adds a duration to a date, returning the new date.
 */
function addDuration(startDate, duration) {
  var end = getObjFromDate(startDate, false),
      endString = '';

  // Initialize all the values we need in end based on the duration
  zipDuration(end, duration);

  // Add Timezone offset to endString
  if(startDate.getTZHours() != undefined) {
    if(startDate.getTZHours() < 0) {
      endString += '-';
    } else {
      endString += '+';
    }
    endString += ('00'+Math.abs(startDate.getTZHours())).substr(-2,2);
    endString += ':'+('00'+Math.abs(startDate.getTZMinutes())).substr(-2,2);
  }

  if(duration.getSeconds()) {
    end.seconds += duration.getSeconds();
  }
  while(end.seconds && end.seconds >= 60) {
    end.seconds -= 60;
    end.minutes += 1;
  }
  if(end.seconds != undefined) {
    endString = ':'+('00'+end.seconds).substr(-2,2)+endString;
  }

  if(duration.getMinutes()) {
    end.minutes += duration.getMinutes();
  }
  while(end.minutes && end.minutes >= 60) {
    end.minutes -= 60;
    end.hours += 1;
  }
  if(end.minutes != undefined) {
    endString = ':'+('00'+end.minutes).substr(-2,2)+endString;
  }

  if(duration.getHours()) {
    end.hours += duration.getHours();
  }
  while(end.hours && end.hours >= 24) {
    end.hours -= 24;
    end.day += 1;
  }
  if(end.hours != undefined) {
    endString = 'T'+('00'+end.hours).substr(-2,2)+endString;
  }

  if(duration.getDays()) {
    end.day += duration.getDays();
  }
  while(end.day && end.day > GlobalUtil.daysInMonth(end.month, end.year)) {
    end.day -= GlobalUtil.daysInMonth(end.month, end.year);
    end.month += 1;
    if(end.month > 12) {
      end.month -= 12;
      end.year += 1;
    }
  }

  if(duration.getMonths()) {
    end.month += duration.getMonths();
  }
  while(end.month && end.month > 12) {
    end.month -= 12;
    end.year += 1;
  }
  // After readjusting the month, check again for days overflow
  if(end.day && end.day > GlobalUtil.daysInMonth(end.month, end.year)){
    end.day = end.day - GlobalUtil.daysInMonth(end.month, end.year);
    end.month += 1;
    if(end.month > 12) {
      end.month -= 12;
      end.year += 1;
    }
  }
  
  if(end.day != undefined) {
    endString = '-'+('00'+end.day).substr(-2,2)+endString;
  }
  if(end.month != undefined) {
    endString = '-'+('00'+end.month).substr(-2,2)+endString;
  }

  if(duration.getYears()) {
    end.year += duration.getYears();
  }
  if(end.year != undefined) {
    endString = ('0000'+Math.abs(end.year)).substr(-4,4)+endString;
    if(end.year < 0) {
      endString = '-'+endString;
    } else {
      endString = '+'+endString;
    }
  }

  // After adding year we could have bumped into a non leap year
  // TODO fix this

  if(end.year > 9999) {
    throw new Error('New date out of range');
  }

  // TODO return actual simple or approximate dates
  if(startDate.isApproximate()) {
    endString = 'A'+endString;
    return new Approximate(endString);
  } else {
    return new Simple(endString);
  }

}

/**
 * Returns the duration between the starting and ending date.
 */
function getDuration(startDate, endDate) {
  
  if(!(startDate instanceof Simple && endDate instanceof Simple)){
    throw new Error('Start and end dates must be simple dates');
  }
  
  var start = getObjFromDate(startDate, true),
      end = getObjFromDate(endDate, true),
      hasTime = false,
      duration = '';

  zipDates(start, end);

  if(end.seconds != undefined) {
    while(end.seconds-start.seconds < 0) {
      end.minutes -= 1;
      end.seconds += 60;
    }
    if(end.seconds-start.seconds > 0) {
      hasTime = true;
      duration = ('00'+(end.seconds-start.seconds)).substr(-2,2)+'S'+duration;
    }
  }

  if(end.minutes != undefined) {
    while(end.minutes-start.minutes < 0) {
      end.hours -= 1;
      end.minutes += 60;
    }
    if(end.minutes-start.minutes > 0) {
      hasTime = true;
      duration = ('00'+(end.minutes-start.minutes)).substr(-2,2)+'M'+duration;
    }
  }

  if(end.hours != undefined) {
    while(end.hours-start.hours < 0) {
      end.day -= 1;
      end.hours += 24;
    }
    if(end.hours-start.hours > 0) {
      hasTime = true;
      duration = ('00'+(end.hours-start.hours)).substr(-2,2)+'H'+duration;
    }
  }

  if(hasTime) {
    duration = 'T'+duration;
  }

  if(end.day != undefined) {
    while(end.day-start.day < 0) {
      end.month -= 1;
      if(end.month < 1) {
        end.year -= 1;
        end.month += 12;
      }
      end.day += GlobalUtil.daysInMonth(end.month,end.year);
    }
    if(end.day-start.day > 0) {
      duration = ('00'+(end.day-start.day)).substr(-2,2)+'D'+duration;
    }
  }

  if(end.month != undefined) {
    while(end.month-start.month < 0) {
      end.year -= 1;
      end.month += 12;
    }
    if(end.month-start.month > 0) {
      duration = ('00'+(end.month-start.month)).substr(-2,2)+'M'+duration;
    }
  }

  if(end.year-start.year > 0) {
    duration = ('0000'+(end.year-start.year)).substr(-4,4)+'Y'+duration;
  }

  if(end.year-start.year < 0 || duration == '') {
    throw new Error('Start Date must be less than End Date');
  }

  return new Duration('P'+duration);
}

/**
 * Ensures that both start and end have values where the other has values.
 * For example, if start has minutes but end does not, this function
 * will initialize minutes in end.
 */
function zipDates(start, end) {
  if(start.month != undefined && end.month == undefined) {
    end.month = 1;
  }
  if(start.month == undefined && end.month != undefined) {
    start.month = 1;
  }

  if(start.day != undefined && end.day == undefined) {
    end.day = 1;
  }
  if(start.day == undefined && end.day != undefined) {
    start.day = 1;
  }

  if(start.hours != undefined && end.hours == undefined) {
    end.hours = 0;
  }
  if(start.hours == undefined && end.hours != undefined) {
    start.hours = 0;
  }

  if(start.minutes != undefined && end.minutes == undefined) {
    end.minutes = 0;
  }
  if(start.minutes == undefined && end.minutes != undefined) {
    start.minutes = 0;
  }

  if(start.seconds != undefined && end.seconds == undefined) {
    end.seconds = 0;
  }
  if(start.seconds == undefined && end.seconds != undefined) {
    start.seconds = 0;
  }
}

/**
 * Ensures that date has its proeprties initialized based on what the duration has.
 * For example, if date does not have minutes and duration does, this will
 * initialize minutes in the date.
 */
function zipDuration(date, duration) {
  var toSet = {};

  if(duration.getSeconds()) {
    toSet = {
      seconds: true,
      minutes: true,
      hours: true,
      days: true,
      months: true
    };
  } else if(duration.getMinutes()) {
    toSet = {
      minutes: true,
      hours: true,
      days: true,
      months: true
    };
  } else if(duration.getHours()) {
    toSet = {
      hours: true,
      days: true,
      months: true
    };
  } else if(duration.getDays()) {
    toSet = {
      days: true,
      months: true
    };
  } else if(duration.getMonths()) {
    toSet = {
      months: true
    };
  } else {
    return;
  }

  if(toSet.seconds && date.seconds == undefined) {
    date.seconds = 0;
  }

  if(toSet.minutes && date.minutes == undefined) {
    date.minutes = 0;
  }

  if(toSet.hours && date.hours == undefined) {
    date.hours = 0;
  }

  if(toSet.days && date.day == undefined) {
    date.day = 1;
  }

  if(toSet.months && date.month == undefined) {
    date.month = 1;
  }

}

/**
 * Returns an object representing a date, optionally normalizing to UTC time.
 */
function getObjFromDate(date, adjustTimezone) {
  var obj = {
    year: date.getYear(),
    month: date.getMonth(),
    day: date.getDay(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  }

  if(adjustTimezone) {
    if(obj.minutes != undefined && date.getTZMinutes() != undefined) {
      obj.minutes += date.getTZMinutes();
    }

    if(obj.hours != undefined && date.getTZHours() != undefined) {
      obj.hours += date.getTZHours();
    }
  }
  return obj;
}

/**
 * Returns a new single date representing the current date
 */
function now(){
  return fromJSDate(new Date());
}

/**
 * Return a simple date object from a JavaScript date object
 */
function fromJSDate(date){
  // Remove the millisecond time component
  return new Simple('+' + date.toISOString().replace(/\.\d{3}/,''));
};

/**
 * Compare two dates. Only works for single dates with the same specificity.
 * Designed to be usable as a custom compare function for sorting an array of dates.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
function compare(date1, date2){
  
  // Allow formal strings as input
  if(isString(date1)){
    try {
      if(date1[0] === 'A'){
        date1 = new Approximate(date1);
      } else {
        date1 = new Simple(date1);
      }
    } catch(e) {
      throw new Error(date1 + ' is not a simple date. Can only compare simple dates.')
    }
  }
  if(isString(date2)){
    try {
      if(date2[0] === 'A'){
        date2 = new Approximate(date2);
      } else {
        date2 = new Simple(date2);
      }
    } catch(e) {
      throw new Error(date2 + ' is not a simple date. Can only compare simple dates.')
    }
  }
  
  // Only allow simple dates
  if(!(date1 instanceof Simple) || !(date2 instanceof Simple)){
    throw new Error('Bad input. Can only compare simple dates.');
  }
  
  // Compare date parts in descending order
  var parts = [
    '_year',
    '_month',
    '_day',
    '_hours',
    '_minutes',
    '_seconds'
  ];
  
  // We will short-circuit when we determine whether one
  // date is greater than the other
  for(var i = 0; i < parts.length; i++){
    var part = parts[i];
    
    // If these parts match exactly, 
    if(date1[part] === date2[part]){
      continue;
    }

    // We already know that both parts are not undefined, so if one of them
    // is then we know the dates have different specificities. We can't support
    // that. See https://github.com/trepo/gedcomx-date-js/pull/12
    if(typeof date1[part] === 'undefined' || typeof date2[part] === 'undefined'){
      throw new Error('Unable to compare dates with different specificities.')
    }
    
    // By this point we're guaranteed that this part is defined in both dates
    // so we can finally do some > and <
    if(date1[part] > date2[part]){
      return 1;
    } else {
      return -1;
    }
    
  }
  
  // If we make it here then the dates are equal
  return 0;
  
};

function isString(obj){
  return typeof obj === 'string' || obj instanceof String;
};

},{"./approximate.js":46,"./duration.js":47,"./simple.js":51,"./util-global.js":52}],54:[function(_dereq_,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],55:[function(_dereq_,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (global, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else if (typeof define === "function" && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    factory(global.Mustache = {}); // <script>
  }
}(this, function (mustache) {

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tags) {
      if (typeof tags === 'string')
        tags = tags.split(spaceRe, 2);

      if (!isArray(tags) || tags.length !== 2)
        throw new Error('Invalid tags: ' + tags);

      openingTagRe = new RegExp(escapeRegExp(tags[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tags[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tags[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view == null ? {} : view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function (name) {
    var cache = this.cache;

    var value;
    if (name in cache) {
      value = cache[name];
    } else {
      var context = this, names, index;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          while (value != null && index < names.length)
            value = value[names[index++]];
        } else if (typeof context.view == 'object') {
          value = context.view[name];
        }

        if (value != null)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this._renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this._renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this._renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this._unescapedValue(token, context);
      else if (symbol === 'name') value = this._escapedValue(token, context);
      else if (symbol === 'text') value = this._rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype._renderSection = function (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender(template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype._renderInverted = function(token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype._renderPartial = function(token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype._unescapedValue = function(token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype._escapedValue = function(token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype._rawValue = function(token) {
    return token[1];
  };

  mustache.name = "mustache.js";
  mustache.version = "1.1.0";
  mustache.tags = [ "{{", "}}" ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

},{}]},{},[40])
(40)
});
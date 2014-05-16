# fs-check

# Opportunity Schema
````javascript
{
  title: '',
  description: 'may contain html',
  person: {},
  findarecord: {},
  gensearch: {}
}
````

**To consider**

* Consider adding `source` to identify chich check it came from. Probably should match the key in index.js
* Consider adding `type` to be able to group opportunities.
* Consider adding `difficulty`.

### Types

* `problem`
* `cleanup`
* `source`
* `personal`
* `family`

# Opportunities

## Person

### missingBirthFormalDate
`cleanup` - This opportunity will appear when there is a Birth fact for a person with an original date but no formal date.

### missingBirthNormalizedPlace
`cleanup` - This opportunity will appear when there is a Birth fact for a person with an original place but no normalized place.

### missingDeathFormalDate
`cleanup` - This opportunity will appear when there is a Death fact for a person with an original date but no formal date.

### missingDeathNormalizedPlace
`cleanup` - This opportunity will appear when there is a Death fact for a person with an original place but no normalized place.

## PersonSource

### missingBirthSource
`source` - This opportunity will appear when there is a Birth fact for a person with a place and date, and there is no sources attached to the person that are tagged "Birth".

### missingDeathSource
`source` - This opportunity will appear when there is a Death fact for a person with a place and date, and there is no sources attached to the person that are tagged "Death".
# Mockin
A pseudo-relational frontend database for autonomous global communication  
**powered by immutablejs*

[![build status](https://travis-ci.org/l2silver/mockin.svg?style=flat-square)](https://travis-ci.org/l2silver/mockin)
### Example
```
const relationalDatabase = Map({
    users: Map({
        1: Map({
            id: 1,
            name: 'Joe'
            friendsTWR: [1]
        })
    })
    friends: Map({
        1: Map({
            id: 1,
            name: 'Tim'
        })
    })
})
````
Get a user instance
````
const user = relationalDatabase.getIn(['users', '1'])
````
Retrieve relational data
````
import {gex} from 'mockin'
const friends = gex(relationalDatabase, 'friends', user)
````
### When is this useful?
When multiple objects share information.  
### How to
Generate Database
````
import {wrapMapState} from 'mockin'

const user = {
            id: 1,
            name: 'Joe'
            friends: [{
                id: 1,
                name: 'Tim'
            }]
        }

const frontendRelationalDatabase = wrapMapState(user, ['users', '1'], Map())
````
Modify Database
````
import {wrapMapState} from 'mockin'

const users = [{
            id: 1,
            name: 'Joe'
            friends: [{
                id: 1,
                name: 'Jim'
            }]
        }]

const newFrontendRelationalDatabase = 
wrapMapState(user, ['users'], frontendRelationalDatabase)
````
### How it works
Mockin is powered by objects and arrays of objects that have ids. As mockin processes a regular object, it looks for the id attribute in child objects to know whether or not it should be moved to its own property (akin to tables in databases). If it finds an object with an id inside another object, as with the 'friend' example above, it creates a new property in the original object (the child object name with a TWR suffix) that is an array of ids. It then moves the child object into its own property. The gex function can then be used to recall the relations of an instance, and will by default filter out objects with a non-false deleted_at attribute.
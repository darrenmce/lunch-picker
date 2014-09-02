#Lunch Picker

#### Current Version - 0.0.5

####A simple node library to help picking what to have for lunch

It's basically weighted random trials, except with a shifting 'luck' aspect that helps create a more even distribution.

###Usage

install with npm

```
npm install lunch-picker
```

include with

```
var lp = require('lunch-picker');
```

example:

```
var lp = require('lunch-picker');
lp.addItem('burger', 2)
lp.addItem('burrito', 3);
lp.addItem('salad',1);

var winner = lp.trial();

/* winner contents:
    { name: 'burrito',
      weight: 3,
      chosen: 1,
      trials: 1,
      luckFactor: 0.75,
      id: 'c843056c-26ca-49ce-873e-ad28387b728f' }
*/
```

###api

####setType(type)
This sets the type of picker to be used, default is 'lunch'.

```
lp.setType('drinks');
//now in drinks mode
lp.addItem('vodka', 4);
lp.trial(); // will return a drink (vodka if no others are added)
```


####init([items])

Used to initialize the items with an array. This will append to the db.

```
var items = [
    {
      name: 'burgers',
      weight: 1,
      chosen: 0,
      trials: 0,
      luckFactor: 1
    },
    {
      name: 'lasagna',
      weight: 1,
      chosen: 0,
      trials: 0,
      luckFactor: 1
    }
];
lp.init(items);
```

####addItem(name, weight)

Add an item to the current picker. Returns the full item.

```
lp.addItem('burritos', 3); //probability weight relative to others
lp.addItem('salad', 1); //low weight on salad, because we like winning friends
```

####trial()

Execute a trial and return the selected item.

```
var winner = lp.trial();
/* winner contents:
  { name: 'burrito',
    weight: 3,
    chosen: 1,
    trials: 1,
    luckFactor: 0.875,
    id: '492bd5fe-44b3-485d-8de2-d736a013dc4d' }
  */
```
  
As we can see, the meta data has adjusted based on this trial.

####dump()

Dumps the contents of the current type

```
var dump = lp.dump();
/* dump contents:
[ { name: 'burrito',
    weight: 3,
    chosen: 1,
    trials: 1,
    luckFactor: 0.875,
    id: '492bd5fe-44b3-485d-8de2-d736a013dc4d' },
  { name: 'salad',
    weight: 1,
    chosen: 0,
    trials: 1,
    luckFactor: 1.125,
    id: 'cd516220-1d45-45a0-976a-2437865ed820' } ]
*/
```



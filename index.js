var lp = require('./lib/lp.js');

//lp.add('testOpt1', 5);
//lp.add('testOpt2', 2);
//lp.add('testOpt3', 4);
//lp.add('testOpt4', 1);

lp.addItem('burger', 2)
lp.addItem('burrito', 3);
lp.addItem('salad',1);

var winner = lp.trial();

console.log(winner);
var fs = require('fs');
var low = require('lowdb');
var _ = require('lodash');
var prettyjson = require('prettyjson');

if (fs.existsSync(low.path)) {
  low.load();
}


var type = 'lunch';

var luckMovementFactor = 0.5;

var _defaultItem = {
  name: '',
  weight: 1,
  chosen: 0,
  trials: 0,
  luckFactor: 1
};

/* change the picker type */
var _setType = function (newType) {
  type = newType;
};

/* function to initialize the DB with an array */
var _init = function (values) {
  //requires 'this', so must bind itself
  var lowColl = low(type);
  values.forEach(lowColl.insert.bind(lowColl));
};

var _addItem = function (name, weight) {
  return low(type).insert(_createItem(name, weight));
};

var _trial = function () {

  var chanceArray = _chanceCalc();

  var win = _.random(0, 1, true);

  var winner = null;
  /* breaking loop */
  chanceArray.some(function (item) {
    var winFlag = item[1] >= win;
    winner = winFlag ? item[0] : winner;
    return winFlag;
  });

  //expand winner to the full object
  winner = low(type).find({id: winner});

  _incrTrials(); //requires save
  _updateLuck(winner.id); //requires save
  _updateWinner(winner.id); //will save;

  return winner;
};

var _dump = function () {
  return low(type).value();
};

var _updateWinner = function(winnerId) {
  var newChosen = low(type).where({id: winnerId}).value()[0].chosen + 1;
  low(type).update(winnerId, {chosen: newChosen});
}

var _updateLuck = function (winnerId) {
  //used in luck calc, static to each item
  var totalWeight = low(type).reduce(function (sum, next) {
    return sum + next.weight;
  }, 0);

  low(type).forEach(function (item) {
    item.luckFactor = _luckCalc(totalWeight, item, item.id === winnerId);
  });
};

/* adjust the luckFactor of the item */
var _luckCalc = function (totalWeight, item, won) {

  var chance = item.weight / totalWeight;

  var adjustment = won ? (chance - 1) : chance;

  return item.luckFactor + (adjustment * luckMovementFactor);
};

/* returns a chanceArray for the current status of the options */
var _chanceCalc = function () {
  var weightedLuckArray = low(type).map(function (item) {
    return [item.id, item.weight * item.luckFactor];
  });

  var totalWeightedLuck = weightedLuckArray.reduce(function (sum, next) {
    return sum + next[1];
  }, 0);

  var sectionIndex = 0;
  return weightedLuckArray.map(function (item) {
    sectionIndex += item[1] / totalWeightedLuck;
    return [item[0], sectionIndex]
  });

};

var _incrTrials = function (num) {
  var incr = typeof num === 'number' ? num : 1;

  low(type).forEach(_increment(incr));
};

var _createItem = function (name, weight) {
  return _.assign(_.clone(_defaultItem), {name: name, weight: weight || _defaultItem.weight});
};

var _increment = _.curry(function (incr, item) {
  item.trials += incr;
});

module.exports = {
  init: _init,
  setType: _setType,
  addItem: _addItem,
  trial: _trial,
  dump: _dump
};
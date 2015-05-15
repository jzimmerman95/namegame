'use strict';

/**
 * Expose / conglomorate everything related to Flux here.
 * This also allows us to more cleanly use the FluxMixin without
 * needing to pass it React every time we use it.
 */

var React = require('react');
var { Flux, FluxMixin, StoreWatchMixin } = require('tuxxor');
var Tuxxor = require('tuxxor');
var reqwest = require('reqwest');
var _ = require("ramda");

var constants = {
	WRONG_ANSWER : "WRONG_ANSWER",
	RIGHT_ANSWER : "RIGHT_ANSWER",
	LOAD_PEOPLE_SUCCESS: "LOAD_PEOPLE_SUCCESS"
};

var PeopleStore = Tuxxor.createStore({
  initialize: function() {
  	this.selected = {}; 
  	this.pool = [];
  	this.people = [];

    this.bindActions(
      constants.WRONG_ANSWER, this.onWrongAnswer,
      constants.RIGHT_ANSWER, this.onRightAnswer,
      constants.LOAD_PEOPLE_SUCCESS, this.onLoadPeopleSuccess
    );
  },

  onLoadPeopleSuccess: function (people) {
  	this.people = people;
	function shuffle(array) {
		for(var i=array.length-1; i >= 0; i--) {
			var j = Math.floor(Math.random() * i);
			var x = array[i];
			array[i] = array[j];
			array[j] = x;
		}	
		return array;
	}
	shuffle(people);

	this.pool = [];
	for(var i=0; i<5; i++) {
		this.pool.push(people[i]);
	} 
	this.selected = this.pool[0];
	shuffle(this.pool);
	this.emit("change");
  },

  onWrongAnswer: function(payload) {
  	this.emit("change");
  },

  onRightAnswer: function(people) {
  	setTimeout(function() {
  		this.pool = [];
  		this.emit("change");
		this.onLoadPeopleSuccess(this.people);
	}.bind(this), 2000);
  	this.emit("change");
  },

  getState: function() {
  	return _.clone({
  		selected: this.selected,
  		pool: this.pool,
  		people: this.people
  	});
  }
});

var actions = {
	wrongAnswer: function(answer) {
		this.dispatch(constants.WRONG_ANSWER, {answer: answer});
	},

	rightAnswer: function(answer) {
		this.dispatch(constants.RIGHT_ANSWER, {answer: answer});
	},

	loadPeopleFromServer: function (url) {
		reqwest({
			url: url,
			success: function (response) {
				this.dispatch(constants.LOAD_PEOPLE_SUCCESS, response);
			}.bind(this),
			error: function (err) {
				// TODO: Hook this up maybe??
			}
		});
	}
};

var stores = {
	PeopleStore: new PeopleStore()
};

module.exports = {
    flux: new Flux(stores, actions),
    FluxMixin: FluxMixin(React),
    StoreWatchMixin: StoreWatchMixin
};











'use strict';

var React = require('react');
var Tuxxor = require('tuxxor');
var reqwest = require('reqwest');
var { flux } = require('flux');

var FluxMixin = Tuxxor.FluxMixin(React),
	StoreWatchMixin = Tuxxor.StoreWatchMixin;

var SelectedPerson = React.createClass({
	render: function() {
		return (
			<h1 className="selectedTitle">Who is { this.props.selected.name }?</h1>
		);
	}
});

var PeopleArray = React.createClass({
	mixins: [ FluxMixin ],

	guess: function (name) {
		if(this.props.selected.name == name) {
			this.props.onCorrectGuess();
		}
	},

 	render: function() {
		return (
			<div className="PeopleArray">
				<ul className="peopleList">{this.props.pool.map(function(person, i) {
					var className = false;
					if(person.name == this.props.selected.name) {
						className = this.props.correct;
					}
          		  return <li key={i} className={className} onClick={this.guess.bind(this, (person.name))}>
          		  <img src={person.url} className="personPic"/><span className="personName">{person.name}</span></li>;
          }.bind(this))}</ul>
			</div>
		);
	}
});

var GameBoard = React.createClass({

	mixins: [ StoreWatchMixin("PeopleStore"), FluxMixin ],

	onCorrectGuess: function() {
		this.setState({correct: true});
		setTimeout(function() {
			this.loadPeopleFromServer();
			this.setState({correct: false})
		}.bind(this), 2000);
	},

	// pull in store watch mixin 
	loadPeopleFromServer: function() {
		flux.actions.loadPeopleFromServer(this.props.url);
	},

	getInitialState: function () {
		return { 
			people: [],
			correct: false
		};
	}, 

	componentDidMount: function() {
		this.loadPeopleFromServer();
	},

	getStateFromFlux: function () {
		var pool = this.getFlux().store("PeopleStore").getState().pool;
		var selected = this.getFlux().store("PeopleStore").getState().selected;

		return { 
			pool: pool,
			selected: selected
		};
	},

	render: function () {
		return (
			<div className="GameBoard">
				<SelectedPerson selected={this.state.selected} />
				<PeopleArray pool={this.state.pool} selected={this.state.selected} onCorrectGuess={this.onCorrectGuess} correct={this.state.correct} />
			</div>
		);
	}
});

module.exports = GameBoard;




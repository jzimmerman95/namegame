'use strict';

var React = require('react');
var Tuxxor = require('tuxxor');
var reqwest = require('reqwest');
var { flux } = require('flux');

var FluxMixin = Tuxxor.FluxMixin(React),
	StoreWatchMixin = Tuxxor.StoreWatchMixin;


var Question = React.createClass({
	render: function() {
		return (
			<h1 className="questionWrapper">Who is { this.props.selected.name }?</h1>
		);
	}
});

var Person = React.createClass({
	mixins: [ StoreWatchMixin("PeopleStore"), FluxMixin ],

	guess: function (name) {
		this.setState({click: true});
		if(this.props.selected.name == name) {
			this.rightAnswer();
		} else {
			this.wrongAnswer();
		};
	},

	rightAnswer: function() {
		flux.actions.rightAnswer(this.props.answer);
	},

	wrongAnswer: function()	{
		flux.actions.wrongAnswer(this.props.answer);
	},

	getInitialState: function () {
		return {
			click: false
		};
	}, 

	getStateFromFlux: function () {
		return {
			answer: this.getFlux().store("PeopleStore").getState().answer
		};
	},

	render: function() {
		var className;
		if (this.state.click) {
			className = "click";
		}
		if(this.props.employee.name == this.props.selected.name) {
			className += " right";
		} else {
			className += " wrong";
		}
		return(
  			<li className={className} onClick={this.guess.bind(this, (this.props.employee.name))}>
  		  		<img src={this.props.employee.url} className="personPic"/>
  		  		<span className="personName">{this.props.employee.name}</span>
  		  	</li>
		)
	}
})

var PeopleWrapper = React.createClass({
 	render: function() {
		return (
			<div className="PeopleWrapper">
				<ul className="peopleList">{this.props.pool.map(function(employee, i) {
					return(
					<Person key={i} pool={this.props.pool} selected={this.props.selected} employee={employee} />
					)
				}.bind(this))}</ul>
			</div>
		);
	}
});

var GameBoard = React.createClass({
	mixins: [ StoreWatchMixin("PeopleStore"), FluxMixin ],

	loadPeopleFromServer: function() {
		flux.actions.loadPeopleFromServer(this.props.url);
	},

	getInitialState: function () {
		return { 
			people: []
		};
	}, 

	componentDidMount: function() {
		this.loadPeopleFromServer();
	},

	getStateFromFlux: function () {
		return { 
			pool: this.getFlux().store("PeopleStore").getState().pool,
			selected: this.getFlux().store("PeopleStore").getState().selected
		};
	},

	render: function () {
		return (
			<div className="GameBoard">
				<Question selected={this.state.selected} />
				<PeopleWrapper pool={this.state.pool} selected={this.state.selected} />
			</div>
		);
	}
});

module.exports = GameBoard;




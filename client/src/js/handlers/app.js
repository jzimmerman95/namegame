'use strict';

var React = require('react');
var { flux } = require('flux');
var { FluxMixin, StoreWatchMixin } = require('flux');
var GameBoard = require('components/gameboard');


var App = React.createClass({

    mixins: [FluxMixin],

    render: function() {
        return <div className="app-container">
			<GameBoard url="http://api.namegame.willowtreemobile.com/" />
        </div>;
    }
});

module.exports = App;

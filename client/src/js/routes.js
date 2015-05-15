'use strict';

var { Route,Link, DefaultRoute } = require('react-router');

var App = require('handlers/app');

var routes = (
    <DefaultRoute name="app" path="/" handler={App} />
);

module.exports = routes;

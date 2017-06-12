const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js"),
        MyRouter = require("./router.js"),
        Models = require("./models.js"),
		logger = require("./logger.js"),
		ApplicationMediator = require("./applicationMediator.js"),
		HeaderDecoratorView = require("./headerDecoratorView.js");

// create an application and router
var app = new Augmented.Presentation.Application(CONSTANTS.APP_NAME);

var breadcrumb = "";

app.afterInitialize = function() {
	const 	mediatorView = new ApplicationMediator(),
			headerView = new HeaderDecoratorView();

	// observe colleagues
	logger.info("Observing Main Views...");
	mediatorView.observeColleagueAndTrigger(
	    headerView, // colleague view
	    CONSTANTS.NAMES_AND_QUEUES.HEADER,   // channel
	    CONSTANTS.NAMES_AND_QUEUES.HEADER    // identifier
	);
};

// functions
module.exports.getDatastore = function() {
    return app.getDatastore();
};

module.exports.getDatastoreItem = function(key) {
    var ds = app.getDatastore();
    return ds.get(key);
};

module.exports.setDatastore = function(data) {
	var ds = app.getDatastore();
	ds.set(data);
	app.setDatastore(ds);
};

module.exports.setDatastoreItem = function(key, item) {
    var ds = app.getDatastore();
    ds.set(key, item);
    app.setDatastore(ds);
};

module.exports.clearDatastoreItem = function(key) {
    var ds = app.getDatastore();
    ds.unset(key);
    app.setDatastore(ds);
};

module.exports.start = function() {
	document.title = CONSTANTS.TITLE;
	app.router = new MyRouter();

	app.registerStylesheet("https://fonts.googleapis.com/icon?family=Material+Icons");
	app.registerStylesheet("https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,300,400italic,100,700");
	// adding style packs
	app.registerStylesheet("node_modules/augmentedjs/styles/table/material.css");
	app.registerStylesheet("node_modules/augmentedjs/styles/table/spaceGray.css");
	app.registerStylesheet("node_modules/augmentedjs/styles/table/plain.css");

	app.createDatastore(Models.ProjectModel);
    logger.info("Starting Application...");
    app.start();
};

module.exports.navigate = function(route) {
	app.router.navigate(route, {trigger: true});
};

module.exports.clearCurrentView = function() {
	var ds = app.getDatastore();
    ds.unset("currentView");
    app.setDatastore(ds);
};

module.exports.setCurrentView = function(view) {
	var ds = app.getDatastore();
    ds.set("currentView", view);
    app.setDatastore(ds);
};

module.exports.getCurrentView = function() {
	var ds = app.getDatastore();
    return ds.get("currentView");
};

module.exports.getViews = function() {
	var ds = app.getDatastore();
	return ds.get("views");
};

module.exports.setCurrentBreadcrumb = function(item) {
	breadcrumb = item;
};

module.exports.getCurrentBreadcrumb = function() {
	return breadcrumb;
};

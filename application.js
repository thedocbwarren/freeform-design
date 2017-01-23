const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js"),
        MyRouter = require("./router.js"),
        Models = require("./models.js");

// create an application and router
var app = new Augmented.Presentation.Application(CONSTANTS.APP_NAME);
document.title = CONSTANTS.TITLE;
app.router = new MyRouter();

app.registerStylesheet("https://fonts.googleapis.com/icon?family=Material+Icons");
app.registerStylesheet("https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,300,400italic,100,700");
// adding style packs
app.registerStylesheet("styles/table/material.css");
app.registerStylesheet("styles/table/spaceGray.css");
//app.registerStylesheet("styles/table/plain.css");  Empty at the moment

app.createDatastore(Models.ProjectModel);

// functions
const getDatastore = function() {
    return app.getDatastore();
};

const getDatastoreItem = function(key) {
    var ds = app.getDatastore();
    return ds.get(key);
};

const setDatastore = function(data) {
	var ds = app.getDatastore();
	ds.set(data);
	app.setDatastore(ds);
};

const setDatastoreItem = function(key, item) {
    var ds = app.getDatastore();
    ds.set(key, item);
    app.setDatastore(ds);
};

const start = function() {
    // build the deck and datastore
    app.start();
};

const navigate = function(route) {
	app.router.navigate(route, {trigger: true});
};

const clearCurrentView = function() {
	var ds = app.getDatastore();
    ds.unset("currentView");
    app.setDatastore(ds);
};

const setCurrentView = function(view) {
	var ds = app.getDatastore();
    ds.set("currentView", view);
    app.setDatastore(ds);
};

const getCurrentView = function() {
	var ds = app.getDatastore();
    return ds.get("currentView");
};

const getViews = function() {
	var ds = app.getDatastore();
	return ds.get("views");
};

// API
module.exports = {
	"start": start,
	"setDatastoreItem": setDatastoreItem,
	"getDatastoreItem": getDatastoreItem,
	"getDatastore": getDatastore,
	"setDatastore": setDatastore,
	"navigate": navigate,
	"clearCurrentView": clearCurrentView,
	"getCurrentView": getCurrentView,
	"setCurrentView": setCurrentView,
	"getViews": getViews
};

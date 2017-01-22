const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("constants.js"),
        MyRouter = require("router.js"),
        Models = require("models.js");

// create an application
var app = new Augmented.Presentation.Application(CONSTANTS.APP_NAME);
document.title = CONSTANTS.TITLE;

app.registerStylesheet("https://fonts.googleapis.com/icon?family=Material+Icons");
app.registerStylesheet("https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,300,400italic,100,700");
// adding style packs
app.registerStylesheet("styles/table/material.css");
app.registerStylesheet("styles/table/spaceGray.css");
//app.registerStylesheet("styles/table/plain.css");  Empty at the moment

app.router = new MyRouter();
app.datastore = new Models.ProjectModel();

module.exports = app;

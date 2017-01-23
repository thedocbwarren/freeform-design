const Augmented = require("augmentedjs");

const MainProject = require("./mainProject.js"),
	  TableCreate = require("./tableCreate.js"),
	  AutoForm = require("./autoForm.js"),
	  StandardViewEditor = require("./standardViewEditor.js"),
	  DialogEditor = require("./dialogEditor.js"),
	  MediatorEditor = require("./mediatorEditor.js"),
	  SchemaEditor = require("./schemaEditor.js"),
      IntroView = require("./introView.js");

module.exports = Augmented.Router.extend({
    routes: {
        "":              CONSTANTS.NAVIGATION.INDEX,    // index
        "project":       CONSTANTS.NAVIGATION.PROJECT,  // #project
        "table":         CONSTANTS.NAVIGATION.TABLE,    // #table
        "form":          CONSTANTS.NAVIGATION.FORM,     // #form
        "view":          CONSTANTS.NAVIGATION.VIEW,     // #view
        "dialog":        CONSTANTS.NAVIGATION.DIALOG,   // #dialog
        "mediator":      CONSTANTS.NAVIGATION.MEDIATOR, // #mediator
		"schema":		 CONSTANTS.NAVIGATION.SCHEMA    // #schema
    },

    index: function() {
        this.loadView(new IntroView());
    },
    project: function()  {
        this.loadView(new MainProject().initialize());
    },
    table: function() {
        this.loadView(new TableCreate().initialize());
    },
    form: function() {
        this.loadView(new AutoForm().initialize());
    },
    view: function() {
        this.loadView(new StandardViewEditor().initialize());
    },
    dialog: function() {
        this.loadView(new DialogEditor().initialize());
    },
    mediator: function() {
        this.loadView(new MediatorEditor().initialize());
    },
	schema: function() {
		this.loadView(new SchemaEditor().initialize());
	}
});

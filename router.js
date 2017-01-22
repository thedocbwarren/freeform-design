const Augmented = require("augmentedjs");

const MainProject = require("mainProject.js"),
	  TableCreate = require("tableCreate.js"),
	  AutoForm = require("autoForm.js"),
	  StandardViewEditor = require("standardViewEditor.js"),
	  DialogEditor = require("dialogEditor.js"),
	  MediatorEditor = require("mediatorEditor.js"),
	  SchemaEditor = require("schemaEditor.js"),
      IntroView = require("introView.js");

module.exports = Augmented.Router.extend({
    routes: {
        "":                     			CONSTANTS.NAVIGATION.INDEX,    // index
        CONSTANTS.NAVIGATION.PROJECT:       CONSTANTS.NAVIGATION.PROJECT,  // #project
        CONSTANTS.NAVIGATION.TABLE:         CONSTANTS.NAVIGATION.TABLE,    // #table
        CONSTANTS.NAVIGATION.FORM:          CONSTANTS.NAVIGATION.FORM,     // #form
        CONSTANTS.NAVIGATION.VIEW:          CONSTANTS.NAVIGATION.VIEW,     // #view
        CONSTANTS.NAVIGATION.DIALOG:        CONSTANTS.NAVIGATION.DIALOG,   // #dialog
        CONSTANTS.NAVIGATION.MEDIATOR:      CONSTANTS.NAVIGATION.MEDIATOR, // #mediator
		CONSTANTS.NAVIGATION.SCHEMA:		CONSTANTS.NAVIGATION.SCHEMA    // #schema
    },

    index: function() {
        this.loadView(new IntroView());
    },
    project: function()  {
        this.loadView(MainProject.initialize());
    },
    table: function() {
        this.loadView(TableCreate.initialize());
    },
    form: function() {
        this.loadView(AutoForm.initialize());
    },
    view: function() {
        this.loadView(StandardViewEditor.initialize());
    },
    dialog: function() {
        this.loadView(DialogEditor.initialize());
    },
    mediator: function() {
        this.loadView(MediatorEditor.initialize());
    },
	schema: function() {
		this.loadView(SchemaEditor.initialize());
	}
});

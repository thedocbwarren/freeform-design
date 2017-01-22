"use strict";
/*
require.config({
	"baseUrl": "scripts/",

    "paths": {
        //base libraries
		"jquery": "../node_modules/jquery/dist/jquery",
		"underscore": "../node_modules/underscore/underscore",
		"backbone": "../node_modules/backbone/backbone",
        "handlebars": "../node_modules/handlebars/dist/handlebars.runtime.amd",

        // hosted version
		//"augmented": "/augmented/scripts/core/augmented",
        //"augmentedPresentation": "/augmented/scripts/presentation/augmentedPresentation",

        // local version
		"augmented": "../node_modules/augmentedjs/scripts/core/augmented",
        "augmentedPresentation": "../node_modules/augmentedjs/scripts/presentation/augmentedPresentation",

        // FileSave Polyfill
        "filesaver": "../node_modules/file-saver/FileSaver",
        // Zip library
        "jszip": "../node_modules/jszip/dist/jszip",

        // other modules
        "application": "app/application",
        "mainProject": "app/mainProject",
        "tableCreate": "app/tableCreate",
        "autoForm": "app/autoForm",
        "standardViewEditor": "app/standardViewEditor",
        "models": "app/models",
        "compiler": "app/compiler",
        "basicInfoView": "app/basicInfoView",
        "abstractEditorMediator": "app/abstractEditorMediator",
        "abstractEditorView": "app/abstractEditorView",
        "editDialog": "app/editDialog",
        "dialogEditor": "app/dialogEditor",
        "mediatorEditor": "app/mediatorEditor",
        "autoViewMediator": "app/autoViewMediator",
        "schemaDecoratorView": "app/schemaDecoratorView",
		"schemaEditor": "app/schemaEditor",

        //subviews
        "stylesheetsSubView": "app/stylesheetsSubView",
        "routesSubView": "app/routesSubView",
        "controllersSubView": "app/controllersSubView",
        "viewsSubView": "app/viewsSubView",
		"modelsSubView": "app/modelsSubView",
        "schemasSubView": "app/schemasSubView",
		"overviewSubView": "app/overviewSubView",

        // compiled templates
        "stylesheetsTemplate": "app/templates/stylesheetsTemplate",
        "routesTemplate": "app/templates/routesTemplate",
        "viewsTemplate": "app/templates/viewsTemplate",
        "permissionsTemplate": "app/templates/permissionsTemplate",
        "controllersTemplate": "app/templates/controllersTemplate",
        "observeViewsListTemplate": "app/templates/observeViewsListTemplate",
		"modelsTemplate": "app/templates/modelsTemplate",
        "schemasTemplate": "app/templates/schemasTemplate"
	},
    "shim": {
    }
});
*/

//  main app
const 	Augmented = require("augmentedjs");
	  	Augmented.Presentation = require("augmentedjs-presentation");
const 	logger = require("logger.js"),
	  	app = require("application.js"),
		ApplicationMediator = require("applicationMediator.js"),
		HeaderDecoratorView = require("headerDecoratorView.js");

logger.info("Beginning Application...");

logger.info("Starting Application...");
app.start();

const 	mediatorView = new ApplicationMediator(),
		headerView = new HeaderDecoratorView();

// observe colleagues

logger.info("Observing Main Views...");

mediatorView.observeColleagueAndTrigger(
    headerView, // colleague view
    CONSTANTS.NAMES_AND_QUEUES.HEADER,   // channel
    CONSTANTS.NAMES_AND_QUEUES.HEADER    // identifier
);

logger.info("Ready.");

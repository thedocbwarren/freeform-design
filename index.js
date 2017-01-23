"use strict";
//  main app
const 	Augmented = require("augmentedjs");
	  	Augmented.Presentation = require("augmentedjs-presentation");
const 	logger = require("./logger.js"),
	  	app = require("./application.js"),
		ApplicationMediator = require("./applicationMediator.js"),
		HeaderDecoratorView = require("./headerDecoratorView.js");

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

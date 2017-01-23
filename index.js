"use strict";
//  main app
const 	Augmented = require("augmentedjs");
	  	Augmented.Presentation = require("augmentedjs-presentation");
const 	logger = require("./logger.js"),
	  	app = require("./application.js");

logger.info("Beginning Application...");
app.start();
logger.info("Ready.");

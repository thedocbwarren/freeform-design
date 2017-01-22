const Augmented = require("augmentedjs");
	  Augmented.Presentation = require("augmentedjs-presentation");
const CONSTANTS = require("constants.js"),
        app = require("application.js"),
        filesaver = require("file-saver"),
        logger = require("logger.js");

module.exports = Augmented.Presentation.Mediator.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.MEDIATOR,
    el: CONSTANTS.MAIN_VIEW_MOUNT,
    init: function(options) {
        // hamburger events
        this.on(CONSTANTS.MESSAGES.CREATE_PROJECT, function(name) {
            logger.info("Created new project - " + name);
            app.datastore.set("project", name);
            app.router.navigate(CONSTANTS.NAVIGATION.PROJECT, {trigger: true});
            this.publish(CONSTANTS.NAMES_AND_QUEUES.HEADER, CONSTANTS.MESSAGES.NOTIFICATION, "Project " + name + " Created.");
        });
        this.on(CONSTANTS.MESSAGES.OPEN_PROJECT, function(file) {
            logger.info("Opening a project - " + file);

            var reader = new FileReader(), that = this;

            reader.onload = function(e) {
                var text = reader.result, data;
                try {
                    data = JSON.parse(text);
                    app.datastore.set(data);
                    app.router.navigate(CONSTANTS.NAVIGATION.PROJECT, {trigger: true});
                    that.publish(CONSTANTS.NAMES_AND_QUEUES.HEADER, CONSTANTS.MESSAGES.NOTIFICATION, "Project Loaded.");
                } catch(ex) {
                    alert("Failed to read file! " + ex);
                    logger.info("Failed to read file! " + ex);
                    that.publish(CONSTANTS.NAMES_AND_QUEUES.HEADER, CONSTANTS.MESSAGES.ERROR, "Project Load Failed!");
                }
            };

            reader.readAsText(file);
        });
        this.on(CONSTANTS.MESSAGES.SAVE_PROJECT, function(file) {
            logger.info("Saving a project - " + file);
            var blob = new Blob([JSON.stringify(app.datastore.toJSON())], {type: "text/plain;charset=utf-8"});
			if (!file.endsWith(".json")) {
				file = file + ".json";
			}

            saveAs(blob, file);
            this.publish(CONSTANTS.NAMES_AND_QUEUES.HEADER, CONSTANTS.MESSAGES.NOTIFICATION, "Save Project Complete.");
        });
        this.on(CONSTANTS.MESSAGES.COMPILE_PROJECT, function() {
            logger.info("Compiling a project");
            Compiler.compile(app.datastore.toJSON());
            this.publish(CONSTANTS.NAMES_AND_QUEUES.HEADER, CONSTANTS.MESSAGES.NOTIFICATION, "Compile Complete!");
        });
        // end hamburger events
    }
});

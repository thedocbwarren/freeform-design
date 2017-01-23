const   Augmented = require("augmentedjs");
        Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js"),
        app = require("./application.js");

module.exports = Augmented.Presentation.Mediator.extend({
    //name
    el: CONSTANTS.VIEW_MOUNT.ACTIVE_PANEL,
    init: function() {
        this.on(CONSTANTS.MESSAGES.COMPILE,
            function(data) {
                if (data) {
                    this.publish(CONSTANTS.NAMES_AND_QUEUES.VIEWER, CONSTANTS.MESSAGES.COMPILE, data);
                    this.publish(CONSTANTS.NAMES_AND_QUEUES.SOURCE, CONSTANTS.MESSAGES.COMPILE, data);
                }
            }
        );
        this.on(CONSTANTS.MESSAGES.YOUR_DATA_REQUEST, function(data) {
            this.publish(CONSTANTS.NAMES_AND_QUEUES.SOURCE, CONSTANTS.MESSAGES.UPDATE_YOUR_DATA, data);
        });
        this.on(CONSTANTS.MESSAGES.UPDATE_SCHEMA, function(schema) {
            this.currentView.model.schema = schema;
            this.saveData();
        });
        this.on(CONSTANTS.MESSAGES.UPDATE_SETTINGS, function(settings) {
            this.currentView.model.settings = settings;
            this.saveData();
        });
        this.on(CONSTANTS.MESSAGES.GO_TO_PROJECT, function() {
            this.goToProject();
        });
    },
    saveData: function() {
        app.setCurrentView(this.currentView);
        var views = app.getViews();
        if (views) {
            views[this.currentView.index] = this.currentView.model;
        }
    },
    remove: function() {
        /* off to unbind the events */
        this.off(this.el);
        this.stopListening();
        Augmented.Presentation.Dom.empty(this.el);
        return this;
    },
    // Startup methods
    updateSchema: function(schema) {
        if (schema) {
            this.publish(CONSTANTS.NAMES_AND_QUEUES.SCHEMA, CONSTANTS.MESSAGES.UPDATE_SCHEMA, Augmented.Utility.PrettyPrint(schema));
        }
    },
    updateSettings: function(settings) {
        if (settings) {
            this.publish(CONSTANTS.NAMES_AND_QUEUES.VIEWER, CONSTANTS.MESSAGES.UPDATE_SETTINGS, settings);
        }
    },
    goToProject: function() {
        this.currentView = null;
        app.clearCurrentView();
        app.navigate(CONSTANTS.NAVIGATION.PROJECT);
    }
});

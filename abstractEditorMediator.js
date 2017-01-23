const Augmented = require("augmentedjs");
	  Augmented.Presentation = require("augmentedjs-presentation");
const CONSTANTS = require("./constants.js"),
        app = require("./application.js");

module.exports = Augmented.Presentation.Mediator.extend({
    el: CONSTANTS.VIEW_MOUNT.ACTIVE_PANEL,
    remove: function() {
        /* off to unbind the events */
        this.off(this.el);
        this.stopListening();
        Augmented.Presentation.Dom.empty(this.el);
        return this;
    },
    goToProject: function() {
        this.currentView = null;
		app.clearCurrentView();
		app.navigate(CONSTANTS.NAVIGATION.PROJECT);
    },
    saveData: function() {
		app.setCurrentView(this.currentView);
        var views = app.getViews();
        if (views) {
            views[this.currentView.index] = this.currentView.model;
        }
    }
});

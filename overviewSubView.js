const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js");

//OverviewView
module.exports = Augmented.Presentation.DecoratorView.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.OVERVIEW,
    el: CONSTANTS.VIEW_MOUNT.OVERVIEW,
    init: function() {
    },
    render: function() {
        var e = this.boundElement("overviewDetail");
        this.removeTemplate(e, true);
        //this.injectTemplate("", e);
    }
});

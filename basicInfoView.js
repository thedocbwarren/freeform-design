const   Augmented = require("augmentedjs");
        Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js");

module.exports = Augmented.Presentation.DecoratorView.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.BASIC,
    el: CONSTANTS.VIEW_MOUNT.BASIC,
    init: function() {
        this.syncModelChange("name");
        this.on(CONSTANTS.MESSAGES.UPDATE_NAME, function(data) {
            this.setName(data);
        });
    },
    setName: function(name) {
        this.model.set("name", name);
    },
    back: function() {
        this.sendMessage(CONSTANTS.MESSAGES.GO_TO_PROJECT);
    }
});

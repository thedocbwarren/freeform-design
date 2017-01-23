const   Augmented = require("augmentedjs");
        Augmented.Presentation = require("augmentedjs-presentation"),
        CONSTANTS = require("./constants.js");

module.exports = Augmented.Presentation.DialogView.extend({
    style: "form",
    el: CONSTANTS.VIEW_MOUNT.EDIT_DIALOG,
    buttons: {
        "cancel": "cancel",
        "ok" : "ok",
        "delete": "del"
    },
    ok: function() {
        this.trigger(CONSTANTS.MESSAGES.SAVE);
        this.close();
    },
    del: function() {
        this.trigger(CONSTANTS.MESSAGES.DELETE);
        this.close();
    }
});

const Augmented = require("augmentedjs");
	  Augmented.Presentation = require("augmentedjs-presentation");
const CONSTANTS = require("./constants.js");

module.exports = Augmented.View.extend({
    el: CONSTANTS.VIEW_MOUNT.MAIN,
    render: function() {
        var h1 = document.createElement("h1"),
        t = document.createTextNode("Hello."),
        el = Augmented.Presentation.Dom.selector(this.el);
        h1.appendChild(t);
        el.appendChild(h1);
    },
    remove: function() {
        /* off to unbind the events */
        this.off(this.el);
        this.stopListening();
        Augmented.Presentation.Dom.empty(this.el);
        return this;
    }
});

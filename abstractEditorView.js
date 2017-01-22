const Augmented = require("augmentedjs");
	  Augmented.Presentation = require("augmentedjs-presentation");

module.exports = Augmented.Presentation.DecoratorView.extend({
    closeDialog: function() {
    },
    editCurrent: function(event) {
        var index = (event.currentTarget.getAttribute("data-index"));
        var model = this.collection.at(index);
        this.openDialog(model, index);
    },
    addNew: function() {
        this.openDialog(null, -1);
    },
    deleteCurrent: function() {
        var index = this.dialog.model.get("index");
        var model = this.collection.at(index);
        this.collection.remove(model);
        this.render();
    },
    remove: function() {
        if (this.dialog) {
            this.dialog.remove();
        }
        /* off to unbind the events */
        this.off();
        this.stopListening();
        return this;
    }
});

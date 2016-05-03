define('editDialog', ['augmented', 'augmentedPresentation'], function(Augmented, Presentation) {
    "use strict";
    var EditDialog = Augmented.Presentation.DialogView.extend({
        style: "form",
        el: "#editDialog",
        buttons: {
            "cancel": "cancel",
            "ok" : "ok",
            "delete": "del"
        },
        ok: function() {
            this.trigger("save");
            this.close();
        },
        del: function() {
            this.trigger("delete");
            this.close();
        }
    });
    return EditDialog;
});

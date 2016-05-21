define("abstractEditorMediator", ["augmented", "augmentedPresentation", "application"],
    function(Augmented, Presentation, app) {
    "use strict";
    var AbstractEditorMediator = Augmented.Presentation.Mediator.extend({
        el: "#activePanel",
        remove: function() {
            /* off to unbind the events */
            this.off(this.el);
            this.stopListening();
            Augmented.Presentation.Dom.empty(this.el);
            return this;
        },
        goToProject: function() {
            this.currentView = null;
            app.datastore.unset("currentView");
            app.router.navigate("project", {trigger: true});
        },
        saveData: function() {
            app.datastore.set("currentView", this.currentView);
            var views = app.datastore.get("views");
            if (views) {
                views[this.currentView.index] = this.currentView.model;
            }
        }
    });
    return AbstractEditorMediator;
});

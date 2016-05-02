define(['augmented', 'augmentedPresentation', 'application', 'basicInfoView'], function(Augmented, Presentation, app, BasicInfoView) {
    "use strict";

    var StandardViewEditorMediator = Augmented.Presentation.Mediator.extend({
        name:"standardViewEditorMediator",
        el: "#activePanel",
        init: function() {
            this.on("goToProject", function() {
                this.goToProject();
            });
        },
        render: function() {
            this.currentView = app.datastore.get("currentView");
            if (!this.currentView) {
                this.currentView = {
                    index: 0, "model": {
                    "name": "untitled",
                    "type": "View"
                }};
            }

            var t = document.querySelector('#standardViewEditorTemplate');
            // consider an inject template method simular to DecoratorView
            var clone = document.importNode(t.content, true);
            this.el.appendChild(clone);
        },
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
        }
    });


    var StandardViewEditorController = Augmented.Presentation.ViewController.extend({
        render: function() {
            this.mediator.render();

            this.basicView = new BasicInfoView();

            app.log("Listening to Child Views...");

            this.mediator.observeColleagueAndTrigger(
                this.basicView, // colleague view
                "basic",   // channel
                "basic"    // identifer
            );

            this.mediator.publish("basic", "updateName", this.mediator.currentView.model.name);
        },
        initialize: function() {
            app.log("Creating StandardViewEditorController ...");

            this.mediator = new StandardViewEditorMediator();

            app.log("ready.");

            return this;
        },
        remove: function() {
            this.basicView.remove();
            this.mediator.remove();
            this.basicView = null;
            this.mediator = null;
        }
    });

    return new StandardViewEditorController();
});

define('autoViewMediator', ['augmented', 'augmentedPresentation', 'application'],
function(Augmented, Presentation, app) {
    "use strict";

    var AutoViewMediator = Augmented.Presentation.Mediator.extend({
        //name
        el: "#activePanel",
        init: function() {
            this.on("compile",
                function(data) {
                    if (data) {
                        this.publish("viewer", "compile", data);
                        this.publish("source", "compile", data);
                    }
                }
            );
            this.on("yourDataRequest", function(data) {
                this.publish("source", "updateYourData", data);
            });
            this.on("updateSchema", function(schema) {
                this.currentView.model.schema = schema;
                this.saveData();
            });
            this.on("updateSettings", function(settings) {
                this.currentView.model.settings = settings;
                this.saveData();
            });
            this.on("goToProject", function() {
                this.goToProject();
            });
        },
        saveData: function() {
            app.datastore.set("currentView", this.currentView);
            var views = app.datastore.get("views");
            if (views) {
                views[this.currentView.index] = this.currentView.model;
            }
        },
        /*
        render: function() {
            this.currentView = app.datastore.get("currentView");
            if (!this.currentView) {
                this.currentView = { index: 0, "model": {
                    "name": "untitled",
                    "type": "AutomaticTable",
                    "permissions": {
                        "include": [],
                        "exclude": []
                    }
                }};
            }

            var t = document.querySelector('#tableCreateTemplate');
            // consider an inject temnplate method simular to DecoratorView
            var clone = document.importNode(t.content, true);
            this.el.appendChild(clone);
        },
        */
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
                this.publish("schema", "updateSchema", Augmented.Utility.PrettyPrint(schema));
            }
        },
        updateSettings: function(settings) {
            if (settings) {
                this.publish("viewer", "updateSettings", settings);
            }
        },
        goToProject: function() {
            this.currentView = null;
            app.datastore.unset("currentView");
            app.router.navigate("project", {trigger: true});
        }
    });
    return AutoViewMediator;
});

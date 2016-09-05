define(['augmented', 'augmentedPresentation', 'application', 'basicInfoView', "schemaDecoratorView", 'models', 'handlebars'],
function(Augmented, Presentation, app, BasicInfoView, SchemaDecoratorView, Models, Handlebars) {
    "use strict";

    var SchemaEditorMediator = Augmented.Presentation.Mediator.extend({
        el: "#activePanel",
        remove: function() {
            /* off to unbind the events */
            this.off(this.el);
            this.stopListening();
            Augmented.Presentation.Dom.empty(this.el);
            return this;
        },
        goToProject: function() {
            this.currentSchema = null;
            app.datastore.unset("currentSchema");
            app.router.navigate("project", {trigger: true});
        },
        saveData: function() {
            app.datastore.set("currentSchema", this.currentSchema);
            var schemas = app.datastore.get("schemas");
            if (schemas) {
                schemas[this.currentSchema.index] = this.currentSchema.model;
            }
        },
        updateSchema: function(schema) {
            if (schema) {
                app.log("updating schema: " + schema);
                this.publish("schema", "updateSchema", Augmented.Utility.PrettyPrint(schema));
            }
        },
        name:"SchemaEditorMediator",
        init: function() {
            this.on("goToProject", function() {
                this.goToProject();
            });
            this.on("updateData", function(data) {
                //this.publish("schema", "schemaData", data);
                this.currentSchema.model = data;
                this.saveData();
            });
            this.on("updateSchema", function(schema) {
                this.currentSchema.model.schema = schema;
                this.saveData();
            });
        },
        render: function() {
            this.currentSchema = app.datastore.get("currentSchema");
            if (!this.currentSchema) {
                this.currentSchema = {
                    index: 0,
                    "model": {
                        "name": "",
                        "url": "",
                        "schema": {}
                    }};
            }

            var t = document.querySelector('#schemaEditorTemplate');
            // consider an inject template method simular to DecoratorView
            var clone = document.importNode(t.content, true);
            this.el.appendChild(clone);
        }
    });

    var SchemaEditorView = SchemaDecoratorView.extend({
        setViewport: function() {
            this.el.style.height = (Augmented.Presentation.Dom.getViewportHeight() - 238) + "px";
        }
    });

    var SchemaEditorController = Augmented.Presentation.ViewController.extend({
        render: function() {
            this.mediator.render();
            var basicView = new BasicInfoView();
            this.manageView(basicView);
            var schemaView = new SchemaEditorView();
            schemaView.setViewport();
            this.manageView(schemaView);

            app.log("Listening to Child Views...");

            this.mediator.observeColleagueAndTrigger(
                basicView, // colleague view
                "basic",   // channel
                "basic"    // identifier
            );

            this.mediator.observeColleagueAndTrigger(
                schemaView, // colleague view
                "schema",   // channel
                "schema"    // identifier
            );

            this.mediator.publish("basic", "updateName", this.mediator.currentSchema.model.name);
            this.mediator.updateSchema(this.mediator.currentSchema.model.schema);

        },
        initialize: function() {
            app.log("Creating SchemaEditorController ...");
            this.mediator = new SchemaEditorMediator();
            app.log("ready.");
            return this;
        },
        remove: function() {
            this.removeAllViews();
            this.mediator.remove();
            this.mediator = null;
        }
    });

    return new SchemaEditorController();
});

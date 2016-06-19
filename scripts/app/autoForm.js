define(["augmented", "augmentedPresentation", "application", "basicInfoView", "autoViewMediator", "schemaDecoratorView"],
function(Augmented, Presentation, app, BasicInfoView, AutoViewMediator, SchemaDecoratorView) {
    "use strict";

    // define the classes
    var AutoFormMediator = AutoViewMediator.extend({
        name:"autoFormMediator",
        render: function() {
            this.currentView = app.datastore.get("currentView");
            if (!this.currentView) {
                this.currentView = { index: 0, "model": {
                    "name": "untitled",
                    "type": "AutomaticForm",
                    "permissions": {
                        "include": [],
                        "exclude": []
                    }
                }};
            }

            var t = document.querySelector("#autoFormTemplate");
            // consider an inject temnplate method simular to DecoratorView
            var clone = document.importNode(t.content, true);
            this.el.appendChild(clone);
        }
    });

    var MyForm = Augmented.Presentation.AutomaticForm.extend({

    });

    var ViewerDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "viewer",
        el: "#viewer",
        settings: {},
        init: function() {
            //defaults
            this.on("compile", function(data) {
                // do something
                this.schema = data;
                if (this.schema) {
                    this.compile();
                }
            });
            this.on("requestData", function(message) {
                this.sendMessage("yourDataRequest", this.getFullDataset());
            });
            this.on("updateSettings", function(settings) {
                this.settings = settings;
            });
        },
        getFullDataset: function() {
            return {
                data: this.data,
                schema: this.schema,
                settings: this.settings
            };
        },
        compile: function() {
            if (this.myFormView && this.schema) {
                this.myFormView.setSchema(this.schema);
                this.myFormView.populate(this.data);
                this.myFormView.render();
            } else if (this.schema){
                this.myFormView = new MyForm({
                    schema: this.schema,
                    data: this.data,
                    el: "#renderWindow"
                });
                this.myFormView.render();
            }
            if (this.schema){
                this.sendMessage("yourDataRequest", this.getFullDataset());
            }
        },
        generate: function() {
            if (this.schema && this.schema.properties) {
                var i = 0, ii = 0, keys = Object.keys(this.schema.properties), l = keys.length, obj = {};
                this.data = [];
                for (ii = 0; ii < 5; ii++) {
                    obj = {};
                    for (i = 0; i < l; i++) {
                        obj[keys[i]] = this.makeUpData(
                            this.schema.properties[keys[i]].type,
                            this.schema.properties[keys[i]].format,
                            this.schema.properties[keys[i]].enum
                        );
                    }
                    this.data.push(obj);
                }
            }
            this.compile();
        },
        cleanup: function() {
            if (this.myFormView) {
                this.myFormView.remove();
            }
        }
    });

    var AutoFormController = Augmented.Presentation.ViewController.extend({
        render: function() {
            this.autoFormMediatorView.render();

            // create the views - bindings happen automatically

            app.log("Creating Child Views...");

            this.schemaView = new SchemaDecoratorView();
            this.viewerView = new ViewerDecoratorView();
            this.basicView = new BasicInfoView();

            app.log("Listening to Child Views...");

            this.autoFormMediatorView.observeColleagueAndTrigger(
                this.basicView, // colleague view
                "basic",   // channel
                "basic"    // identifier
            );

            this.autoFormMediatorView.observeColleagueAndTrigger(
                this.schemaView, // colleague view
                "schema",   // channel
                "schema"    // identifier
            );

            this.autoFormMediatorView.observeColleagueAndTrigger(
                this.viewerView, // colleague view
                "viewer",   // channel
                "viewer"    // identifier
            );

            this.autoFormMediatorView.publish("basic", "updateName", this.autoFormMediatorView.currentView.model.name);
            this.autoFormMediatorView.updateSchema(this.autoFormMediatorView.currentView.model.schema);
            this.autoFormMediatorView.updateSettings(this.autoFormMediatorView.currentView.model.settings);
        },
        initialize: function() {
            app.log("Creating Mediator View...");

            this.autoFormMediatorView = new AutoFormMediator();

            app.log("ready.");

            return this;
        },
        remove: function() {
            this.basicView.remove();
            this.schemaView.remove();
            this.viewerView.remove();
            this.autoFormMediatorView.remove();
            this.basicView = null;
            this.schemaView = null;
            this.viewerView = null;
            this.autoFormMediatorView = null;

            app.log("removed.");
        }
    });
        return new AutoFormController();
    });

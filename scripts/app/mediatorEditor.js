define(["augmented", "augmentedPresentation", "application",
        "basicInfoView", "editDialog", "abstractEditorMediator", "abstractEditorView", "models",
        "handlebars",
        "observeViewsListTemplate"],
function(Augmented, Presentation, app,
    BasicInfoView, EditDialog, AbstractEditorMediator, AbstractEditorView, Models,
    Handlebars) {
    "use strict";

    var ObserveViewCollection = Augmented.Collection.extend({
        model: Models.ObserveViewModel
    });

    var ObserveViewDialog = EditDialog.extend({
        style: "bigForm",
        title: "Observe View",
        name: "observe-view"
    });

    var MediatorEditorMediator = AbstractEditorMediator.extend({
        name:"MediatorEditorMediator",
        init: function() {
            this.on("goToProject", function() {
                this.goToProject();
            });
            this.on("updateData", function(data) {
                this.currentView.model.observeList = data;
                this.saveData();
            });
        },
        render: function() {
            this.currentView = app.datastore.get("currentView");
            if (!this.currentView) {
                this.currentView = {
                    index: 0,
                    "model": {
                        "name": "untitled",
                        "type": "Mediator",
                        "permissions": {
                            "include": [],
                            "exclude": []
                        },
                        "observeList": []
                    }
                };
            }

            var t = document.querySelector("#mediatorEditorTemplate");
            // consider an inject template method simular to DecoratorView
            var clone = document.importNode(t.content, true);
            this.el.appendChild(clone);
        }
    });

    var MediatorObserverListView = AbstractEditorView.extend({
        name: "mediator",
        el: "#mediator",
        mediatorName: "",
        init: function() {
            this.collection = new ObserveViewCollection();
            this.on("mediatorData", function(data) {
                if (data) {
                    this.collection.reset(data);
                    this.render();
                }
            });
            this.on("updateName", function(data) {
                this.mediatorName = data;
            });
        },
        render: function() {
            var e = this.boundElement("observeList");
            this.removeTemplate(e, true);
            this.injectTemplate(Handlebars.templates.observeViewsListTemplate({"views": this.collection.toJSON()}), e);
            this.el.style.height = (Augmented.Presentation.Dom.getViewportHeight() - 160) + "px";
            this.sendMessage("updateData", this.collection.toJSON());
        },
        observeNewView: function() {
            this.addNew();
        },
        openDialog: function(model, index) {
            var views = app.datastore.get("views");

            if (!this.dialog) {
                this.dialog = new ObserveViewDialog();

                this.listenTo(this.dialog, "save", this.observeView);
                this.listenTo(this.dialog, "delete", this.dismissView);
                this.listenTo(this.dialog, "close", this.closeDialog);
            }

            if (!model) {
                model = new Models.ObserveViewModel();
            }

            if (index === -1) {
                this.dialog.title = "Observe New View";
                this.dialog.buttons = {
                    "cancel": "cancel",
                    "ok" : "ok"
                };
            } else {
                this.dialog.title = "Edit View";
                this.dialog.buttons = {
                    "cancel": "cancel",
                    "ok" : "ok",
                    "delete": "del"
                };
            }

            this.dialog.model.set("index", index);
            var name = ((model) ? model.get("view") : "");
            if (views && views.length > 0 && !(views.length === 1 && views[0].name === this.mediatorName)) {
                this.dialog.body = "<label>Views</label><select data-observe-view='view'>" +
                                    this.formatViews(views, name) + "</select>" +
                                    "<label>Channel</label><input type='text' data-observe-view='channel' value='" + ((model) ? model.get("channel") : "") + " ' />" +
                                    "<label>Identifer</label><input type='text' data-observe-view='identifer' value='" + ((model) ? model.get("identifer") : "") + "'/>";
            } else {
                this.dialog.body = "There are no views.";
                this.dialog.buttons = {
                    "cancel": "cancel"
                };
            }
            this.dialog.render();
            this.dialog.syncBoundElement("view");
            this.dialog.syncBoundElement("channel");
            this.dialog.syncBoundElement("identifer");
        },
        formatViews: function(views, name) {
            var html = "", i = 0, l = views.length;
            for (i = 0; i < l; i++) {
                // only support Colleagues
                if (views[i].type !== "View" && this.mediatorName !== views[i].name) {
                    html = html + "<option value='" + views[i].name + "'";
                    if (name === views[i].name) {
                        html = html + " selected='selected' ";
                    }
                    html = html + ">" + views[i].name + "</option>";
                }
            }
            return html;
        },
        observeView: function(event) {
            var view = this.dialog.model.get("view");
            if (view) {
                var index = this.dialog.model.get("index");
                var model = this.collection.at(index);
                var channel = this.dialog.model.get("channel");
                var identifer = this.dialog.model.get("identifer");

                if (model && index != -1) {
                    model.set("view", view);
                    model.set("channel", channel);
                    model.set("identifer", identifer);
                    this.collection.push(model);
                } else {
                    model = new Models.ObserveViewModel({"view": view, "channel": channel, "identifer": identifer});
                    this.collection.add(model);
                }

                this.render();
            }
        },
        dismissView: function() {
            this.deleteCurrent();
        },
        editView: function(event) {
            this.editCurrent(event);
        }
    });

    var MeditorEditorController = Augmented.Presentation.ViewController.extend({
        render: function() {
            this.mediator.render();
            var basicView = new BasicInfoView();
            var mediatorListView = new MediatorObserverListView();
            mediatorListView.render();
            this.manageView(basicView);
            this.manageView(mediatorListView);

            app.log("Listening to Child Views...");

            this.mediator.observeColleagueAndTrigger(
                basicView, // colleague view
                "basic",   // channel
                "basic"    // identifer
            );

            this.mediator.observeColleagueAndTrigger(
                mediatorListView, // colleague view
                "basic",   // channel
                "listView"    // identifer
            );

            this.mediator.observeColleagueAndTrigger(
                mediatorListView, // colleague view
                "list",   // channel
                "list"    // identifer
            );

            this.mediator.publish("basic", "updateName", this.mediator.currentView.model.name);
            this.mediator.publish("list", "mediatorData",
                this.mediator.currentView.model.observeList);
        },
        initialize: function() {
            app.log("Creating MediatorEditorController ...");
            this.mediator = new MediatorEditorMediator();
            app.log("ready.");
            return this;
        },
        remove: function() {
            this.removeAllViews();
            this.mediator.remove();
            this.mediator = null;
        }
    });

    return new MeditorEditorController();
});

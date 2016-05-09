define(['augmented', 'augmentedPresentation', 'application', 'basicInfoView', 'editDialog', 'models', 'handlebars'],
function(Augmented, Presentation, app, BasicInfoView, EditDialog, Models, Handlebars) {
    "use strict";

    var DialogEditorMediator = Augmented.Presentation.Mediator.extend({
        name:"DialogEditorMediator",
        el: "#activePanel",
        init: function() {
            this.on("goToProject", function() {
                this.goToProject();
            });
            this.on("updateData", function(data) {
                this.publish("dialog", "dialogData", data);
                this.currentView.model = data;
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
                    "type": "Dialog",
                    "style": "form",
                    "permissions": {
                        "include": [],
                        "exclude": []
                    },
                    "buttons": {
                        "cancel": "cancel"
                    }
                }};
            }

            var t = document.querySelector('#dialogEditorTemplate');
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
        },
        saveData: function() {
            app.datastore.set("currentView", this.currentView);
            var views = app.datastore.get("views");
            if (views) {
                views[this.currentView.index] = this.currentView.model;
            }
        },
    });

    var DialogEditorView = Augmented.Presentation.DecoratorView.extend({
        name: "dialogEditor",
        el: "#dialogEditor",
        init: function() {
            this.on("dialogData", function(data) {
                this.model.set(data);
            });
            this.syncModelChange();
            this.bindModelChange(this.notify);
        },
        render: function() {
            this.el.style.height = (Augmented.Presentation.Dom.getViewportHeight() - 160) + "px";
        },
        notify: function() {
            var buttons = {},
            button0 = this.model.get("button0"),
            button1 = this.model.get("button1"),
            button2 = this.model.get("button2"),
            button3 = this.model.get("button3");
            if (button0) {
                buttons[button0] = button0;
            } else {
                buttons.cancel = "cancel";
            }
            if (button1) {
                buttons[button1] = button1;
            }
            if (button2) {
                buttons[button2] = button2;
            }
            if (button3) {
                buttons[button3] = button3;
            }
            this.model.set("buttons", buttons);

            this.sendMessage("updateData", this.model.toJSON());
        }
    });

    var DialogViewerView = Augmented.Presentation.DecoratorView.extend({
        name: "dialogViewer",
        el: "#dialogViewer",
        init: function() {
            this.on("dialogData", function(data) {
                this.model.set(data);
                var dialog = this.boundElement("dialogCanvas");
                Augmented.Presentation.Dom.removeClass(dialog, "alert");
                Augmented.Presentation.Dom.removeClass(dialog, "form");
                Augmented.Presentation.Dom.removeClass(dialog, "bigForm");
                Augmented.Presentation.Dom.addClass(dialog, this.model.get("style"));

                var bEl = this.boundElement("buttons");
                Augmented.Presentation.Dom.setValue(bEl, this._getButtonGroup());

            });
            this.syncModelChange("title");
            this.syncModelChange("body");
        },
        render: function() {
            this.el.style.height = (Augmented.Presentation.Dom.getViewportHeight() - 160) + "px";
        },
        _getButtonGroup: function() {
            var buttons = this.model.get("buttons"), html = "<div class=\"buttonGroup\">";
            if (buttons) {
                var i = 0, keys = Object.keys(buttons), l = (keys) ? keys.length: 0;
                for (i = 0; i < l; i++) {
                    html = html + "<button>" + keys[i] + "</button>";
                }
            }
            return html + "</div>";
        }
    });

    var DialogEditorController = Augmented.Presentation.ViewController.extend({
        render: function() {
            this.mediator.render();
            var basicView = new BasicInfoView();
            var dialogEditorView = new DialogEditorView();
            var dialogViewerView = new DialogViewerView();
            dialogEditorView.render();
            dialogViewerView.render();
            this.manageView(basicView);
            this.manageView(dialogEditorView);
            this.manageView(dialogViewerView);
            app.log("Listening to Child Views...");

            this.mediator.observeColleagueAndTrigger(
                basicView, // colleague view
                "basic",   // channel
                "basic"    // identifer
            );

            this.mediator.observeColleagueAndTrigger(
                dialogEditorView, // colleague view
                "dialog",   // channel
                "dialogEditor"    // identifer
            );

            this.mediator.observeColleagueAndTrigger(
                dialogViewerView, // colleague view
                "dialog",   // channel
                "dialogViewer"    // identifer
            );

            this.mediator.publish("basic", "updateName", this.mediator.currentView.model.name);
            this.mediator.publish("dialog", "dialogData", this.mediator.currentView.model);
        },
        initialize: function() {
            app.log("Creating DialogEditorController ...");
            this.mediator = new DialogEditorMediator();
            app.log("ready.");
            return this;
        },
        remove: function() {
            this.removeAllViews();
            this.mediator.remove();
            this.mediator = null;
        }
    });

    return new DialogEditorController();
});

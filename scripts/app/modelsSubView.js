define("modelsSubView", ["augmented", "augmentedPresentation", "application", "models", "editDialog", "abstractEditorView", "handlebars",
//templates
"modelsTemplate"
],
    function(Augmented, Presentation, app, Models, EditDialog, AbstractEditorView, Handlebars) {
    "use strict";
    var EditModelDialog = EditDialog.extend({
        style: "bigForm",
        title: "Edit Model",
        name: "edit-model"
    });

    var ModelsCollection = Augmented.Collection.extend({
        model: Models.ModelModel
    });

    // an option builder for the views
    var buildOptions = function(selected) {
        var html = "", i = 0, s = app.datastore.get("schemas"), l = s.length;
        for (i = 0; i < l; i++) {
            html = html + "<option";
            if (s[i] === selected) {
                html = html + " selected";
            }
            html = html + ">" + s[i] + "</option>";
        }
        return html;
    };

    var ModelsView = AbstractEditorView.extend({
        name: "models",
        el: "#models",
        init: function() {
            this.collection = new ModelsCollection();
            var arr = app.datastore.get("models");
            if (arr) {
                this.collection.reset(arr);
            }
            this.render();
        },
        render: function() {
            // refresh the data
            app.datastore.set("models", this.collection.toJSON());

            var e = this.boundElement("currentModels");
            this.removeTemplate(e, true);
            this.injectTemplate(Handlebars.templates.modelsTemplate({"models": this.collection.toJSON()}), e);
        },
        editModel: function(event) {
            this.editCurrent(event);
        },
        setModel: function(arr) {
            this.model.set("currentModels", arr);
            app.datastore.set("models", arr);
        },
        saveModel: function() {
            var m = this.dialog.model.get("model");
            if (m) {
                var index = this.dialog.model.get("index");
                var model = this.collection.at(index);

                if (model && index != -1) {
                    model.set("model", m);
                    this.collection.push(model);
                } else {
                    model = new Models.ModelModel({"model": m});
                    this.collection.add(model);
                }

                this.render();
            }
        },
        deleteModel: function() {
            this.deleteCurrent();
        },
        currentModels: function(event) {
            var index = (event.target.getAttribute("data-index"));
            var a = this.model.get("currentModels");
            this.openDialog(a, index);
        },
        openDialog: function(model, index) {
            if (!this.dialog) {
                this.dialog = new EditModelDialog();
                this.listenTo(this.dialog, "save", this.saveModel);
                this.listenTo(this.dialog, "delete", this.deleteModel);
                this.listenTo(this.dialog, "close", this.closeDialog);
            }

            if (index === -1) {
                this.dialog.title = "Add New Model";
                this.dialog.buttons = {
                    "cancel": "cancel",
                    "ok" : "ok"
                };
            } else {
                this.dialog.title = "Edit Model";
                this.dialog.buttons = {
                    "cancel": "cancel",
                    "ok" : "ok",
                    "delete": "del"
                };
            }

            if (!model) {
                model = new Models.ModelModel();
            }

            this.dialog.model.set("index", index);
            this.dialog.body =
                "<label for=\"name\">Model</label>" +
                "<input type=\"text\" value=\"" + ((model) ? model.get("model") : "") +
                    "\" data-edit-model=\"model\" name=\"name\" placeholder=\"Name\" required/>" +
                "<label for=\"schema\">Schema</label>" +
                "<select data-edit-model=\"schema\" name=\"schema\">" +
                    buildOptions(model.get("schema")) + "</select>" +
                "<label for=\"url\">URL</label>" +
                "<input type=\"text\" value=\"" + ((model) ? model.get("url") : "") +
                    "\" data-edit-model=\"url\" placeholder=\"Service API\" />";
            this.dialog.render();
            this.dialog.syncBoundElement("model");
            this.dialog.syncBoundElement("schema");
            this.dialog.syncBoundElement("url");
        },
        addModel: function() {
            this.addNew();
        }
    });
    return ModelsView;
});

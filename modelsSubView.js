const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation"),
        Handlebars = require("handlebars");
const   CONSTANTS = require("./constants.js"),
        app = require("./application.js"),
        Models = require("./models.js"),
        EditDialog = require("./editDialog.js"),
        AbstractEditorView = require("./abstractEditorView.js"),
        modelsTemplate = require("./templates/modelsTemplate.js");

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
    var html = "", i = 0, s = app.getDatastoreItem("schemas"), l = s.length;
    html = html + "<option value=\"\">No Schema</option>";
    for (i = 0; i < l; i++) {
        html = html + "<option";
        if (s[i].name === selected) {
            html = html + " selected";
        }
        html = html + " value=\"" + s[i].name + "\" >" + s[i].name + "</option>";
    }
    return html;
};

//ModelsView
module.exports = AbstractEditorView.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.MODELS,
    el: CONSTANTS.VIEW_MOUNT.MODELS,
    init: function() {
        this.collection = new ModelsCollection();
        var arr = app.getDatastoreItem("models");
        if (arr) {
            this.collection.reset(arr);
        }
        this.render();
    },
    render: function() {
        // refresh the data
        app.setDatastoreItem("models", this.collection.toJSON());

        var e = this.boundElement("currentModels");
        this.removeTemplate(e, true);
        this.injectTemplate(Handlebars.templates.modelsTemplate({"models": this.collection.toJSON()}), e);
    },
    editModel: function(event) {
        this.editCurrent(event);
    },
    setModel: function(arr) {
        this.model.set("currentModels", arr);
        app.setDatastoreItem("models", arr);
    },
    saveModel: function() {
        var name = this.dialog.model.get("name");
        if (name) {
            var schema = this.dialog.model.get("schema");
            var url = this.dialog.model.get("url");
            var index = this.dialog.model.get("index");
            var model = this.collection.at(index);

            if (model && index != -1) {
                model.set("name", name);
                model.set("schema", schema);
                model.set("url", url);
                this.collection.push(model);
            } else {
                model = new Models.ModelModel({"name": name, "schema": schema, "url": url});
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
            this.listenTo(this.dialog, CONSTANTS.MESSAGES.SAVE, this.saveModel);
            this.listenTo(this.dialog, CONSTANTS.MESSAGES.DELETE, this.deleteModel);
            this.listenTo(this.dialog, CONSTANTS.MESSAGES.CLOSE, this.closeDialog);
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
            "<input type=\"text\" value=\"" + ((model) ? model.get("name") : "") +
                "\" data-edit-model=\"name\" name=\"name\" placeholder=\"Name\" required/>" +
            "<label for=\"schema\">Schema</label>" +
            "<select data-edit-model=\"schema\" name=\"schema\">" +
                buildOptions(model.get("schema")) + "</select>" +
            "<label for=\"url\">URL</label>" +
            "<input type=\"text\" value=\"" + ((model) ? model.get("url") : "") +
                "\" data-edit-model=\"url\" name=\"url\" placeholder=\"Service API\" />";
        this.dialog.render();
        this.dialog.syncBoundElement("name");
        this.dialog.syncBoundElement("schema");
        this.dialog.syncBoundElement("url");
    },
    addModel: function() {
        this.addNew();
    }
});

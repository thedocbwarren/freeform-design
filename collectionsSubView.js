const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation"),
        Handlebars = require("handlebars");
const   CONSTANTS = require("./constants.js"),
        app = require("./application.js"),
        Models = require("./models.js"),
        EditDialog = require("./editDialog.js"),
        AbstractEditorView = require("./abstractEditorView.js"),
        panelTemplates = require("./templates/panelTemplates.js");

var EditCollectionDialog = EditDialog.extend({
    style: "bigForm",
    title: "Edit Collection",
    name: "edit-collection"
});

var CollectionsCollection = Augmented.Collection.extend({
    model: Models.CollectionModel
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

//CollectionsView
module.exports = AbstractEditorView.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.COLLECTIONS,
    el: CONSTANTS.VIEW_MOUNT.COLLECTIONS,
    init: function() {
        this.collection = new CollectionsCollection();
        var arr = app.getDatastoreItem("collections");
        if (arr) {
            this.collection.reset(arr);
        }
        this.render();
    },
    render: function() {
        // refresh the data
        app.setDatastoreItem("collections", this.collection.toJSON());

        var e = this.boundElement("currentCollections");
        this.removeTemplate(e, true);
        this.injectTemplate(Handlebars.templates.collectionsTemplate({"collections": this.collection.toJSON()}), e);
    },
    editModel: function(event) {
        this.editCurrent(event);
    },
    setCollection: function(arr) {
        this.model.set("currentCollections", arr);
        app.setDatastoreItem("collections", arr);
    },
    saveCollection: function() {
        var name = this.dialog.model.get("name");
        if (name) {
            var schema = this.dialog.model.get("schema");
            var url = this.dialog.model.get("url");
            var index = this.dialog.model.get("index");
			var pagination = this.dialog.model.get("pagination");
			var paginationKey = this.dialog.model.get("paginationKey");
			var localStorage = this.dialog.model.get("localStorage");

            var model = this.collection.at(index);

            if (model && index != -1) {
                model.set("name", name);
                model.set("schema", schema);
                model.set("url", url);
				model.set("pagination", pagination);
				model.set("paginationKey", paginationKey);
				model.set("localStorage", localStorage);
                this.collection.push(model);
            } else {
                model = new Models.CollectionModel({"name": name, "schema": schema, "url": url});
                this.collection.add(model);
            }

            this.render();
        }
    },
    deleteCollection: function() {
        this.deleteCurrent();
    },
    currentCollections: function(event) {
        var index = (event.target.getAttribute("data-index"));
        var a = this.model.get("currentCollections");
        this.openDialog(a, index);
    },
    openDialog: function(model, index) {
        if (!this.dialog) {
            this.dialog = new EditCollectionDialog();
            this.listenTo(this.dialog, CONSTANTS.MESSAGES.SAVE, this.saveCollection);
            this.listenTo(this.dialog, CONSTANTS.MESSAGES.DELETE, this.deleteCollection);
            this.listenTo(this.dialog, CONSTANTS.MESSAGES.CLOSE, this.closeDialog);
        }

        if (index === -1) {
            this.dialog.title = "Add New Collection";
            this.dialog.buttons = {
                "cancel": "cancel",
                "ok" : "ok"
            };
        } else {
            this.dialog.title = "Edit Collection";
            this.dialog.buttons = {
                "cancel": "cancel",
                "ok" : "ok",
                "delete": "del"
            };
        }

        if (!model) {
            model = new Models.CollectionModel();
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
                "\" data-edit-model=\"url\" name=\"url\" placeholder=\"Service API\" />" +
			"<input type=\"checkbox\" name=\"edit-collection-localStorage\" data-edit-collection=\"edit-collection-localStorage\"" +
				((model.get("localStorage") === true) ? "checked=\"checked\"" : "") + " />" +
			"<label for=\"edit-stylesheet-localstorage\">Local Storage</label>" +
			"<input type=\"checkbox\" name=\"edit-collection-pagination\" data-edit-collection=\"edit-collection-pagination\"" +
				((model.get("pagination") === true) ? "checked=\"checked\"" : "") + " />" +
			"<label for=\"edit-stylesheet-pagination\">Pagination</label>" +
			"<label for=\"edit-collection\">Pagination Key</label>" +
			"<input type=\"text\" value=\"" + ((model) ? model.get("paginationKey") : "") +
				"\" data-edit-collection=\"edit-collection-pagination-key\" placeholder=\"key\" />";
        this.dialog.render();
        this.dialog.syncBoundElement("name");
        this.dialog.syncBoundElement("schema");
        this.dialog.syncBoundElement("url");
		this.dialog.syncBoundElement("pagination");
		this.dialog.syncBoundElement("paginationKey");
		this.dialog.syncBoundElement("localStorage");
    },
    addCollection: function() {
        this.addNew();
    }
});

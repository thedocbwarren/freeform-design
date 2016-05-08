define('viewsSubView', ['augmented', 'augmentedPresentation', 'application', 'models', 'editDialog', 'handlebars',
//templates
'viewsTemplate'],
    function(Augmented, Presentation, app, Models, EditDialog, Handlebars) {
    "use strict";

    var ViewCollection = Augmented.Collection.extend({
        model: Models.ViewModel
    });

    // dialogs

    var EditViewDialog = EditDialog.extend({
        title: "Edit View",
        name: "edit-view"
    });

    // Current support views
    var supportedViews = [
        "View", "Mediator", "Colleague", "AutomaticTable", "DecoratorView", "DialogView"
    ];

    // an option builder for the views
    var buildOptions = function(selected) {
        var html = "", i = 0, l = supportedViews.length;
        for (i = 0; i < l; i++) {
            html = html + "<option";
            if (supportedViews[i] === selected) {
                html = html + " selected";
            }
            html = html + ">" + supportedViews[i] + "</option>";
        }
        return html;
    };

    // views

    var ViewsView = Augmented.Presentation.DecoratorView.extend({
        name: "views",
        el: "#views",
        init: function() {
            this.collection = new ViewCollection();
            var arr = app.datastore.get("views");
            if (arr) {
                this.collection.reset(arr);
            }
            this.render();
        },
        render: function() {
            // refresh the data
            app.datastore.set("views", this.collection.toJSON());

            var e = this.boundElement("currentViews");
            this.removeTemplate(e, true);
            this.injectTemplate(Handlebars.templates.viewsTemplate({"currentViews": this.collection.toJSON()}), e);
        },
        editView: function(event) {
            var index = (event.currentTarget.getAttribute("data-index"));
            var model = this.collection.at(index);
            this.openDialog(model, index);
        },
        editViewType: function(event) {
            var index = (event.currentTarget.getAttribute("data-index"));
            var model = this.collection.at(index);
            var panel = panelRegistry[model.get("type")];
            app.datastore.set("currentView", { "index": index, "model": model.toJSON() });
            app.router.navigate(panel, {trigger: true});
        },
        editViewPermissions: function(event) {
            var index = (event.currentTarget.getAttribute("data-index"));
            var model = this.collection.at(index);
            var panel = panelRegistry.View;
            app.datastore.set("currentView", { "index": index, "model": model.toJSON() });
            app.router.navigate(panel, {trigger: true});
        },
        saveView: function() {
            var name = this.dialog.model.get("edit-view");
            var type = this.dialog.model.get("edit-view-type");
            var index = this.dialog.model.get("index");
            var model = this.collection.at(index);

            if (model && index != -1) {
                model.set("name", name);
                model.set("type", type);
                this.collection.push(model);
            } else {
                model = new Models.ViewModel({"name": name, "type": type});
                this.collection.add(model);
            }

            this.render();
        },
        deleteView: function() {
            var index = this.dialog.model.get("index");
            var model = this.collection.at(index);
            this.collection.remove(model);
            this.render();
        },
        currentViews: function(event) {
            var index = (event.target.getAttribute("data-index"));
            var a = this.model.get("currentViews");
            this.openDialog(a, index);
        },
        openDialog: function(model, index) {
            if (!this.dialog) {
                this.dialog = new EditViewDialog();
                this.listenTo(this.dialog, "save", this.saveView);
                this.listenTo(this.dialog, "delete", this.deleteView);
                this.listenTo(this.dialog, "close", this.closeDialog);
            }

            if (!model) {
                model = new Models.ViewModel();
            }

            this.dialog.model.set("index", index);
            this.dialog.body = "<input type=\"text\" value=\"" + ((model) ? model.get("name") : "") +
                "\" data-edit-view=\"edit-view\" />" +
                "<select data-edit-view=\"edit-view-type\" name=\"edit-view-type\">" +
                buildOptions(model.get("type")) +
                "</select>";
            this.dialog.render();
            this.dialog.syncBoundElement("edit-view");
            this.dialog.syncBoundElement("edit-view-type");
        },
        closeDialog: function() {
        },
        addView: function() {
            this.openDialog(null, -1);
        }
    });
    return ViewsView;
});

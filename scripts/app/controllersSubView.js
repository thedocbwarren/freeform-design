define('controllersSubView', ['augmented', 'augmentedPresentation', 'application', 'models', 'editDialog', 'handlebars',
//templates
],
    function(Augmented, Presentation, app, Models, EditDialog, Handlebars) {
    "use strict";

    var EditControllerDialog = EditDialog.extend({
        title: "Edit Controller",
        name: "edit-controller"
    });

    var ControllersView = Augmented.Presentation.DecoratorView.extend({
        name: "controllers",
        el: "#controllers",
        init: function() {
            this.model = new Models.ControllerModel();
            this.syncModelChange("currentControllers");
            var arr = app.datastore.get("controllers");
            this.model.set("currentControllers", arr);
        },
        setModel: function(arr) {
            this.model.set("currentControllers", arr);
            app.datastore.set("controllers", arr);
        },
        saveController: function() {
            var data = this.dialog.model.get("edit-controller");
            var index = this.dialog.model.get("index");
            var cc = this.model.get("currentControllers").slice(0);
            if (index > -1) {
                cc[index] = data;
            } else {
                cc.push(data);
            }
            this.setModel(cc);
        },
        deleteController: function() {
            var index = this.dialog.model.get("index");
            var cc = this.model.get("currentControllers").slice(0);
            cc.splice(index, 1);
            this.setModel(cc);
        },
        currentControllers: function(event) {
            var index = (event.target.getAttribute("data-index"));
            var a = this.model.get("currentControllers");
            this.openDialog(a, index);
        },
        openDialog: function(data, index) {
            if (!this.dialog) {
                this.dialog = new EditControllerDialog();
                this.listenTo(this.dialog, "save", this.saveController);
                this.listenTo(this.dialog, "delete", this.deleteController);
                this.listenTo(this.dialog, "close", this.closeDialog);
            }
            this.dialog.model.set("index", index);
            this.dialog.body = "<input type=\"text\" value=\"" +
                ((data && (index > -1)) ? (data[index]) : "") + "\" data-edit-controller=\"edit-controller\" />";
            this.dialog.render();
            this.dialog.syncBoundElement("edit-controller");
        },
        closeDialog: function() {
        },
        addController: function() {
            var a = this.model.get("currentControllers");
            this.openDialog(a, -1);
        }
    });
return ControllersView;
});

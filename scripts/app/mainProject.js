// Main project module
define('mainProject', ['augmented', 'augmentedPresentation', 'application', 'models', 'editDialog', 'handlebars',
//templates
'routesTemplate', 'stylesheetsTemplate', 'viewsTemplate'],
    function(Augmented, Presentation, app, Models, EditDialog, Handlebars) {
    "use strict";

    // register panels to a view type
    var panelRegistry = {
        "View": "view",
        "Mediator": "view",
        "Colleague": "view",
        "DecoratorView": "view",
        "Dialog": "view",
        "AutomaticTable": "table"
    };

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

    var ViewCollection = Augmented.Collection.extend({
        model: Models.ViewModel
    });

    // dialogs

    /*
    var EditDialog = Augmented.Presentation.DialogView.extend({
        style: "form",
        el: "#editDialog",
        buttons: {
            "cancel": "cancel",
            "ok" : "ok",
            "delete": "del"
        },
        ok: function() {
            this.trigger("save");
            this.close();
        },
        del: function() {
            this.trigger("delete");
            this.close();
        }
    });
    */

    var EditControllerDialog = EditDialog.extend({
        title: "Edit Controller",
        name: "edit-controller"
    });

    var EditViewDialog = EditDialog.extend({
        title: "Edit View",
        name: "edit-view"
    });

    // views

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

    var StylesheetsView = Augmented.Presentation.DecoratorView.extend({
        name: "stylesheets",
        el: "#stylesheets",
        init: function() {
            this.model = new Models.StylesheetsModel();
            var ss = app.datastore.get("stylesheets");
            this.model.set("asyncStylesheets", ss.asyncStylesheets);
            this.model.set("syncStylesheets", ss.syncStylesheets);

            this.render();
        },
        render: function() {
            // sync the data
            var d = {
                "asyncStylesheets": this.model.get("asyncStylesheets"),
                "syncStylesheets": this.model.get("syncStylesheets")
            };
            app.datastore.set("stylesheets", d);

            var e = this.boundElement("stylesheetsTemplate");
            this.removeTemplate(e, true);
            this.injectTemplate(Handlebars.templates.stylesheetsTemplate(this.model.toJSON()), e);
        },
        addStylesheet: function() {
            var ss = this.model.get("stylesheet");
            var styles = this.model.get("asyncStylesheets").slice(0);
            styles.push(ss);
            this.model.set("asyncStylesheets", styles);
            this.model.unset("stylesheet");
            var s = this.boundElement("stylesheet");
            s.value = "";
            this.render();
        },
        // TODO: clean this up
        addStylesheetSync: function() {
            var ss = this.model.get("stylesheet");
            var styles = this.model.get("syncStylesheets").slice(0);
            styles.push(ss);
            this.model.set("syncStylesheets", styles);
            this.model.unset("stylesheet");
            var s = this.boundElement("stylesheet");
            s.value = "";
            this.render();
        },
        removeAllStylesheets: function() {
            this.model.unset("asyncStylesheets");
            this.model.unset("syncStylesheets");
            this.model.set("asyncStylesheets", []);
            this.model.set("syncStylesheets", []);
            this.model.unset("stylesheet");
            var s = this.boundElement("stylesheet");
            s.value = "";
            this.render();
        }
    });

    var RoutesView = Augmented.Presentation.DecoratorView.extend({
        name: "routes",
        el: "#routes",
        init: function() {
            this.model = new Models.RoutesModel();
            var r = app.datastore.get("routes");
            if (r) {
                this.model.set("functionRoutes", r.functionRoutes);
                this.model.set("viewRoutes", r.viewRoutes);
                this.model.set("controllerRoutes", r.controllerRoutes);
            }
            this.render();
        },
        render: function() {
            // sync the data
            var r = {
                "functionRoutes": this.model.get("functionRoutes"),
                "viewRoutes": this.model.get("viewRoutes"),
                "controllerRoutes": this.model.get("controllerRoutes")
            };
            app.datastore.set("routes", r);

            var e = this.boundElement("routesTemplate");
            this.removeTemplate(e, true);
            this.injectTemplate(Handlebars.templates.routesTemplate(this.model.toJSON()), e);
        },
        editRoute: function(event) {
            var el = event.target;
        },
        addRoute: function() {
            var t = document.querySelector('#addRouteTemplate');
            // consider an inject template method
            var clone = document.importNode(t.content, true);
            this.injectTemplate(clone, this.el);
            this.modal = true;

            // fire default for select element
            // Create a new 'change' event and dispatch it.
            this.syncBoundElement("routeType");
        },
        addRouteButton: function() {
            if (this.modal) {
                var dialog = this.boundElement("addRouteDialog");
                this.removeTemplate(dialog);
                this.modal = false;

                var type = this.model.get("routeType"), ar;
                if (type === "controller") {
                    ar = this.model.get("controllerRoutes");
                } else if (type === "view") {
                    ar = this.model.get("viewRoutes");
                } else {
                    ar = this.model.get("functionRoutes");
                }
                ar.push({"route": this.model.get("routePath"), "callback": this.model.get("routeCallback")});
                //this.sendMessage("addRoute", this.model.get("projectName"));
                this.render();
            }
        },
        addRouteButtonClose: function() {
            if (this.modal) {
                var dialog = this.boundElement("addRouteDialog");
                this.removeTemplate(dialog);
                this.modal = false;
            }
        }
    });

    var ProjectSideNavigation = Augmented.Presentation.DecoratorView.extend({
        name: "sideNav",
        el: "#sideNav",
        currentNav: "",
        init: function() {
            this.syncModelChange("name");
            this.model.set("name", app.datastore.get("project"));
            this.on("markNavigation", function(nav) {
                this.markNavigation(nav);
            });
        },
        markNavigation: function(nav) {
            Augmented.Presentation.Dom.removeClass(this.currentNav, "current");
            var navListEl = this.boundElement(nav);
            this.currentNav = navListEl;
            Augmented.Presentation.Dom.addClass(this.currentNav, "current");
        },
        stylesheets: function() {
            this.sendMessage("navigation", "stylesheets");
        },
        routes: function() {
            this.sendMessage("navigation", "routes");
        },
        views: function() {
            this.sendMessage("navigation", "views");
        },
        controllers: function() {
            this.sendMessage("navigation", "controllers");
        }
    });

    var MainProjectMediator = Augmented.Presentation.Mediator.extend({
        name:"projectMediator",
        el: "#activePanel",
        basePanelEl: "#basePanel",
        currentNavigation: "",
        currentNavigationView: null,
        init: function() {
            this.on("navigation", function(navigation) {
                if (navigation === "stylesheets" && this.currentNavigation !== navigation) {
                    this.doNavigation(navigation, StylesheetsView);
                } else if (navigation === "routes" && this.currentNavigation !== navigation) {
                    this.doNavigation(navigation, RoutesView);
                } else if (navigation === "views" && this.currentNavigation !== navigation) {
                    this.doNavigation(navigation, ViewsView);
                } else if (navigation === "controllers" && this.currentNavigation !== navigation) {
                    this.doNavigation(navigation, ControllersView);
                }
            });
            var header = Augmented.Presentation.Dom.selector("#header").offsetHeight;
            this.el.style.height = (Augmented.Presentation.Dom.getViewportHeight() - ((header) ? (header) : 55)) + "px";
        },
        doNavigation: function(navigation, ViewObject) {
            this.removeLastView();
            this.currentNavigation = navigation;
            this.publish("sideNav", "markNavigation", navigation);

            app.log("adding view");

            var el = Augmented.Presentation.Dom.selector(this.basePanelEl);
            Augmented.Presentation.Dom.empty(el);
            Augmented.Presentation.Dom.injectTemplate("#" + navigation + "Template", el);
            this.currentNavigationView = new ViewObject();
            this.observeColleagueAndTrigger(
                this.currentNavigationView, // colleague view
                "myColleague",   // channel
                "myColleague"    // identifer
            );
        },
        removeLastView: function() {
            if (this.currentNavigationView) {
                app.log("removing last view");
                this.dismissColleagueTrigger(this.currentNavigationView, "myColleague", "myColleague");
                this.currentNavigationView.remove();
            }
            this.currentNavigation = null;
        },
        render: function() {
            Augmented.Presentation.Dom.injectTemplate("#mainProjectTemplate", this.el);
            this.sideNav = new ProjectSideNavigation();
            this.observeColleagueAndTrigger(
                this.sideNav, // colleague view
                "sideNav",   // channel
                "sideNav"    // identifer
            );
        },
        remove: function() {
            if (this.sideNav) {
                this.sideNav.remove();
            }
            if (this.currentNavigationView) {
                this.currentNavigationView.remove();
            }
            /* off to unbind the events */
            this.off();
            this.stopListening();
            Augmented.Presentation.Dom.empty(this.el);
            return this;
        }
    });

    // The controller for Main

    var MainProjectController = Augmented.Presentation.ViewController.extend({
        render: function() {
            this.projectMediator.render();
        },
        initialize: function() {
            this.projectMediator = new MainProjectMediator();
            return this;
        },
        remove: function() {
            this.projectMediator.remove();
            this.projectMediator = null;
        }
    });
    return new MainProjectController();
});

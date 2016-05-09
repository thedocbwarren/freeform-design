define('routesSubView', ['augmented', 'augmentedPresentation', 'application', 'models', 'editDialog', 'handlebars',
//templates
'routesTemplate'],
    function(Augmented, Presentation, app, Models, EditDialog, Handlebars) {
    "use strict";

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
            this.addRoute(event);
        },
        addRoute: function(event) {
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
    return RoutesView;
});

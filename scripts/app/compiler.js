define('compiler', ['augmented', 'models'],
    function(Augmented, Models) {
    "use strict";

    var Compiler = {
        compile: function(model) {
            if (model) {
                var i = 0, l;

                // the html
                var html = "<!DOCTYPE html>\n<html>\n\t<head>\n\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"/>\n\t<title>" + model.project + "</title>\n";
                // add sync stylesheets
                l = model.stylesheets.syncStylesheets.length;
                for(i = 0; i < l; i++) {
                    html = html + "\t<link type=\"text/css\" rel=\"stylesheet\" href=\"" + model.stylesheets.syncStylesheets[i] + "\"/>\n";
                }
                html = html + "\t<script data-main=\"scripts/" + model.project + ".js\" src=\"scripts/lib/require.js\"></script>\n\t</head>\n\t<body>\n\t\t<article>\n\t\t\t<section id=\"main\">\n\t\t\t</section>\n\t\t</article>\n\t</body>\n</html>";

                // base require
                var req = "require.config({'baseUrl': 'scripts/',\n'paths': {\n'jquery': 'lib/jquery.min', 'underscore': 'lib/lodash.min', 'backbone': 'lib/backbone-min', 'handlebars': 'lib/handlebars.runtime.min','augmented': 'scripts/lib/augmented','augmentedPresentation': 'scripts/lib/augmentedPresentation' }, 'shim': { } });" +
                        "\n\n\\\\views\n\nrequire(['augmented', 'augmentedPresentation'],\nfunction(Augmented, Presentation) {\n\"use strict\";\n";

                // application
                var application = "define('application', ['augmented', 'augmentedPresentation'], function(Augmented) {\n\"use strict\";\n\tvar app = new Augmented.Presentation.Application(\"" + model.project + "\");\n";
                // add async stylesheets
                l = model.stylesheets.asyncStylesheets.length;
                for(i = 0; i < l; i++) {
                    application = application + "\tapp.registerStylesheet(\"" + model.stylesheets.asyncStylesheets[i] + "\");\n";
                }
                application = application + "\n\treturn app;\n});";

                // router
                var router = "define('router', ['augmented', 'augmentedPresentation'], function(Augmented) {\n\"use strict\";\n";
                router = router + "\n\tvar router = Augmented.Router.extend({\n\troutes: {";
                // function routes
                l = model.routes.functionRoutes.length;
                var func = "";
                for(i = 0; i < l; i++) {
                    router = router + "\n\t\"" + model.routes.functionRoutes[i].route + "\": \"" + model.routes.functionRoutes[i].callback + "\",";
                    func = func + "\n\"" + model.routes.functionRoutes[i].callback + "\"" + ": function() { },";
                }
                // view routes
                l = model.routes.viewRoutes.length;
                for(i = 0; i < l; i++) {
                    router = router + "\n\t\"" + model.routes.viewRoutes[i].route + "\": \"" + model.routes.viewRoutes[i].callback + "\",";
                    func = func + "\n\"" + model.routes.viewRoutes[i].callback + "\"" + ": function() { this.loadView(new " + model.routes.viewRoutes[i].callback + "()); },";
                }
                // controller routes
                l = model.routes.controllerRoutes.length;
                for(i = 0; i < l; i++) {
                    router = router + "\n\t\"" + model.routes.controllerRoutes[i].route + "\": \"" + model.routes.controllerRoutes[i].callback + "\",";
                    func = func + "\n\"" + model.routes.controllerRoutes[i].callback + "\"" + ": function() { this.loadView(" + model.routes.controllerRoutes[i].callback + ".initialize()); },";
                }
                // remove the last comma
                router = router.slice(0, -1);
                func = func.slice(0, -1);

                router = router + "\n\t}, " + func + "\t});\n\treturn router;\n});";

                // controllers
                l = model.controllers.length;
                for(i = 0; i < l; i++) {
                    req = req + "\nvar " + model.controllers[i] +
                        " = Augmented.Presentation.ViewController.extend({\nrender: function() {\n },\n initialize: function() {\nreturn this;\n},\nremove: function() {\n}\n});\n";
                }

                // views
                l = model.views.length;
                for(i = 0; i < l; i++) {
                    if (model.views[i].type === "AutomaticTable") {
                        req = req+ "\n\n" + this.compileTable(model.views[i], model.views[i].settings);
                    } else {
                        req = req + "\nvar " + model.views[i].name + " = " +
                            ((model.views[i].type === "View") ? "Augmented." : "Augmented.Presentation.") +
                            model.views[i].type + ".extend({\n});\n";
                    }
                }

                req = req + "});";

                return html + " \n\n " + req + " \n\n " + router + " \n\n " + application;
                //zip it
            }
            return "";
        },
        compileTable: function(viewModel, settings) {
            return "var " + viewModel.name + "schema = " + JSON.stringify(viewModel.schema) + ";\n\n" +
                "var " + viewModel.name +
                " = Augmented.Presentation.AutomaticTable.extend({\n" +
                "\tinit: function(options) { }\n" +
                "});\n\n" +
                "var at = new " + viewModel.name + "({ " +
                    "\tschema: " + viewModel.name + "schema, \n" +
                    "\tel: \"#autoTable\", \n" +
                    "\tlineNumbers: " + String(settings.lineNumbers) + ",\n" +
                    "\tsortable: " + String(settings.sortable) + ",\n" +
                    "\teditable: " + String(settings.editable) + ",\n" +
                    "\turl: \"http://www.example.com/data\"\n" +
                "});\n\n" +
                "at.render();";
        }
    };
    return Compiler;
});

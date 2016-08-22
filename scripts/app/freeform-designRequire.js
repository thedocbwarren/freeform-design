require.config({
	"baseUrl": "scripts/",

    "paths": {
        //base libraries
		"jquery": "lib/jquery.min",
		"underscore": "lib/lodash.min",
		"backbone": "lib/backbone-min",
        "handlebars": "lib/handlebars.runtime.min",

        // hosted version
		"augmented": "/augmented/scripts/core/augmented",
        "augmentedPresentation": "/augmented/scripts/presentation/augmentedPresentation",

        // local version
		//"augmented": "lib/augmented",
        //"augmentedPresentation": "lib/augmentedPresentation",

        // FileSave Polyfill
        "filesaver": "lib/FileSaver.min",
        // Zip library
        "jszip": "lib/jszip.min",

        // other modules
        "application": "app/application",
        "mainProject": "app/mainProject",
        "tableCreate": "app/tableCreate",
        "autoForm": "app/autoForm",
        "standardViewEditor": "app/standardViewEditor",
        "models": "app/models",
        "compiler": "app/compiler",
        "basicInfoView": "app/basicInfoView",
        "abstractEditorMediator": "app/abstractEditorMediator",
        "abstractEditorView": "app/abstractEditorView",
        "editDialog": "app/editDialog",
        "dialogEditor": "app/dialogEditor",
        "mediatorEditor": "app/mediatorEditor",
        "autoViewMediator": "app/autoViewMediator",
        "schemaDecoratorView": "app/schemaDecoratorView",

        //subviews
        "stylesheetsSubView": "app/stylesheetsSubView",
        "routesSubView": "app/routesSubView",
        "controllersSubView": "app/controllersSubView",
        "viewsSubView": "app/viewsSubView",
		"modelsSubView": "app/modelsSubView",

        // compiled templates
        "stylesheetsTemplate": "app/templates/stylesheetsTemplate",
        "routesTemplate": "app/templates/routesTemplate",
        "viewsTemplate": "app/templates/viewsTemplate",
        "permissionsTemplate": "app/templates/permissionsTemplate",
        "controllersTemplate": "app/templates/controllersTemplate",
        "observeViewsListTemplate": "app/templates/observeViewsListTemplate",
		"modelsTemplate": "app/templates/modelsTemplate",
	},
    "shim": {
    }
});

//  main app

require(["augmented", "augmentedPresentation",
		 "application", "mainProject", "tableCreate", "autoForm", "standardViewEditor", "dialogEditor", "mediatorEditor", "models", "compiler"],
    function(Augmented, Presentation,
		     app, MainProject, TableCreate, AutoForm, StandardViewEditor, DialogEditor, MediatorEditor, Models, Compiler) {
    "use strict";
    app.log("Beginning Application...");

    var IntroView = Augmented.View.extend({
        el: "#main",
        render: function() {
            var h1 = document.createElement("h1"),
            t = document.createTextNode("Hello."),
            el = Augmented.Presentation.Dom.selector(this.el);
            h1.appendChild(t);
            el.appendChild(h1);
        },
        remove: function() {
            /* off to unbind the events */
            this.off(this.el);
            this.stopListening();
            Augmented.Presentation.Dom.empty(this.el);
            return this;
        }
    });

    var MyRouter = Augmented.Router.extend({
        routes: {
            "":                     "index",    // index
            "project":              "project",  // #project
            "table":                "table",    // #table
            "form":                 "form",     // #form
            "view":                 "view",     // #view
            "dialog":               "dialog",   // #dialog
            "mediator":             "mediator"  // #mediator
        },

        index: function() {
            this.loadView(new IntroView());
        },
        project: function()  {
            this.loadView(MainProject.initialize());
        },
        table: function() {
            this.loadView(TableCreate.initialize());
        },
        form: function() {
            this.loadView(AutoForm.initialize());
        },
        view: function() {
            this.loadView(StandardViewEditor.initialize());
        },
        dialog: function() {
            this.loadView(DialogEditor.initialize());
        },
        mediator: function() {
            this.loadView(MediatorEditor.initialize());
        }
    });

    app.router =  new MyRouter();
    app.datastore = new Models.ProjectModel();

    // define my views

    var ApplicationMediator = Augmented.Presentation.Mediator.extend({
        name:"mediator",
        el: "#main",
        init: function(options) {
            // hamburger events
            this.on("createProject", function(name) {
                app.log("Created new project - " + name);
                app.datastore.set("project", name);
                app.router.navigate("project", {trigger: true});
                this.publish("header", "notification", "Project " + name + " Created.");
            });
            this.on("openProject", function(file) {
                app.log("Opening a project - " + file);

                var reader = new FileReader(), that = this;

                reader.onload = function(e) {
                    var text = reader.result, data;
                    try {
                        data = JSON.parse(text);
                        app.datastore.set(data);
                        app.router.navigate("project", {trigger: true});
                        that.publish("header", "notification", "Project Loaded.");
                    } catch(ex) {
                        alert("Failed to read file! " + ex);
                        app.log("Failed to read file! " + ex);
                        that.publish("header", "error", "Project Load Failed!");
                    }
                };

                reader.readAsText(file);
            });
            this.on("saveProject", function(file) {
                app.log("Saving a project - " + file);
                var blob = new Blob([JSON.stringify(app.datastore.toJSON())], {type: "text/plain;charset=utf-8"});
                saveAs(blob, file);
                this.publish("header", "notification", "Save Project Complete.");
            });
            this.on("compileProject", function() {
                app.log("Compiling a project");
                //var stuff =
                Compiler.compile(app.datastore.toJSON());
                //var blob = new Blob([stuff], {type: "text/plain;charset=utf-8"});
                //saveAs(blob, app.datastore.get("project") + ".txt");
                this.publish("header", "notification", "Compile Complete!");
            });
            // end hamburger events
        }
    });

    var HeaderDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "header",
        el: "#header",
        notifyEl: "#notify",
        init: function() {
            this.on("highlight", function(color) {
                Augmented.Presentation.Dom.addClass(this.el, color);
            });
            this.on("notification", function(message) {
                this.notification(message, false);
            });
            this.on("error", function(message) {
                this.notification(message, true);
            });
        },
        notification: function(message, error) {
            if (message) {
                Augmented.Presentation.Dom.setValue(this.notifyEl, message);
                Augmented.Presentation.Dom.addClass(this.notifyEl, ((error) ? "showError" : "show"));
                Augmented.Presentation.Dom.addClass(this.el, ((error) ? "red" : "green"));
                var that = this;
                setTimeout(
                    function(){
                        Augmented.Presentation.Dom.removeClass(that.notifyEl, ((error) ? "showError" : "show"));
                        Augmented.Presentation.Dom.removeClass(that.el, ((error) ? "red" : "green"));
                    },
                4000);
            }
        },
        logo: function() {
            window.location = "http://www.augmentedjs.com";
        },
        // toggles the hamburger
        hamburger: function() {
            if (!this.modal) {
                var menu = this.boundElement("hamburgerMenu");
                var r = this.boundElement("hamburgerClickRegion");
                r.classList.toggle("model");
                menu.classList.toggle("menu--on");
            }
        },
        about: function() {
            if (!this.modal) {
                this.hamburger();
                var t = document.querySelector("#aboutDialogTemplate");
                // consider an inject template method
                var clone = document.importNode(t.content, true);
                this.injectTemplate(clone, this.el);
                this.modal = true;
                Augmented.D.setValue("#version", "Version " + app.VERSION);
            }
        },
        aboutButtonClose: function() {
            if (this.modal) {
                var dialog = this.boundElement("aboutDialog");
                this.removeTemplate(dialog);
                this.modal = false;
            }
        },
        create: function() {
            if (!this.modal) {
                this.hamburger();
                var t = document.querySelector("#createProjectDialogTemplate");
                // consider an inject template method
                var clone = document.importNode(t.content, true);
                this.injectTemplate(clone, this.el);
                this.modal = true;
            }
        },
        projectCreateButtonClose: function() {
            if (this.modal) {
                var dialog = this.boundElement("createProjectDialog");
                this.removeTemplate(dialog);
                this.modal = false;
            }
        },
        projectCreateButton: function() {
            var name = this.model.get("projectName");
            if (this.modal && name) {
                this.projectCreateButtonClose();
                this.sendMessage("createProject", name);
            }
        },
        open: function() {
            if (!this.modal) {
                this.hamburger();
                // Check for the various File API support.
                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    var t = document.querySelector("#openProjectDialogTemplate");
                    // consider an inject template method
                    var clone = document.importNode(t.content, true);
                    this.injectTemplate(clone, this.el);
                    this.modal = true;
                } else {
                    alert("Sorry no support for file reading on this browser.  Will polyfill shortly.");
                }
            }
        },
        projectOpenButtonClose: function() {
            if (this.modal) {
                var dialog = this.boundElement("openProjectDialog");
                this.removeTemplate(dialog);
                this.modal = false;
            }
        },
        projectOpenButton: function() {
            if (this.modal) {
                var el = this.boundElement("projectFile");
                var file = el.files[0];
                this.projectOpenButtonClose();
                this.sendMessage("openProject", file);
            }
        },
        save: function() {
            if (!this.modal) {
                this.hamburger();

                var t = document.querySelector("#saveProjectDialogTemplate");
                // consider an inject template method
                var clone = document.importNode(t.content, true);
                this.injectTemplate(clone, this.el);
                this.modal = true;
            }
        },
        projectSaveButtonClose: function() {
            if (this.modal) {
                var dialog = this.boundElement("saveProjectDialog");
                this.removeTemplate(dialog);
                this.modal = false;
            }
        },
        projectSaveButton: function() {
            var el = this.boundElement("projectFile");
            if (this.modal && el && el.value) {
                this.projectSaveButtonClose();
                this.sendMessage("saveProject", el.value);
            }
        },
        compile: function() {
            this.hamburger();
            this.sendMessage("compileProject", null);
        }
    });

    app.start();
    app.log("Starting Application...");

    var mediatorView = new ApplicationMediator();
    // No advantage as of yet
    //app.registerMediator(mediatorView);

    var headerView = new HeaderDecoratorView();

    // observe colleagues

    app.log("Observing Main Views...");

    mediatorView.observeColleagueAndTrigger(
        headerView, // colleague view
        "header",   // channel
        "header"    // identifier
    );

    app.log("Ready.");
});

require.config({
	'baseUrl': 'scripts/',

    'paths': {
        //base libraries
		'jquery': 'lib/jquery.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',
        'handlebars': 'lib/handlebars.runtime.min',

        // hosted version
		'augmented': '/augmented/scripts/core/augmented',
        'augmentedPresentation': '/augmented/scripts/presentation/augmentedPresentation',

        // local version
		//'augmented': 'lib/augmented',
        //'augmentedPresentation': 'lib/augmentedPresentation',

        // FileSave Polyfill
        'filesaver': 'lib/FileSaver.min',

        'jszip': 'lib/jzsip.min.js',

        // other modules
        'mainProject': 'app/mainProject',
        'tableCreate': 'app/tableCreate',
        'models': 'app/models',
        'compiler': 'app/compiler',

        // compiled templates
        'stylesheetsTemplate': 'app/templates/stylesheetsTemplate',
        'routesTemplate': 'app/templates/routesTemplate',
        'viewsTemplate': 'app/templates/viewsTemplate'
	},
    'shim': {
    }
});

// Create base application

define('application', ['augmented', 'augmentedPresentation'], function(Augmented, Presentation) {
    "use strict";
    // create an application
    var app = new Augmented.Presentation.Application("freeForm Designer");
    app.registerStylesheet("https://fonts.googleapis.com/icon?family=Material+Icons");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,300,400italic,100,700");
    // adding style packs
    app.registerStylesheet("styles/table/material.css");
    app.registerStylesheet("styles/table/plain.css");
    app.registerStylesheet("styles/table/spaceGray.css");

    // setup a logger
    app.logger = Augmented.Logger.LoggerFactory.getLogger(Augmented.Logger.Type.console, Augmented.Logger.Level.debug);
    app.APP_NAME = "FREEFORM: ";

    app.log = function(message) {
        this.logger.log(app.APP_NAME + message);
    };

    return app;
});

//

require(['augmented', 'augmentedPresentation', 'application', 'mainProject', 'tableCreate', 'models', 'compiler'],
    function(Augmented, Presentation, app, MainProject, TableCreate, Models, Compiler) {
    "use strict";
    app.log("Beginning Application...");

    var IntroView = Augmented.View.extend({
        el: "#main",
        render: function() {
            Augmented.Presentation.Dom.setValue(this.el, "<h1>Hello.</h1>");
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
            "table":                "table"     // #table
        },

        index: function() {
            this.loadView(new IntroView());
        },
        project: function()  {
            this.loadView(MainProject.initialize());
        },
        table: function() {
            this.loadView(TableCreate.initialize());
        }
    });

    app.router =  new MyRouter();
    app.datastore = new Models.ProjectModel();

    // define my views

    var ApplicationMediator = Augmented.Presentation.Mediator.extend({
        name:"mediator",
        el: "#main",
        init: function(options) {
            this.on('createProject', function(name) {
                app.log("Created new project - " + name);
                app.datastore.set("project", name);
                app.router.navigate("project", {trigger: true});
            });
            this.on('openProject', function(file) {
                app.log("Opening a project - " + file);

                var reader = new FileReader();
                reader.onload = function(e) {
                    var text = reader.result, data;
                    try {
                        data = JSON.parse(text);
                        app.datastore.set(data);
                        app.router.navigate("project", {trigger: true});
                    } catch(e) {
                        alert("Failed to read file! " + e);
                        app.log("Failed to read file! " + e);
                    }
                };

                reader.readAsText(file);
            });
            this.on('saveProject', function(file) {
                app.log("Saving a project - " + file);
                var blob = new Blob([JSON.stringify(app.datastore.toJSON())], {type: "text/plain;charset=utf-8"});
                saveAs(blob, file);
            });
            this.on('compileProject', function() {
                app.log("Compiling a project");
                var stuff = Compiler.compile(app.datastore.toJSON());
                var blob = new Blob([stuff], {type: "text/plain;charset=utf-8"});
                saveAs(blob, app.datastore.get("project") + ".txt");
            });
        }
    });

    var HeaderDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "header",
        el: "#header",
        init: function() {
        },
        logo: function() {
            window.location = "http://www.augmentedjs.com";
        },
        // toggles the hamburger
        hamburger: function() {
            if (!this.modal) {
                var menu = this.boundElement("hamburgerMenu");
                var r = this.boundElement("hamburgerClickRegion");
                r.classList.toggle('model');
                menu.classList.toggle('menu--on');
            }
        },
        about: function() {
            if (!this.modal) {
                this.hamburger();

                var t = document.querySelector('#aboutDialogTemplate');
                // consider an inject template method
                var clone = document.importNode(t.content, true);
                this.injectTemplate(clone, this.el);
                this.modal = true;
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

                var t = document.querySelector('#createProjectDialogTemplate');
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
            if (this.modal) {
                /*var dialog = this.boundElement("createProjectDialog");
                this.removeTemplate(dialog);
                this.modal = false;*/
                this.projectCreateButtonClose();
                this.sendMessage("createProject", this.model.get("projectName"));
            }
        },
        open: function() {
            if (!this.modal) {
                this.hamburger();

                // Check for the various File API support.
                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    var t = document.querySelector('#openProjectDialogTemplate');
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

                var t = document.querySelector('#saveProjectDialogTemplate');
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
            if (this.modal) {
                var el = this.boundElement("projectFile");
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
        "header"    // identifer
    );

    app.log("Ready.");
});

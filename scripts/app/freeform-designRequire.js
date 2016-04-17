require.config({
	'baseUrl': 'scripts/',

    'paths': {
        //base libraries
		'jquery': 'lib/jquery.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',

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
        'tableCreate': 'app/tableCreate'
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



require(['augmented', 'augmentedPresentation', 'application', 'mainProject', 'tableCreate'],
    function(Augmented, Presentation, app, MainProject, TableCreate) {
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
            "":         "index",    // index
            "project":  "project",  // #project
            "table":    "table"     // #table
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

    var router = new MyRouter();

    // This feature WIP
    //app.registerRouter(router);

    app.start();
    app.log("Starting Application...");

    // define my views

    var ApplicationMediator = Augmented.Presentation.Mediator.extend({
        name:"mediator",
        el: "#main",
        init: function(options) {
            this.model = new Augmented.Model();

            this.on('createProject', function(name) {
                this.model.set("projectName", name);
                app.log("Created new project - " + name);
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
                var dialog = this.boundElement("createProjectDialog");
                this.removeTemplate(dialog);
                this.modal = false;
                this.sendMessage("createProject", this.model.get("projectName"));
            }
        }
    });

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

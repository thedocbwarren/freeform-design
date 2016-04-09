require.config({
	'baseUrl': 'scripts/',

    'paths': {
		'jquery': 'lib/jquery-2.1.4.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',

        // hosted version
		'augmented': '/augmented/scripts/core/augmented',
        'augmentedPresentation': '/augmented/scripts/presentation/augmentedPresentation'

        // local version
		//'augmented': 'lib/augmented',
        //'augmentedPresentation': 'lib/augmentedPresentation',

	},
    'shim': {
    }
});

require(['augmented', 'augmentedPresentation'], function(Augmented, Presentation) {
    "use strict";
    // setup a logger

    var logger = Augmented.Logger.LoggerFactory.getLogger(Augmented.Logger.Type.console, Augmented.Logger.Level.debug);
    var APP_NAME = "FREEFORM: ";

    // create an application

    logger.info(APP_NAME + "Beginning Application...");

    var app = new Augmented.Presentation.Application("freeForm Designer");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,300,400italic,100,700");
    app.start();
    logger.info(APP_NAME + "Starting Application...");

    // define my views

    var ApplicationMediator = Augmented.Presentation.Mediator.extend({
        name:"mediator",
        el: "#main"
    });

    var HeaderDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "header",
        el: "#header",
        init: function() {
        },
        logo: function() {
            window.location = "http://www.augmentedjs.com";
        }
    });

    var SchemaDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "schema",
        el: "#schema",
        init: function() {
            this.model = new Augmented.Model();
            this.syncModelChange("schema");
            this.syncModelChange("message");
        },
        validate: function(event) {
            var schema = this.model.get("schema"), mess, s;
            try {
                var data = JSON.parse(schema);
                this.model.schema = data;
                mess = this.boundElement("message");
                mess.removeAttribute("class", "bad");
                s = this.boundElement("schema");
                s.removeAttribute("class", "bad");

                this.model.set("message", "Schema is valid.");
                //var mess = this.boundElement("message");
                //Augmented.Presentation.Dom.setValue(mess, );
                this.model.set("schema", Augmented.Utility.PrettyPrint(data));
                //var schemaInput = this.boundElement("schema");
                //Augmented.Presentation.Dom.setValue(schemaInput, Augmented.Utility.PrettyPrint(data));
            } catch(e) {
                this.model.set("message", "Schema is not valid!  Could Not parse schema!");
                mess = this.boundElement("message");
                mess.setAttribute("class", "bad");
                s = this.boundElement("schema");
                s.setAttribute("class", "bad");
            }

            logger.info(APP_NAME + "validating schema: " + schema);
        },
        clear: function(event) {
            var mess, s;
            // TODO: the unset is not either firing a change event or fails to set the value of the field
            this.model.unset("schema");
            this.model.set("message", "Ready.");
            mess = this.boundElement("message");
            mess.removeAttribute("class", "bad");
            s = this.boundElement("schema");
            s.removeAttribute("class", "bad");
        },
        compile: function(event) {
            logger.info(APP_NAME + "compile button clicked! schema: " + this.model.get("schema"));
        }
    });

    var ViewerDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "viewer",
        el: "#viewer",
        init: function() {
        }
    });

    var SourceDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "source",
        el: "#source",
        init: function() {
            this.model = new Augmented.Model();
        }
    });

    // create the views - bindings happen automatically

    logger.info(APP_NAME + "Creating Views...");

    var mediatorView = new ApplicationMediator();
    var headerView = new HeaderDecoratorView();
    var schemaView = new SchemaDecoratorView();
    var viewerView = new ViewerDecoratorView();
    var sourceView = new SourceDecoratorView();

    app.registerMediator(mediatorView);

    // observe colleagues

    logger.info(APP_NAME + "Observing Views...");

    mediatorView.observeColleagueAndTrigger(
        headerView, // colleague view
        "header",   // channel
        "header"    // identifer
    );

    mediatorView.observeColleagueAndTrigger(
        schemaView, // colleague view
        "schema",   // channel
        "schema"    // identifer
    );

    mediatorView.observeColleagueAndTrigger(
        viewerView, // colleague view
        "viewer",   // channel
        "viewer"    // identifer
    );

    mediatorView.observeColleagueAndTrigger(
        sourceView, // colleague view
        "source",   // channel
        "source"    // identifer
    );

    logger.info(APP_NAME + "Ready.");
});

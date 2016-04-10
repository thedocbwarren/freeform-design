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
    app.registerStylesheet("https://fonts.googleapis.com/icon?family=Material+Icons");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,300,400italic,100,700");
    app.start();
    logger.info(APP_NAME + "Starting Application...");

    // define my views

    var ApplicationMediator = Augmented.Presentation.Mediator.extend({
        name:"mediator",
        el: "#main",
        init: function() {
            this.on("compile",
                function(data) {
                    if (data) {
                        this.publish("viewer", "compile", data);
                        this.publish("source", "compile", data);
                    }
                }
            );
            /*this.on("updateTestData", function(message) {
                this.publish("viewer", "requestData", "requestData");
            });*/
            this.on("yourDataRequest", function(data) {
                this.publish("source", "updateYourData", data);
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
        }
    });

    var SchemaDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "schema",
        el: "#schema",
        init: function() {
            this.model = new Augmented.Model();
            this.syncModelChange("schema");
            this.syncModelChange("message");
            this.setMessage("Ready.");
        },
        setMessage: function(message, bad) {
            this.model.set("message", message);
            if (bad) {
                this.addClass("message", "bad");
            } else {
                this.removeClass("message", "bad");
            }
        },
        getSchema: function() {
            return this.model.get("schema");
        },
        validate: function(event) {
            var schema = this.model.get("schema"), valid = false, data;
            try {
                data = JSON.parse(schema);
                this.removeClass("schema", "bad");
                this.setMessage("Schema is valid.");
                this.model.set("schema", Augmented.Utility.PrettyPrint(data));
                valid = true;
            } catch(e) {
                this.setMessage("Schema is not valid!  Could Not parse schema!", true);
                this.addClass("schema", "bad");
            }
            return data;
        },
        clear: function(event) {
            this.model.unset("schema");
            this.removeClass("schema", "bad");
            this.setMessage("Ready.");
        },
        compile: function(event) {
            var data = this.validate(), schema;
            if (data) {
                schema = this.model.get("schema");
                this.sendMessage("compile", data);
            }
        }
    });

    var MyTable = Augmented.Presentation.DirectDOMAutomaticTable.extend({
    });

    var myTableView = null;

    var ViewerDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "viewer",
        el: "#viewer",
        settings: {
            sortable: false,
            editable: false,
            lineNumbers: false
        },
        init: function() {
            this.on("compile", function(data) {
                // do something
                this.schema = data;
                this.compile();
                logger.debug(APP_NAME + "Viewer got the data");
            });
            this.on("requestData", function(message) {
                this.sendMessage("yourDataRequest", this.getFullDataset());
                }
            );
        },
        getFullDataset: function() {
                return {
                    data: this.data,
                    settings: this.settings
                };
        },
        editableToggle: function(ee) {
            var e = this.boundElement("editable");
            if (this.settings.editable === true) {
                this.settings.editable = false;
                e.firstElementChild.classList.add("hidden");
            } else {
                this.settings.editable = true;
                e.firstElementChild.classList.remove("hidden");
            }
            this.compile();
        },
        sortableToggle: function() {
            var e = this.boundElement("sortable");
            if (this.settings.sortable === true) {
                this.settings.sortable = false;
                e.firstElementChild.classList.add("hidden");
            } else {
                this.settings.sortable = true;
                e.firstElementChild.classList.remove("hidden");
            }
            this.compile();
        },
        lineNumbersToggle: function() {
            var e = this.boundElement("lineNumber");
            if (this.settings.lineNumbers === true) {
                this.settings.lineNumbers = false;
                e.firstElementChild.classList.add("hidden");
            } else {
                this.settings.lineNumbers = true;
                e.firstElementChild.classList.remove("hidden");
            }
            this.compile();
        },
        compile: function() {
            if (myTableView && this.schema) {
                myTableView.setSchema(this.schema);
                myTableView.sortable = this.settings.sortable;
                myTableView.editable = this.settings.editable;
                myTableView.lineNumbers = this.settings.lineNumbers;
                myTableView.populate(this.data);
                myTableView.render();
            } else if (this.schema){
                myTableView = new MyTable({
                    schema: this.schema,
                    data: this.data,
                    sortable: this.settings.sortable,
                    editable: this.settings.editable,
                    lineNumbers: this.settings.lineNumbers,
                	el: "#renderWindow"
                });
                myTableView.render();
            }
            this.sendMessage("yourDataRequest", this.getFullDataset());
        },
        generate: function() {
            if (this.schema && this.schema.properties) {
                var i = 0, ii = 0, keys = Object.keys(this.schema.properties), l = keys.length, obj = {};
                this.data = [];
                for (ii = 0; ii < 5; ii++) {
                    obj = {};
                    for (i = 0; i < l; i++) {
                        obj[keys[i]] = this.makeUpData(
                            this.schema.properties[keys[i]].type,
                            this.schema.properties[keys[i]].format,
                            this.schema.properties[keys[i]].enum
                        );
                    }
                    this.data.push(obj);
                }
            }
            this.compile();
        },
        makeUpData: function(type, format, en) {
            if (type === "string") {
                if (format && format === "email") {
                    return "test" + Math.random() + "@example.com";
                } else if (en) {
                    var max = en.length, min = 0;
                    var v = Math.floor(Math.random() * (max - min + 1)) + min;
                    return en[v];
                }
                return "test" + Math.random();
            } else if (type === "integer") {
                return Math.floor(Math.random() * 100);
            } else if (type === "number") {
                return Math.random() * 100;
            } else if (type === "boolean") {
                var b = Math.floor(Math.random() * (1 - 0 + 1)) + 1;
                return (b == 1) ? true : false;
            }
            return null;
        }
    });

    var SourceDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "source",
        el: "#source",
        init: function() {
            this.model = new Augmented.Model();
            this.syncModelChange();
            this.on("compile", function(data) {
                this.compile(data);
                logger.debug(APP_NAME + "Source got the data");
            });
            this.on("updateYourData", function(dataset) {
                if (dataset) {
                    this.model.set("data", Augmented.Utility.PrettyPrint(dataset.data));
                    this.model.set("settings", dataset.settings);
                    this.compile();
                }
            });
        },
        compile: function(data) {
            var settings = this.model.get("settings");
            var javascript = "var schema = " + JSON.stringify(data) + ";\n\n" +
                "var MyTable = Augmented.Presentation.DirectDOMAutomaticTable.extend({\n" +
                "\tinit: function(options) { }\n" +
                "});\n\n" +
                "var at = new MyTable({ " +
                    "\tschema: schema, \n" +
                    "\tel: \"#autoTable\", \n" +
                    "\tlineNumbers: " + String(settings.lineNumbers) + ",\n" +
                    "\tsortable: " + String(settings.sortable) + ",\n" +
                    "\teditable: " + String(settings.editable) + ",\n" +
                    "\turl: \"http://www.example.com/data\"\n" +
                "});\n\n" +
                "at.render();";
            this.model.set("javascript", javascript);

            var html = "<div id=\"autoTable\" class=\"material\"></div>";
            this.model.set("html", html);

            var css = "<link type=\"text/css\" rel=\"stylesheet\" href=\"styles/table/material.css\"/>";
            this.model.set("css", css);
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

const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js"),
        app = require("./application.js"),
        BasicInfoView = require("./basicInfoView.js"),
        SchemaDecoratorView = require("./schemaDecoratorView.js"),
        logger = require("./logger.js");

const VIEWPORT_OFFSET = 238;

var SchemaEditorMediator = Augmented.Presentation.Mediator.extend({
    el: CONSTANTS.VIEW_MOUNT.ACTIVE_PANEL,
    remove: function() {
        /* off to unbind the events */
        this.off(this.el);
        this.stopListening();
        Augmented.Presentation.Dom.empty(this.el);
        return this;
    },
    goToProject: function() {
        this.currentSchema = null;
        app.clearDatastoreItem("currentSchema");
        app.navigate(CONSTANTS.NAVIGATION.PROJECT);
    },
    saveData: function() {
        app.setDatastoreItem("currentSchema", this.currentSchema);
        var schemas = app.getDatastoreItem("schemas");
        if (schemas) {
            schemas[this.currentSchema.index] = this.currentSchema.model;
            app.setDatastoreItem("schemas", schemas);
        }
    },
    updateSchema: function(schema) {
        if (schema) {
            logger.info("updating schema: " + schema);
            this.publish(CONSTANTS.NAMES_AND_QUEUES.SCHEMA, CONSTANTS.MESSAGES.UPDATE_SCHEMA, Augmented.Utility.PrettyPrint(schema));
        }
    },
    name: CONSTANTS.NAMES_AND_QUEUES.SCHEMA_EDITOR_MEDIATOR,
    init: function() {
        this.on(CONSTANTS.MESSAGES.GO_TO_PROJECT, function() {
            this.goToProject();
        });
        this.on(CONSTANTS.MESSAGES.UPDATE_DATA, function(data) {
            //this.publish("schema", "schemaData", data);
            this.currentSchema.model = data;
            this.saveData();
        });
        this.on(CONSTANTS.MESSAGES.UPDATE_SCHEMA, function(schema) {
            this.currentSchema.model.schema = schema;
            this.saveData();
        });
    },
    render: function() {
        this.currentSchema = app.getDatastoreItem("currentSchema");
        if (!this.currentSchema) {
            this.currentSchema = {
                index: 0,
                "model": {
                    "name": "",
                    "url": "",
                    "schema": {}
                }
			};
        }

        var t = document.querySelector(CONSTANTS.TEMPLATES.SCHEMA_EDITOR);
        var clone = document.importNode(t.content, true);
        this.el.appendChild(clone);
    }
});

var SchemaEditorView = SchemaDecoratorView.extend({
    setViewport: function() {
        this.el.style.height = (Augmented.Presentation.Dom.getViewportHeight() - VIEWPORT_OFFSET) + "px";
    }
});

//SchemaEditorController
module.exports = Augmented.Presentation.ViewController.extend({
    render: function() {
        this.mediator.render();
        var basicView = new BasicInfoView();
        this.manageView(basicView);
        var schemaView = new SchemaEditorView();
        schemaView.setViewport();
        this.manageView(schemaView);

        logger.info("Listening to Child Views...");

        this.mediator.observeColleagueAndTrigger(
            basicView, // colleague view
            CONSTANTS.NAMES_AND_QUEUES.BASIC,   // channel
            CONSTANTS.NAMES_AND_QUEUES.BASIC    // identifier
        );

        this.mediator.observeColleagueAndTrigger(
            schemaView, // colleague view
            CONSTANTS.NAMES_AND_QUEUES.SCHEMA,   // channel
            CONSTANTS.NAMES_AND_QUEUES.SCHEMA    // identifier
        );

        this.mediator.publish(CONSTANTS.NAMES_AND_QUEUES.BASIC, CONSTANTS.MESSAGES.UPDATE_NAME, this.mediator.currentSchema.model.name);
        this.mediator.updateSchema(this.mediator.currentSchema.model.schema);
    },
    initialize: function() {
        logger.info("Creating SchemaEditorController ...");
        this.mediator = new SchemaEditorMediator();
        logger.info("ready.");
        return this;
    },
    remove: function() {
        this.removeAllViews();
        this.mediator.remove();
        this.mediator = null;
    }
});

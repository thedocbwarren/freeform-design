const   Augmented = require("augmentedjs");
        Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js"),
        app = require("./application.js"),
        logger = require("./logger.js"),
        BasicInfoView = require("./basicInfoView.js"),
        AutoViewMediator = require("./autoViewMediator.js")
        SchemaDecoratorView = require("./schemaDecoratorView.js");

// define the classes
var AutoFormMediator = AutoViewMediator.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.AUTOFORM_MEDIATOR,
    render: function() {
        this.currentView = app.getDatastoreItem("currentView");
        if (!this.currentView) {
            this.currentView = { index: 0, "model": {
                "name": "untitled",
                "type": "AutomaticForm",
                "permissions": {
                    "include": [],
                    "exclude": []
                }
            }};
        }

        var t = document.querySelector(CONSTANTS.TEMPLATES.AUTO_FORM);
        var clone = document.importNode(t.content, true);
        this.el.appendChild(clone);
    }
});

var MyForm = Augmented.Presentation.AutomaticForm.extend({});

var ViewerDecoratorView = Augmented.Presentation.DecoratorView.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.VIEWER,
    el: CONSTANTS.VIEW_MOUNT.VIEWER,
    settings: {},
    init: function() {
        //defaults
        this.on(CONSTANTS.MESSAGES.COMPILE, function(data) {
            // do something
            this.schema = data;
            if (this.schema) {
                this.compile();
            }
        });
        this.on(CONSTANTS.MESSAGES.REQUEST_DATA, function(message) {
            this.sendMessage(CONSTANTS.MESSAGES.YOUR_DATA_REQUEST, this.getFullDataset());
        });
        this.on(CONSTANTS.MESSAGES.UPDATE_SETTINGS, function(settings) {
            this.settings = settings;
        });
    },
    getFullDataset: function() {
        return {
            data: this.data,
            schema: this.schema,
            settings: this.settings
        };
    },
    compile: function() {
        if (this.myFormView && this.schema) {
            this.myFormView.setSchema(this.schema);
            this.myFormView.populate(this.data);
            this.myFormView.render();
        } else if (this.schema){
            this.myFormView = new MyForm({
                schema: this.schema,
                data: this.data,
                el: CONSTANTS.VIEW_MOUNT.RENDER_WINDOW
            });
            this.myFormView.render();
        }
        if (this.schema){
            this.sendMessage(CONSTANTS.MESSAGES.YOUR_DATA_REQUEST, this.getFullDataset());
        }
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
    cleanup: function() {
        if (this.myFormView) {
            this.myFormView.remove();
        }
    }
});

module.exports = Augmented.Presentation.ViewController.extend({
    render: function() {
        this.autoFormMediatorView.render();

        // create the views - bindings happen automatically

        logger.info("Creating Child Views...");

        this.schemaView = new SchemaDecoratorView();
        this.viewerView = new ViewerDecoratorView();
        this.basicView = new BasicInfoView();

        logger.info("Listening to Child Views...");

        this.autoFormMediatorView.observeColleagueAndTrigger(
            this.basicView, // colleague view
            CONSTANTS.NAMES_AND_QUEUES.BASIC,   // channel
            CONSTANTS.NAMES_AND_QUEUES.BASIC    // identifier
        );

        this.autoFormMediatorView.observeColleagueAndTrigger(
            this.schemaView, // colleague view
            CONSTANTS.NAMES_AND_QUEUES.SCHEMA,   // channel
            CONSTANTS.NAMES_AND_QUEUES.SCHEMA    // identifier
        );

        this.autoFormMediatorView.observeColleagueAndTrigger(
            this.viewerView, // colleague view
            CONSTANTS.NAMES_AND_QUEUES.VIEWER,   // channel
            CONSTANTS.NAMES_AND_QUEUES.VIEWER    // identifier
        );

        this.autoFormMediatorView.publish(CONSTANTS.NAMES_AND_QUEUES.BASIC, CONSTANTS.MESSAGES.UPDATE_NAME, this.autoFormMediatorView.currentView.model.name);
        this.autoFormMediatorView.updateSchema(this.autoFormMediatorView.currentView.model.schema);
        this.autoFormMediatorView.updateSettings(this.autoFormMediatorView.currentView.model.settings);
    },
    initialize: function() {
        logger.info("Creating Mediator View...");

        this.autoFormMediatorView = new AutoFormMediator();

        logger.info("ready.");

        return this;
    },
    remove: function() {
        this.basicView.remove();
        this.schemaView.remove();
        this.viewerView.remove();
        this.autoFormMediatorView.remove();
        this.basicView = null;
        this.schemaView = null;
        this.viewerView = null;
        this.autoFormMediatorView = null;

        logger.info("removed.");
    }
});

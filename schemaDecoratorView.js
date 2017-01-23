const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js"),
        app = require("./application.js"),
        logger = require("./logger.js");

var CUSTOM_SCHEMA_SELECTION = "Custom";

// an option builder for the views
var schemaSelection = function(selected) {
    var html = "", i = 0, s = app.getDatastoreItem("schemas"), l = s.length,
        LI = "<li data-schema=\"material\" data-click=\"schemaSelector\"><i class=\"material-icons md-dark radio ";
    html = html + LI + "hidden\"></i>Custom</li>";
    for (i = 0; i < l; i++) {
        html = html + LI;
        if (s[i].name === selected) {
            html = html + "selected\"></i>";
        } else {
            html = html + "hidden\"></i>";
        }
        html = html + s[i].name + "</li>";
    }
    return html;
};

// SchemaDecoratorView
module.exports = Augmented.Presentation.DecoratorView.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.SCHEMA,
    el: CONSTANTS.VIEW_MOUNT.SCHEMA,
    init: function() {
        this.model = new Augmented.Model();
        this.syncModelChange("schema");
        this.syncModelChange("message");
        this.setMessage("Ready.");
        this.on(CONSTANTS.MESSAGES.UPDATE_SCHEMA, function(schema) {
            this.updateSchema(schema);
        });

        Augmented.Presentation.Dom.setValue("#schemaSelector ul", schemaSelection());

    },
    updateSchema: function(schema) {
        this.model.set("schema", schema);
        this.validate();
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
            this.sendMessage(CONSTANTS.MESSAGES.UPDATE_SCHEMA, data);
        } catch(e) {
            logger.info("Error parsing scheme - " + e);
            this.setMessage("Schema is not valid!  Could Not parse schema!", true);
            this.addClass("schema", "bad");
        }
        return data;
    },
    clear: function(event) {
        this.model.unset("schema");
        this.removeClass("schema", "bad");
        this.setMessage("Ready.");
        this.sendMessage(CONSTANTS.MESSAGES.UPDATE_SCHEMA, "");
    },
    compile: function(event) {
        var data = this.validate(), schema;
        if (data) {
            schema = this.model.get("schema");
            this.sendMessage(CONSTANTS.MESSAGES.COMPILE, data);
        }
    },
    schemaSelector: function(event) {
        var li = event.currentTarget, selected = (li.textContent || li.innerText);  // get the text node child
        if (selected !== CUSTOM_SCHEMA_SELECTION) {
            var schemas = app.getDatastoreItem("schemas"), schema = schemas.find(function(e) { return e.name === selected; });
            if (schema) {
                this.updateSchema(JSON.stringify(schema.schema));
            }
        }
    }
});

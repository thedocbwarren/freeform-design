define("schemaDecoratorView", ["augmented", "augmentedPresentation", "application"],
    function(Augmented, Presentation, app) {
    "use strict";

    var CUSTOM_SCHEMA_SELECTION = "Custom";

    // an option builder for the views
    var schemaSelection = function(selected) {
        var html = "", i = 0, s = app.datastore.get("schemas"), l = s.length, LI = "<li data-schema=\"material\" data-click=\"schemaSelector\"><i class=\"material-icons md-dark radio ";
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

    var SchemaDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "schema",
        el: "#schema",
        init: function() {
            this.model = new Augmented.Model();
            this.syncModelChange("schema");
            this.syncModelChange("message");
            this.setMessage("Ready.");
            this.on("updateSchema", function(schema) {
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
                this.sendMessage("updateSchema", data);
            } catch(e) {
                app.log("Error parsing scheme - " + e);
                this.setMessage("Schema is not valid!  Could Not parse schema!", true);
                this.addClass("schema", "bad");
            }
            return data;
        },
        clear: function(event) {
            this.model.unset("schema");
            this.removeClass("schema", "bad");
            this.setMessage("Ready.");
            this.sendMessage("updateSchema", "");
        },
        compile: function(event) {
            var data = this.validate(), schema;
            if (data) {
                schema = this.model.get("schema");
                this.sendMessage("compile", data);
            }
        },
        schemaSelector: function(event) {
            var li = event.currentTarget, selected = (li.textContent || li.innerText);  // get the text node child
            if (selected !== CUSTOM_SCHEMA_SELECTION) {
                var schemas = app.datastore.get("schemas"), schema = schemas.find(function(e) { return e.name === selected; });
                if (schema) {
                    this.updateSchema(JSON.stringify(schema.schema));
                }
            }
        }
    });

    return SchemaDecoratorView;
});

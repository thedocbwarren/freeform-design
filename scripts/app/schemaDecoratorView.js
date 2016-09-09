define("schemaDecoratorView", ["augmented", "augmentedPresentation", "application"],
    function(Augmented, Presentation, app) {
    "use strict";

    // an option builder for the views
    var schemaSelection = function(selected) {
        var html = "", i = 0, s = app.datastore.get("schemas"), l = s.length;
        html = html + "<option value=\"\">Custom</option>";
        for (i = 0; i < l; i++) {
            html = html + "<option";
            if (s[i].name === selected) {
                html = html + " selected";
            }
            html = html + " value=\"" + s[i].name + "\" >" + s[i].name + "</option>";
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
                this.model.set("schema", schema);
                this.validate();
            });

            Augmented.Presentation.Dom.setValue("#schemaSelector", schemaSelection());

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
        }
    });

    return SchemaDecoratorView;
});

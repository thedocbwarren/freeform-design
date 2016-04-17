define(['augmented', 'augmentedPresentation', 'application', 'filesaver'], function(Augmented, Presentation, app) {
    "use strict";

    // define the classes
    var TableCreateMediator = Augmented.Presentation.Mediator.extend({
        name:"tableMediator",
        el: "#activePanel",
        init: function() {
            this.on("compile",
                function(data) {
                    if (data) {
                        this.publish("viewer", "compile", data);
                        this.publish("source", "compile", data);
                    }
                }
            );
            this.on("yourDataRequest", function(data) {
                this.publish("source", "updateYourData", data);
            });
        },
        render: function() {
            var t = document.querySelector('#tableCreateTemplate');
            // consider an inject temnplate method simular to DecoratorView
            var clone = document.importNode(t.content, true);
            this.el.appendChild(clone);
        },
        remove: function() {
            /* off to unbind the events */
            this.off(this.el);
            this.stopListening();
            Augmented.Presentation.Dom.empty(this.el);
            return this;
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
        setTheme: function(theme) {
            var e = document.querySelector(this.el + " > table");
            if (e) {
                e.setAttribute("class", theme);
            }
        }
    });

    var ViewerDecoratorView = Augmented.Presentation.DecoratorView.extend({
        name: "viewer",
        el: "#viewer",
        settings: {
            sortable: false,
            editable: false,
            lineNumbers: false,
            theme: "material"
        },
        themes: {
            "material": { name:         "Material",
                          stylesheet:   "styles/table/material.css"
                        },
            "plain":    { name:         "Plain",
                          stylesheet:   "styles/table/plain.css"
                        },
            "spaceGray":{ name:         "Space Gray",
                        stylesheet:     "styles/table/spaceGray.css"
                        }
        },
        init: function() {
            //defaults
            this.setTheme(this.settings.theme);
            this.on("compile", function(data) {
                // do something
                this.schema = data;
                if (this.schema) {
                    this.compile();
                }
            });
            this.on("requestData", function(message) {
                this.sendMessage("yourDataRequest", this.getFullDataset());
            });
        },
        getFullDataset: function() {
            return {
                data: this.data,
                schema: this.schema,
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
        theme: function(e) {
            var item = e.target;
            var theme = item.getAttribute(this.bindingAttribute());
            this.setTheme(theme);
        },
        setTheme: function(t) {
            this.settings.theme = t;
            var i = 0, keys = Object.keys(this.themes), l = keys.length, theme, bound;
            for (i = 0; i < l; i++) {
                theme = keys[i];
                bound = this.boundElement(theme);
                if (this.settings.theme === theme) {
                    bound.firstElementChild.classList.remove("hidden");
                } else {
                    bound.firstElementChild.classList.add("hidden");
                }
            }

            this.compile();
        },
        compile: function() {
            if (this.myTableView && this.schema) {
                this.myTableView.setSchema(this.schema);
                this.myTableView.sortable = this.settings.sortable;
                this.myTableView.editable = this.settings.editable;
                this.myTableView.lineNumbers = this.settings.lineNumbers;
                this.myTableView.populate(this.data);
                this.myTableView.render();
                this.myTableView.setTheme(this.settings.theme);
            } else if (this.schema){
                this.myTableView = new MyTable({
                    schema: this.schema,
                    data: this.data,
                    sortable: this.settings.sortable,
                    editable: this.settings.editable,
                    lineNumbers: this.settings.lineNumbers,
                    el: "#renderWindow"
                });
                this.myTableView.render();
                this.myTableView.setTheme(this.settings.theme);
            }
            if (this.schema){
                this.sendMessage("yourDataRequest", this.getFullDataset());
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
        },
        cleanup: function() {
            if (this.myTableView) {
                this.myTableView.remove();
            }
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
                //app.log("Source got the data");
            });
            this.on("updateYourData", function(dataset) {
                if (dataset) {
                    this.model.set("data", Augmented.Utility.PrettyPrint(dataset.data));
                    this.model.set("settings", dataset.settings);
                    this.compile(dataset.schema);
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

            var html = "<div id=\"autoTable\" class=\"" + settings.theme + "\"></div>";
            this.model.set("html", html);

            var css = "<link type=\"text/css\" rel=\"stylesheet\" href=\"styles/table/" + settings.theme + "\"/>";
            this.model.set("css", css);
        },
        save: function() {
            var blob = new Blob([JSON.stringify(this.model.toJSON())], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "myTable.json");
        }
    });

    var TableCreateController = Augmented.Presentation.ViewController.extend({
        render: function() {
            this.tableCreateMediatorView.render();

            // create the views - bindings happen automatically

            app.log("Creating Table Child Views...");

            this.schemaView = new SchemaDecoratorView();
            this.viewerView = new ViewerDecoratorView();
            this.sourceView = new SourceDecoratorView();

            app.log("Listening to Child Views...");

            this.tableCreateMediatorView.observeColleagueAndTrigger(
                this.schemaView, // colleague view
                "schema",   // channel
                "schema"    // identifer
            );

            this.tableCreateMediatorView.observeColleagueAndTrigger(
                this.viewerView, // colleague view
                "viewer",   // channel
                "viewer"    // identifer
            );

            this.tableCreateMediatorView.observeColleagueAndTrigger(
                this.sourceView, // colleague view
                "source",   // channel
                "source"    // identifer
            );
        },
        initialize: function() {
            app.log("Creating Table Mediator View...");

            this.tableCreateMediatorView = new TableCreateMediator();

            app.log("Table Create ready.");

            return this;
        },
        remove: function() {
            this.schemaView.remove();
            this.viewerView.remove();
            this.sourceView.remove();
            this.tableCreateMediatorView.remove();
            this.schemaView = null;
            this.viewerView = null;
            this.sourceView = null;
            this.tableCreateMediatorView = null;

            app.log("Table Create removed.");
        }
    });

    return new TableCreateController();
});

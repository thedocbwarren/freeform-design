define("application", ["augmented", "augmentedPresentation"], function(Augmented, Presentation) {
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
    app.VERSION = "0.4.0";

    return app;
});

// Models
define('models', ['augmented'],
    function(Augmented) {
    "use strict";

    var Models = {
        ProjectModel: Augmented.Model.extend({
            defaults: {
                "project": "untitled",
                "filename": "",
                "routes": [],
                "views": [],
                "controllers": [],
                "stylesheets": [],
                "models": [],
                "schemas": [],
                "currentView": null,
                "currentSchema": null
            }
        }),
        ControllerModel: Augmented.Model.extend({
            defaults : {
                "controller": ""
            }
        }),
        ViewModel: Augmented.Model.extend({
            defaults : {
                "name": "untitled",
                "type": "View",
                "permissions": {
                    "include": [],
                    "exclude": []
                },
                "model": null
            }
        }),
        StylesheetsModel: Augmented.Model.extend({
            defaults : {
                "stylesheet": "",
                "async": true
            }
        }),
        RouteModel: Augmented.Model.extend({
            defaults: {
                "route": "",
                "callback": "",
                "type": ""
            }
        }),
        PermissionModel: Augmented.Model.extend({
            defaults: {
                "permission": "",
                "exclude": false
            }
        }),
        ObserveViewModel: Augmented.Model.extend({
            defaults: {
                "view": "",
                "channel": ""
            }
        }),
        ModelModel: Augmented.Model.extend({
            defaults: {
                "name": "",
                "schema": "",
                "url": ""
            }
        }),
        SchemaModel: Augmented.Model.extend({
            defaults: {
                "name": "",
                "url": "",
                "schema": {}
            }
        })
    };
    return Models;
});

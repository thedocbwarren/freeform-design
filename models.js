const   Augmented = require("augmentedjs");

module.exports = {
    ProjectModel: Augmented.Model.extend({
        defaults: {
            "project": "untitled",
            "filename": "",
            "version": "1.7",
            "routes": [],
            "views": [],
            "controllers": [],
            "stylesheets": [],
            "models": [],
            "collections": [],
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
    CollectionModel: Augmented.Model.extend({
        defaults: {
            "name": "",
            "schema": "",
            "url": "",
            "pagination": false,
            "paginationKey": null,
            "localStorage": false
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

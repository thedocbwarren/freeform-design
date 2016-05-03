// Models
define('models', ['augmented'],
    function(Augmented) {
    "use strict";

    var Models = {
        ProjectModel: Augmented.Model.extend({
            defaults: {
                "project": "untitled",
                "filename": "",
                "routes": {
                    "functionRoutes": [],
                    "viewRoutes": [],
                    "controllerRoutes": []
                },
                "views": [],
                "controllers": [],
                "stylesheets": {
                    "asyncStylesheets": [],
                    "syncStylesheets": []
                },
                "currentView": null,
            }
        }),
        ControllerModel: Augmented.Model.extend({
            defaults : {
                "currentControllers": []
            }
        }),
        ViewModel: Augmented.Model.extend({
            defaults : {
                "name": "untitled",
                "type": "View",
                "permissions": {
                    "include": [],
                    "exclude": []
                }
            }
        }),
        StylesheetsModel: Augmented.Model.extend({
            defaults : {
                "asyncStylesheets": [],
                "syncStylesheets": []
            }
        }),
        RoutesModel: Augmented.Model.extend({
            defaults: {
                "functionRoutes": [],
                "viewRoutes": [],
                "controllerRoutes": []
            }
        }),
        PermissionModel: Augmented.Model.extend({
            defaults : {
                "permission": "",
                "exclude": false
            }
        })

    };
    return Models;
});

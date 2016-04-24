// Models
define('models', ['augmented'],
    function(Augmented) {
    "use strict";

    var Models = {
        ControllerModel: Augmented.Model.extend({
            defaults : {
                "currentControllers": []
            }
        }),
        ViewModel: Augmented.Model.extend({
            defaults : {
                "name": "untitled",
                "type": "View",
                "panel": false
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
        })

    };
    return Models;
});

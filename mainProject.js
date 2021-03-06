const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js"),
        app = require("./application.js"),
        StylesheetsView = require("./stylesheetsSubView.js"),
        RoutesView = require("./routesSubView.js"),
        ViewsView = require("./viewsSubView.js"),
        ControllersView = require("./controllersSubView.js"),
        ModelsView = require("./modelsSubView.js"),
				CollectionsView = require("./collectionsSubView.js"),
        SchemasView = require("./schemasSubView.js"),
        OverviewView = require("./overviewSubView.js"),
        logger = require("./logger.js");

const VIEWPORT_OFFSET = 55;

var ProjectSideNavigation = Augmented.Presentation.DecoratorView.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.SIDE_NAVIGATION,
    el: CONSTANTS.VIEW_MOUNT.SIDE_NAVIGATION,
    currentNav: "",
    init: function() {
        this.syncModelChange("name");
				logger.debug("App " + JSON.stringify(app));
        this.model.set("name", app.getDatastoreItem("project"));
        this.on(CONSTANTS.MESSAGES.MARK_NAVIGATION, function(nav) {
            this.markNavigation(nav);
        });
    },
    defaultNavigation: function() {
        this.overview();
    },
    markNavigation: function(nav) {
        Augmented.Presentation.Dom.removeClass(this.currentNav, CONSTANTS.NAVIGATION.CURRENT);
        var navListEl = this.boundElement(nav);
        this.currentNav = navListEl;
        Augmented.Presentation.Dom.addClass(this.currentNav, CONSTANTS.NAVIGATION.CURRENT);
    },
    overview: function() {
        this.sendMessage(CONSTANTS.MESSAGES.NAVIGATION, CONSTANTS.NAVIGATION.OVERVIEW);
    },
    stylesheets: function() {
        this.sendMessage(CONSTANTS.MESSAGES.NAVIGATION, CONSTANTS.NAVIGATION.STYLESHEETS);
    },
    routes: function() {
        this.sendMessage(CONSTANTS.MESSAGES.NAVIGATION, CONSTANTS.NAVIGATION.ROUTES);
    },
    views: function() {
        this.sendMessage(CONSTANTS.MESSAGES.NAVIGATION, CONSTANTS.NAVIGATION.VIEWS);
    },
    controllers: function() {
        this.sendMessage(CONSTANTS.MESSAGES.NAVIGATION, CONSTANTS.NAVIGATION.CONTROLLERS);
    },
    models: function() {
        this.sendMessage(CONSTANTS.MESSAGES.NAVIGATION, CONSTANTS.NAVIGATION.MODELS);
    },
		collections: function() {
        this.sendMessage(CONSTANTS.MESSAGES.NAVIGATION, CONSTANTS.NAVIGATION.COLLECTIONS);
    },
    schemas: function() {
        this.sendMessage(CONSTANTS.MESSAGES.NAVIGATION, CONSTANTS.NAVIGATION.SCHEMAS);
    }
});

var MainProjectMediator = Augmented.Presentation.Mediator.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.PROJECT_MEDIATOR,
    el: CONSTANTS.VIEW_MOUNT.ACTIVE_PANEL,
    basePanelEl: CONSTANTS.VIEW_MOUNT.BASE_PANEL,
    currentNavigation: "",
    currentNavigationView: null,
    init: function() {
        this.on(CONSTANTS.MESSAGES.NAVIGATION, function(navigation) {
            if (navigation === CONSTANTS.NAVIGATION.STYLESHEETS && this.currentNavigation !== navigation) {
                this.doNavigation(navigation, StylesheetsView);
            } else if (navigation === CONSTANTS.NAVIGATION.ROUTES && this.currentNavigation !== navigation) {
                this.doNavigation(navigation, RoutesView);
            } else if (navigation === CONSTANTS.NAVIGATION.VIEWS && this.currentNavigation !== navigation) {
                this.doNavigation(navigation, ViewsView);
            } else if (navigation === CONSTANTS.NAVIGATION.CONTROLLERS && this.currentNavigation !== navigation) {
                this.doNavigation(navigation, ControllersView);
            } else if (navigation === CONSTANTS.NAVIGATION.MODELS && this.currentNavigation !== navigation) {
                this.doNavigation(navigation, ModelsView);
						} else if (navigation === CONSTANTS.NAVIGATION.COLLECTIONS && this.currentNavigation !== navigation) {
								this.doNavigation(navigation, CollectionsView);
            } else if (navigation === CONSTANTS.NAVIGATION.SCHEMAS && this.currentNavigation !== navigation) {
                this.doNavigation(navigation, SchemasView);
            } else if (navigation === CONSTANTS.NAVIGATION.OVERVIEW && this.currentNavigation !== navigation) {
                this.doNavigation(navigation, OverviewView);
            }
        });
        this.setViewportHeight();
    },
    setViewportHeight: function() {
        var header = Augmented.Presentation.Dom.selector(CONSTANTS.VIEW_MOUNT.HEADER).offsetHeight;
        this.el.style.height = (Augmented.Presentation.Dom.getViewportHeight() - ((header) ? (header) : VIEWPORT_OFFSET)) + "px";
    },
    doNavigation: function(navigation, ViewObject) {
        this.removeLastView();
        this.currentNavigation = navigation;

				// add navigation for breadcrumbing
				app.setCurrentBreadcrumb(navigation);

        this.publish(CONSTANTS.NAMES_AND_QUEUES.SIDE_NAVIGATION, CONSTANTS.MESSAGES.MARK_NAVIGATION, navigation);

        logger.info("adding view");

        var el = Augmented.Presentation.Dom.selector(this.basePanelEl);
        Augmented.Presentation.Dom.empty(el);
        Augmented.Presentation.Dom.injectTemplate("#" + navigation + "Template", el);
        this.currentNavigationView = new ViewObject();
        this.observeColleagueAndTrigger(
            this.currentNavigationView, // colleague view
            CONSTANTS.NAMES_AND_QUEUES.MY_COLLEAGUE,   // channel
            CONSTANTS.NAMES_AND_QUEUES.MY_COLLEAGUE    // identifier
        );
        this.setViewportHeight();
    },
    removeLastView: function() {
        if (this.currentNavigationView) {
            logger.info("removing last view");
            this.dismissColleagueTrigger(this.currentNavigationView, CONSTANTS.NAMES_AND_QUEUES.MY_COLLEAGUE, CONSTANTS.NAMES_AND_QUEUES.MY_COLLEAGUE);
            this.currentNavigationView.remove();
        }
        this.currentNavigation = null;
    },
    render: function() {
				logger.debug("rendering main project");
        Augmented.Presentation.Dom.injectTemplate(CONSTANTS.TEMPLATES.MAIN_PROJECT, this.el);

        this.sideNav = new ProjectSideNavigation();
        this.observeColleagueAndTrigger(
            this.sideNav, // colleague view
            CONSTANTS.NAMES_AND_QUEUES.SIDE_NAVIGATION,   // channel
            CONSTANTS.NAMES_AND_QUEUES.SIDE_NAVIGATION    // identifier
        );
				// go where we were
				var bc = app.getCurrentBreadcrumb();
				if (bc) {
					if (bc === CONSTANTS.NAVIGATION.STYLESHEETS) {
		                this.doNavigation(bc, StylesheetsView);
		            } else if (bc === CONSTANTS.NAVIGATION.ROUTES) {
		                this.doNavigation(bc, RoutesView);
		            } else if (bc === CONSTANTS.NAVIGATION.VIEWS) {
		                this.doNavigation(bc, ViewsView);
		            } else if (bc === CONSTANTS.NAVIGATION.CONTROLLERS) {
		                this.doNavigation(bc, ControllersView);
		            } else if (bc === CONSTANTS.NAVIGATION.MODELS) {
		                this.doNavigation(bc, ModelsView);
					} else if (bc === CONSTANTS.NAVIGATION.COLLECTIONS) {
						this.doNavigation(bc, CollectionsView);
		            } else if (bc === CONSTANTS.NAVIGATION.SCHEMAS) {
		                this.doNavigation(bc, SchemasView);
		            } else if (bc === CONSTANTS.NAVIGATION.OVERVIEW) {
		                this.doNavigation(bc, OverviewView);
		            } else {
						// setup default nav
						this.sideNav.defaultNavigation();
					}
				} else {
					// setup default nav
					this.sideNav.defaultNavigation();
				}
    },
    remove: function() {
        if (this.sideNav) {
            this.sideNav.remove();
        }
        if (this.currentNavigationView) {
            this.currentNavigationView.remove();
        }
        /* off to unbind the events */
        this.off();
        this.stopListening();
        Augmented.Presentation.Dom.empty(this.el);
        return this;
    }
});

// The controller for Main
// MainProjectController
module.exports = Augmented.Presentation.ViewController.extend({
    render: function() {
        this.projectMediator.render();
    },
    initialize: function() {
		logger.debug("Init main project");
        this.projectMediator = new MainProjectMediator();
        return this;
    },
    remove: function() {
        this.projectMediator.remove();
        this.projectMediator = null;
    }
});

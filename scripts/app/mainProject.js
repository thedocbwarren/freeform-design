// Main project module
define('mainProject', ['augmented', 'augmentedPresentation'], function(Augmented, Presentation) {
    "use strict";

    var StylesheetsView = Augmented.Presentation.DecoratorView.extend({
        name: "stylesheets",
        el: "#stylesheets",
        init: function() {
            this.model = new Augmented.Model();
            this.syncModelChange("styles");
            var myStyles = ["styles/reset.css",
                            "styles/layout.css",
                            "styles/theme.css",
                            "https://fonts.googleapis.com/icon?family=Material+Icons",
                            "https://fonts.googleapis.com/css?family=Roboto:400"];

            this.model.set("styles", myStyles);
        },
        addStylesheet: function() {
            var ss = this.model.get("stylesheet");
            var styles = this.model.get("styles").slice(0);
            styles.push(ss);
            this.model.set("styles", styles);
            this.model.unset("stylesheet");
            var s = this.boundElement("stylesheet");
            s.value = "";
        },
        removeAllStylesheets: function() {
            this.model.unset("styles");
            this.model.set("styles", []);
            this.model.unset("stylesheet");
            var s = this.boundElement("stylesheet");
            s.value = "";
        }
    });

    var RoutesView = Augmented.Presentation.DecoratorView.extend({
        name: "routes",
        el: "#routes",
        init: function() {
            this.model = new Augmented.Model();
        }
    });

    var ProjectSideNavigation = Augmented.Presentation.DecoratorView.extend({
        name: "sideNav",
        el: "#sideNav",
        currentNav: "",
        init: function() {
            this.syncModelChange("name");
            this.model.set("name", "My Application"); // obviousely get this from the main app

            this.on("markNavigation", function(nav) {
                this.markNavigation(nav);
            });

        },
        markNavigation: function(nav) {
            Augmented.Presentation.Dom.removeClass(this.currentNav, "current");
            var navListEl = this.boundElement(nav);
            this.currentNav = navListEl;
            Augmented.Presentation.Dom.addClass(this.currentNav, "current");
        },
        stylesheets: function() {
            this.sendMessage("navigation", "stylesheets");
        },
        routes: function() {
            this.sendMessage("navigation", "routes");
        },
        views: function() {
            this.sendMessage("navigation", "views");
        },
        controllers: function() {
            this.sendMessage("navigation", "controllers");
        }
    });

    var MainProjectMediator = Augmented.Presentation.Mediator.extend({
        name:"projectMediator",
        el: "#activePanel",
        basePanelEl: "#basePanel",
        currentNavigation: "",
        currentNavigationView: null,
        init: function() {
            this.on("navigation", function(navigation) {
                if (navigation === "stylesheets" && this.currentNavigation !== navigation) {
                    this.doNavigation(navigation, StylesheetsView);
                } else if (navigation === "routes" && this.currentNavigation !== navigation) {
                    this.doNavigation(navigation, RoutesView);
                } else if (navigation === "views" && this.currentNavigation !== navigation) {
                    //this.doNavigation(navigation, ViewsView);
                } else if (navigation === "controllers" && this.currentNavigation !== navigation) {
                    //this.doNavigation(navigation, ControllersView);
                }
            });
            this.el.style.height = (Augmented.Presentation.Dom.getViewportHeight() - 70) + "px";
        },
        doNavigation: function(navigation, viewObject) {
            this.removeLastView();
            this.currentNavigation = navigation;
            this.publish("sideNav", "markNavigation", navigation);

            var el = Augmented.Presentation.Dom.selector(this.basePanelEl);
            Augmented.Presentation.Dom.empty(el);
            Augmented.Presentation.Dom.injectTemplate("#" + navigation + "Template", el);
            this.currentNavigationView = new viewObject();
            this.observeColleagueAndTrigger(
                this.currentNavigationView, // colleague view
                "myColleague",   // channel
                "myColleague"    // identifer
            );

        },
        removeLastView: function() {
            if (this.currentNavigationView) {
                this.dismissColleagueTrigger(this.currentNavigationView, "myColleague", "myColleague");
                this.currentNavigationView.remove();
            }
            this.currentNavigation = null;
        },
        render: function() {
            Augmented.Presentation.Dom.injectTemplate("#mainProjectTemplate", this.el);
            this.sideNav = new ProjectSideNavigation();
            this.observeColleagueAndTrigger(
                this.sideNav, // colleague view
                "sideNav",   // channel
                "sideNav"    // identifer
            );
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

    var MainProjectController = Augmented.Presentation.ViewController.extend({
        render: function() {
            this.projectMediator.render();
        },
        initialize: function() {
            this.projectMediator = new MainProjectMediator();
            return this;
        },
        remove: function() {
            this.projectMediator.remove();
            this.projectMediator = null;
        }
    });
    return new MainProjectController();
});

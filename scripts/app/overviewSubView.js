define("overviewSubView", ["augmented", "augmentedPresentation", "application"],
    function(Augmented, Presentation, app) {
    "use strict";

    var OverviewView = Augmented.Presentation.DecoratorView.extend({
        name: "overview",
        el: "#overview",
        init: function() {

        },
        render: function() {
            var e = this.boundElement("overviewDetail");
            this.removeTemplate(e, true);
            //this.injectTemplate("", e);
        }
    });
    return OverviewView;
});

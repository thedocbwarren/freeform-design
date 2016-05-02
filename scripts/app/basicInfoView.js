define("basicInfoView", ['augmented', 'augmentedPresentation'], function(Augmented, Presentation) {
    "use strict";
    var BasicInfoView = Augmented.Presentation.DecoratorView.extend({
        name: "basic",
        el: "#basic",
        init: function() {
            this.syncModelChange("name");
            this.on("updateName", function(data) {
                this.setName(data);
            });
        },
        setName: function(name) {
            this.model.set("name", name);
        },
        back: function() {
            this.sendMessage("goToProject");
        }
    });
    return BasicInfoView;
});

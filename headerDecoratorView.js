const   Augmented = require("augmentedjs");
	    Augmented.Presentation = require("augmentedjs-presentation");
const   CONSTANTS = require("./constants.js");

module.exports = Augmented.Presentation.DecoratorView.extend({
    name: CONSTANTS.NAMES_AND_QUEUES.HEADER,
    el: CONSTANTS.VIEW_MOUNT.HEADER,
    notifyEl: CONSTANTS.VIEW_MOUNT.NOTIFY,
    init: function() {
        this.on(CONSTANTS.MESSAGES.HIGHLIGHT, function(color) {
            Augmented.Presentation.Dom.addClass(this.el, color);
        });
        this.on(CONSTANTS.MESSAGES.NOTIFICATION, function(message) {
            this.notification(message, false);
        });
        this.on(CONSTANTS.MESSAGES.ERROR, function(message) {
            this.notification(message, true);
        });
    },
    notification: function(message, error) {
        if (message) {
            Augmented.Presentation.Dom.setValue(this.notifyEl, message);
            Augmented.Presentation.Dom.addClass(this.notifyEl, ((error) ? "showError" : "show"));
            Augmented.Presentation.Dom.addClass(this.el, ((error) ? "red" : "green"));
            var that = this;
            setTimeout(
                function(){
                    Augmented.Presentation.Dom.removeClass(that.notifyEl, ((error) ? "showError" : "show"));
                    Augmented.Presentation.Dom.removeClass(that.el, ((error) ? "red" : "green"));
                },
            4000);
        }
    },
    logo: function() {
        window.location = CONSTANTS.WEBSITE;
    },
    // toggles the hamburger
    hamburger: function() {
        if (!this.modal) {
            var menu = this.boundElement("hamburgerMenu");
            var r = this.boundElement("hamburgerClickRegion");
            r.classList.toggle("model");
            menu.classList.toggle("menu--on");
        }
    },
    about: function() {
        if (!this.modal) {
            this.hamburger();
            var t = document.querySelector(CONSTANTS.TEMPLATES.ABOUT);
            var clone = document.importNode(t.content, true);
            this.injectTemplate(clone, this.el);
            this.modal = true;
            Augmented.D.setValue("#version", "Version " + CONSTANTS.VERSION);
        }
    },
    aboutButtonClose: function() {
        if (this.modal) {
            var dialog = this.boundElement("aboutDialog");
            this.removeTemplate(dialog);
            this.modal = false;
        }
    },
    create: function() {
        if (!this.modal) {
            this.hamburger();
            var t = document.querySelector(CONSTANTS.TEMPLATES.CREATE_PROJECT);
            var clone = document.importNode(t.content, true);
            this.injectTemplate(clone, this.el);
            this.modal = true;
        }
    },
    projectCreateButtonClose: function() {
        if (this.modal) {
            var dialog = this.boundElement("createProjectDialog");
            this.removeTemplate(dialog);
            this.modal = false;
        }
    },
    projectCreateButton: function() {
        var name = this.model.get("projectName");
        if (this.modal && name) {
            this.projectCreateButtonClose();
            this.sendMessage(CONSTANTS.MESSAGES.CREATE_PROJECT, name);
        }
    },
    open: function() {
        if (!this.modal) {
            this.hamburger();
            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                var t = document.querySelector(CONSTANTS.TEMPLATES.OPEN_PROJECT);
                var clone = document.importNode(t.content, true);
                this.injectTemplate(clone, this.el);
                this.modal = true;
            } else {
                alert("Sorry no support for file reading on this browser.  Will polyfill shortly.");
            }
        }
    },
    projectOpenButtonClose: function() {
        if (this.modal) {
            var dialog = this.boundElement("openProjectDialog");
            this.removeTemplate(dialog);
            this.modal = false;
        }
    },
    projectOpenButton: function() {
        if (this.modal) {
            var el = this.boundElement("projectFile");
            var file = el.files[0];
            this.projectOpenButtonClose();
            this.sendMessage(CONSTANTS.MESSAGES.OPEN_PROJECT, file);
        }
    },
    save: function() {
        if (!this.modal) {
            this.hamburger();
            var t = document.querySelector(CONSTANTS.TEMPLATES.SAVE_PROJECT);
            var clone = document.importNode(t.content, true);
            this.injectTemplate(clone, this.el);
            this.modal = true;
        }
    },
    projectSaveButtonClose: function() {
        if (this.modal) {
            var dialog = this.boundElement("saveProjectDialog");
            this.removeTemplate(dialog);
            this.modal = false;
        }
    },
    projectSaveButton: function() {
        var el = this.boundElement("projectFile");
        if (this.modal && el && el.value) {
            this.projectSaveButtonClose();
            this.sendMessage(CONSTANTS.MESSAGES.SAVE_PROJECT, el.value);
        }
    },
    compile: function() {
        this.hamburger();
        this.sendMessage(CONSTANTS.MESSAGES.COMPILE_PROJECT, null);
    }
});

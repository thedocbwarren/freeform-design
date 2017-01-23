(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['permissionsTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <li>\n        <div class=\"flexContainer\">\n            <p>"
    + alias4(((helper = (helper = helpers.permission || (depth0 != null ? depth0.permission : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"permission","hash":{},"data":data}) : helper)))
    + "<br/>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.exclude : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "                </span>\n            </p>\n            <div>\n                <div class=\"inlineButton\" data-permission=\""
    + alias4(((helper = (helper = helpers.permission || (depth0 != null ? depth0.permission : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"permission","hash":{},"data":data}) : helper)))
    + "\" data-exclude=\""
    + alias4(((helper = (helper = helpers.exclude || (depth0 != null ? depth0.exclude : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exclude","hash":{},"data":data}) : helper)))
    + "\" data-index=\""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-permissions=\"edit\" data-click=\"editPermission\"><i class=\"material-icons md-dark\">edit</i></div>\n            </div>\n        </div>\n    </li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "                <span class=\"secondary red\">Must not have\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "                <span class=\"secondary green\">Must Have\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.currentPermissions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"useData":true});
})();
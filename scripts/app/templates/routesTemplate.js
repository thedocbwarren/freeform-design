define(['handlebars'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['routesTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li>"
    + alias4(((helper = (helper = helpers.route || (depth0 != null ? depth0.route : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"route","hash":{},"data":data}) : helper)))
    + ": "
    + alias4(((helper = (helper = helpers.callback || (depth0 != null ? depth0.callback : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"callback","hash":{},"data":data}) : helper)))
    + " <div class=\"inlineButton\" data-routes=\"edit\" data-click=\"editRoute\"><i class=\"material-icons md-dark\">edit</i></div></li>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<h2>Function Routes</h2><div id=\"functionRoutes\"><ul>"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.functionRoutes : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul></div><h2>View Routes</h2><div id=\"viewRoutes\" class=\"editList\"><ul>"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.viewRoutes : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul></div><h2>Controller Routes</h2><div id=\"controllerRoutes\" class=\"editList\"><ul>"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.controllerRoutes : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul></div>\n";
},"useData":true});
});
